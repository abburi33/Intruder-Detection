# 🔐 AI-Powered Intruder Detection System

A mobile-first security camera solution that leverages computer vision and motion analysis to detect intruders, capture critical evidence, and alert users in real-time — using just a smartphone, Firebase, and React Native.

---

## 📱 Features

- ⚡ Real-time intruder detection using YOLO
- 🎯 Custom motion tracking algorithm using bounding box shifts
- 📸 Burst image capture when intrusion is detected
- 🔔 Instant push notifications via Firebase
- 🖼️ Image gallery to view captured intrusions
- 📡 Live camera feed streaming in the app
- 🔐 Secure login/signup for user access

---

## 🎯 Motivation

Traditional surveillance systems are bulky, expensive, and prone to false alarms. Our goal was to build a **smart, mobile-based system** that:

- Detects only meaningful motion
- Reduces false positives
- Optimizes image storage
- Sends real-time alerts
- Is accessible from anywhere

---

## 🧠 How It Works

1. **YOLO Object Detection**  
   Detects people in the camera feed.

2. **Custom Motion Detection**  
   A bounding box-based algorithm tracks movement via:

   - Area change (indicates distance)
   - Midpoint shift (indicates motion)

3. **Burst + Smart Capture**

   - 5 initial images taken when an intruder is detected
   - More images only when movement continues

4. **Firebase Integration**

   - Images uploaded to Firebase Storage
   - Data saved in Firestore
   - Notifications via Firebase Cloud Messaging

5. **Mobile App Interface**  
   Built with React Native & Expo, allowing:
   - Live feed
   - Captured image gallery
   - Login/signup for secure access

---

## 🧪 Results

| Feature                     | Result                           |
| --------------------------- | -------------------------------- |
| Intruder Detection Accuracy | ~90% in real-world environments  |
| Image Capture Efficiency    | Reduced redundancy by 60%        |
| Notification Speed          | ~1 second after detection        |
| Usability                   | Intuitive mobile-first interface |

---

## 📸 App Screenshots

> _(Add screenshots to this section in GitHub UI)_

- 📷 Gallery of captured intrusions
- 📺 Real-time live feed
- 🔐 Secure login/signup screen
- 🔔 Push notifications interface

---

## ⚙️ Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Firebase (Auth, Firestore, Storage, Messaging)
- **ML Model**: YOLOv5 for object detection
- **Tracking**: Custom motion detection via bounding box movement

---

## 🚀 Setup Instructions

```bash
# 1. Clone this repository
git clone https://github.com/<your-username>/Intruder-Detection.git
cd IntruderAppExpo

# 2. Install dependencies
npm install

# 3. Install Firebase and required native dependencies
npx expo install firebase

# 4. Start the development server
expo start
```

## 🔐 Firebase Setup (Required)

To enable real-time image upload, authentication, and notifications, follow these steps to set up Firebase in your project:

---

### 1️⃣ Create a Firebase Project

- Go to [https://firebase.google.com](https://firebase.google.com)
- Click **Get Started** or open the [Firebase Console](https://console.firebase.google.com/)
- Click **Add Project** and name it (e.g., `IntruderDetectionApp`)
- Disable **Google Analytics** (optional)
- Click **Create Project**

---

### 2️⃣ Enable Firebase Services

In your Firebase Console (within your project):

- **Authentication**

  - Navigate to: **Build → Authentication → Sign-in method**
  - Enable **Email/Password**

- **Firestore Database**

  - Go to: **Build → Firestore Database**
  - Click **Create Database**
  - Select **Start in test mode**
  - Choose your region and click **Enable**

- **Storage**

  - Go to: **Build → Storage**
  - Click **Get Started**
  - Choose a location and click **Done**

- _(Optional)_ **Cloud Messaging**
  - Go to: **Build → Cloud Messaging**
  - Configure this if you'd like to support push notifications

---

### 3️⃣ Register Your App with Firebase

- Go to **Project Settings → General**
- Under **Your apps**, click the `</>` Web icon (Web App)
- Name your app (e.g., `IntruderFrontend`)
- Click **Register app**
- Copy the Firebase config snippet provided

---

### 4️⃣ Add Firebase Config to Your Project

Create a new file named `firebase.js` in your project root directory and paste your Firebase configuration.
