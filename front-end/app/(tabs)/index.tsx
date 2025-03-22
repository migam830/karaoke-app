import React, { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

// List of available songs
const songs = [
    {
        id: "1",
        title: "Song 1",
        file: require("../../assets/deep-space-travel-background-noise-313946.mp3"),
    },
    {
        id: "2",
        title: "Song 2",
        file: require("../../assets/flickering-neon-316717.mp3"),
    },
    {
        id: "3", // Ensure unique IDs for each song
        title: "Song 3",
        file: require("../../assets/police-sirens-316719.mp3"),
    },
];

export default function HomeScreen() {
    const [selectedSong, setSelectedSong] = useState<{
        id: string;
        title: string;
        file: any;
    } | null>(null);

    // Handle the selection of a song
    const handleSelectSong = (song: any) => {
        setSelectedSong(song);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a song to start singing!</Text>

            {/* Display the list of songs */}
            <FlatList
                data={songs}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        <Text style={styles.songTitle}>{item.title}</Text>
                        <Button
                            title="Select"
                            onPress={() => handleSelectSong(item)} // Set selected song
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            {/* Display selected song details if available */}
            {selectedSong && (
                <View style={styles.selectedSongContainer}>
                    <Text style={styles.selectedSongTitle}>
                        Selected Song: {selectedSong.title}
                    </Text>
                    <Text>Song ID: {selectedSong.id}</Text>
                    {/* You could also show the file path here to verify */}
                    <Text>File Path: {selectedSong.file}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    songItem: {
        marginVertical: 10,
        alignItems: "center",
    },
    songTitle: {
        fontSize: 18,
    },
    selectedSongContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
    },
    selectedSongTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
});
