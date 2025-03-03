import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import Screens
import IntruderGallery from "./screens/IntruderGallery";
import LiveFeed from "./screens/LiveFeed";
import Alerts from "./screens/Alerts";
import Settings from "./screens/Settings";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Gallery") iconName = "images";
            else if (route.name === "Live Feed") iconName = "videocam";
            else if (route.name === "Alerts") iconName = "notifications";
            else if (route.name === "Settings") iconName = "settings";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        })}
      >
        <Tab.Screen name="Gallery" component={IntruderGallery} />
        <Tab.Screen name="Live Feed" component={LiveFeed} />
        <Tab.Screen name="Alerts" component={Alerts} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
