import React, { useState , useEffect} from "react";
import { View, Text, FlatList,  StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAlerts } from "../context/AlertContext"; // Use the context
import * as Haptics from 'expo-haptics';
import * as Notifications from "expo-notifications";

// Request Notification Permissions
Notifications.requestPermissionsAsync().then(({ status }) => {
  if (status !== "granted") {
    alert("Permission for notifications was denied!");
  }
});

// Configure Foreground Notification Behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function Alerts() {
  const { alerts, addAlert } = useAlerts(); // Use the context
  const [loading, setLoading] = useState(true);

  // Function to fetch alerts from Flask endpoint
  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://172.20.10.3:8000/alerts"); // Replace with your Flask server URL
      const data = await response.json();
      // Assuming Flask response contains message and timestamp
      if (data.message) { // Only update if there's a valid message in the response
        // Notification Sound
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🚨 Intruder Alert!",
            body: data.message,
            sound: "default", // Plays the default notification sound
          },
          trigger: null, // Instant notification
        });

        // Alert Message
        const newAlert = {
          id: new Date().toISOString(),
          message: data.message,  // Alert message from Flask
          time: new Date(data.timestamp * 1000).toLocaleString(),  // Convert timestamp to readable format
        };

        addAlert(newAlert); // Add the alert to the global state

        // Haptic Feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);  // You can choose different feedback styles like Light, Medium, Heavy, or Soft
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  // Fetch alerts every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchAlerts, 1000);
    setLoading(false);

    // Cleanup interval when component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  // Clear all alerts from the list
  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Intruder Alerts</Text>
      {loading ? (
        <Text style={styles.noAlerts}>Loading...</Text>
      ) : alerts.length === 0 ? (
        <Text style={styles.noAlerts}>No new alerts</Text>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.alertCard}>
              <Ionicons name="alert-circle" size={24} color="red" />
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertMessage}>{item.message}</Text>
                <Text style={styles.alertTime}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Clear Alerts Button */}
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setAlerts([])}
      >
        <Text style={styles.clearButtonText}>Clear All Alerts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 10 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  noAlerts: { textAlign: "center", fontSize: 18, color: "gray", marginTop: 50 },

  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
  },
  alertTextContainer: { marginLeft: 10 },
  alertMessage: { fontSize: 16, fontWeight: "bold" },
  alertTime: { fontSize: 14, color: "gray" },

  clearButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
    width: "90%",
  },
  clearButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
