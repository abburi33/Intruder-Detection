# For flask and related operations
from flask import Flask, send_from_directory, jsonify, Response, request
from flask_cors import CORS
import socket

# Supress warnings for entire notebook
import warnings
warnings.filterwarnings('ignore')

# Import the video processing and deep learning modules
import cv2
import numpy as np
import os
import threading
from ultralytics import YOLO
from datetime import datetime
import time
import math
import json

# Get firebase backend storage functions
import requests
from google.oauth2 import service_account
import firebase_admin
from firebase_admin import credentials, storage, firestore

# FLASK SETUP !~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app = Flask(__name__)
CORS(app, origins=["*"])  # Allow access from devices on your network

# Load YOLO model
yolo_model = YOLO("yolov8n.pt")  # Ensure you have the model downloaded

# Create a folder for saving intruder images
INTRUDER_FOLDER = "intruders"
os.makedirs(INTRUDER_FOLDER, exist_ok=True)

# Intruder detection state
state = 'stop'   # 'stop', 'start'
last_intruder_time = 0    # intruder time tracker
follow_update = False     # update flag to tick intruder time

# Flag to prevent multiple burst threads running at the same time
burst_in_progress = False

# To Simulate the alert message
alert_message = "ALERT: Intruder Detected!"
alert_triggered = False  # This flag will determine if an alert should be sent

# FIREBASE FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# # Upload image to Firebase Storage
def upload_image(image_path):
    bucket = storage.bucket()
    blob = bucket.blob(f"intruders/{os.path.basename(image_path)}")
    blob.upload_from_filename(image_path)
    blob.make_public()  # Makes the image URL publicly accessible (optional)

    return blob.public_url

# # Save Metadata to Firestore
def save_metadata(image_url):
    doc_ref = db.collection('intruder_logs').add({
        'imageUrl': image_url,
        'timestamp': datetime.now().isoformat()
    })

# # Full Function to Call from Detection Code
def handle_intruder_detection(image_path):
    image_url = upload_image(image_path)
    save_metadata(image_url)
    print(f"Intruder saved: {image_url}")

# YOLO FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Function to detect people using YOLO
def detect_persons(frame):
    results = yolo_model(frame)  # Run YOLO
    persons = []

    for result in results:
        for box, class_id, conf in zip(result.boxes.xyxy, result.boxes.cls, result.boxes.conf):  # Extract confidence score
            if int(class_id) == 0:  # Class 0 in COCO is "person"
                x1, y1, x2, y2 = map(int, box[:4])
                persons.append({
                    "bbox": (x1, y1, x2, y2),  # Bounding box
                    "confidence": conf.item()   # Confidence score
                })

    return persons

# Helper function to save a frame
def save_intruder_frame(frame, prefix=""):
    # Save files to local disk
    filename = f"{INTRUDER_FOLDER}/Intruder_{prefix}_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S.%f')}.jpg"
    cv2.imwrite(filename, frame)
    print(f"Saved: {filename}")
    
    # Optional: Call FIREBASE cloud upload function here
    handle_intruder_detection(filename)


# NECESSARY INITIALIZATIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Initialize Firebase App
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'intruder-detection-syste-3e8f1.firebasestorage.app'
})
db = firestore.client()



# First Burst Function - 5 photos immediately, 300ms apart
def first_burst(frame):
    global state, burst_in_progress, alert_message, alert_triggered
    
    if state != 'stop' or burst_in_progress:
        return  # Already capturing or burst in progress
    
    state = 'start'
    burst_in_progress = True  # Set the flag to indicate burst is in progress
    alert_triggered = True
    alert_message = "BURST - ALERT: Intruder Detected!"
    print("Intruder detected - Starting first burst capture")

    # Background thread for burst capture
    def capture_burst():
        global burst_in_progress
        
        for i in range(5):
            save_intruder_frame(frame, f"{i+1}_burst")
            time.sleep(0.3)  # This sleep only affects the burst thread, not the main loop

        burst_in_progress = False  # Reset flag after burst capture is complete

    # Start a thread for the burst capture
    threading.Thread(target=capture_burst, daemon=True).start()

