import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

// Move the image array inside the component
const intruderImages = [
  { id: "1", uri: require("../assets/intruders/intruder1.jpg") },
  { id: "2", uri: require("../assets/intruders/intruder2.jpg") },
  { id: "3", uri: require("../assets/intruders/intruder3.jpg") },
  { id: "4", uri: require("../assets/intruders/intruder4.jpg") },
];

export default function IntruderGallery() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intruder Gallery</Text>
      <FlatList
        data={intruderImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.imageCard}>
            <Image source={item.uri} style={styles.image} />
          </View>
        )}
        numColumns={2} // Display images in a grid
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  imageCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  image: { width: "100%", height: 150, borderRadius: 8, resizeMode: "cover" },
});
