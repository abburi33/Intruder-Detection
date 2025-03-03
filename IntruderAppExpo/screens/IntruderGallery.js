import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function IntruderGallery() {
  const [intruders, setIntruders] = useState([]);
  const [filteredIntruders, setFilteredIntruders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIntruderImages();
  }, []);

  const fetchIntruderImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://picsum.photos/v2/list?page=1&limit=20"
      );
      setIntruders(response.data);
      setFilteredIntruders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = intruders.filter((item) =>
      item.author.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredIntruders(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={filteredIntruders}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.download_url }} style={styles.image} />
              <Text style={styles.timestamp}>{item.author}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  grid: { paddingVertical: 10 },
  imageContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    alignItems: "center",
    padding: 10,
  },
  image: { width: "100%", height: 160, borderRadius: 10 },
  timestamp: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
});
