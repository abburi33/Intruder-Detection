import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import Screens
import IntruderGallery from "./screens/IntruderGallery";
import LiveFeed from "./screens/LiveFeed";
import Alerts from "./screens/Alerts";
import Settings from "./screens/Settings";

// Placeholder Home Screen
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>🏠 Home Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Gallery") iconName = "images";
            else if (route.name === "Live Feed") iconName = "videocam";
            else if (route.name === "Alerts") iconName = "notifications";
            else if (route.name === "Settings") iconName = "settings";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Gallery" component={IntruderGallery} />
        <Tab.Screen name="Live Feed" component={LiveFeed} />
        <Tab.Screen name="Alerts" component={Alerts} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