# Follow-up Function - 1 photo every 2 seconds
def follow_up(frame):
    global state, last_intruder_time, follow_update, alert_triggered, alert_message
    
    if state != 'start':
        return  # No active capture
    
    if time.time() - last_intruder_time >= 2:  # 2 seconds interval
        save_intruder_frame(frame, "followup")
        alert_triggered = True
        alert_message = "FOLLOW UP - ALERT: Intruder is on the Move!"
        last_intruder_time = time.time()

# Exit Function - stop after 5 seconds of no intruder detected
def exit_capture():
    print("... INSIDE EXIT...")
    global state, follow_update, alert_triggered, alert_message
    
    print("No intruder for 5 seconds - Stopping capture")
    state = 'stop'
    follow_update = False
    alert_triggered = True
    alert_message = "EXIT - ALERT: Intruder Out Of Sight!"

# Initialize the camera (0 usually refers to the default camera)
cap = cv2.VideoCapture(0)


# Helper to get your laptop’s IP (needed to access from phone)
def get_local_ip():
    hostname = socket.gethostname()
    return socket.gethostbyname(hostname)

# Process frame for intruder detection and overlay annotations.
def process_frame(frame):
    global state, burst_in_progress, follow_update, last_intruder_time

    persons = detect_persons(frame)

    if persons: # Intruder Detected
        if not follow_update:
            last_intruder_time = time.time()
            follow_update = True

        # Trigger burst when intruder detected for first time
        if state == "stop":
            first_burst(frame)  

        # Draw boxes and labels
        for person in persons:
            x1, y1, x2, y2 = person["bbox"]
            confidence = person["confidence"]
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            text = f"Intruder Detected: {confidence:.2f}"
            cv2.putText(frame, text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        # Continuous follow-up capture if burst is done
        if state == "start" and not burst_in_progress:
            follow_up(frame)
    
    # No intruder detected
    else:
        if state == "start" and time.time() - last_intruder_time > 5:
            exit_capture()

    return frame

# Video streaming function
def gen():
    while True:
        ret, frame = cap.read()  # Capture frame from the camera
        if not ret:
            break

        frame = process_frame(frame)

        _, jpeg = cv2.imencode('.jpg', frame)  # Encode as JPEG
        frame = jpeg.tobytes()  # Convert frame to bytes
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

# FLASK ROUTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Endpoint to list all photos with name, timestamp, and URL
@app.route('/photos')
def list_photos():
    try:
        files = os.listdir(INTRUDER_FOLDER)
        photos = []
        for file in files:
            file_path = os.path.join(INTRUDER_FOLDER, file)
            timestamp = os.path.getmtime(file_path)  # Last modified time
            photos.append({
                "name": file,
                "timestamp": timestamp,
                "url": f"http://{get_local_ip()}:8000/images/{file}"
            })
        # Sort by latest first (optional)
        photos.sort(key=lambda x: x['timestamp'], reverse=True)
        return jsonify(photos)

    except Exception as e:
        return jsonify({'error': str(e)})

# Endpoint to serve the actual images
@app.route('/images/intruders/<filename>')
def get_image(filename):
    return send_from_directory(INTRUDER_FOLDER, filename)

@app.route('/alerts', methods=['GET'])
def get_alert():
    global alert_triggered, alert_message
    if alert_triggered:  # Only return the alert if the condition is true
        alert_data = {"message": alert_message, "timestamp": time.time()}
        alert_triggered = False  # Reset flag after sending the alert
        return jsonify(alert_data)  # Return the alert message and timestamp
    else:
        return jsonify({})  # Return an empty response if no alert is triggered

# Sample route to trigger the alert (for testing purposes)
# @app.route('/trigger-alert', methods=['POST'])
# def trigger_alert():
#     global alert_triggered
#     alert_triggered = True  # Set the flag to true to trigger the alert
#     return jsonify({"status": "alert triggered"})

# Endpoint to stream live video
@app.route('/live')
def live():
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)