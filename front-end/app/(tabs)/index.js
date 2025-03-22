import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { router } from "expo-router";



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
    const [selectedSong, setSelectedSong] = useState(null);

    // Handle the selection of a song
    const handleSelectSong = (song) => {
        setSelectedSong(song);
    };

    // Handle Play button click (You can add your play functionality here)
    const handlePlay = () => {
        if (selectedSong) {
            // Play the selected song (Replace this with actual audio playback logic)
            console.log(`Playing: ${selectedSong.title}`);
            router.push({
                pathname: "/play",
                params: {
                    songId: selectedSong.id,
                    songTitle: selectedSong.title,
                },
            });
        } else {
            // No song selected, maybe show an alert or default action
            console.log("No song selected!");
        }
    };

    return (
        <View style={styles.container}>
        <ImageBackground
                        source={require("../../assets/images/background.png")}
                        resizeMode="cover"
                        style={styles.image}
                    >
            <Text style={styles.title}>Select a song to start singing!</Text>

            {/* Display the list of songs */}
            <FlatList
                data={songs}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        <Text style={styles.songTitle}>{item.title}</Text>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => handleSelectSong(item)} // Set selected song
                        >
                            <Text style={styles.selectButtonText}>Select</Text>
                        </TouchableOpacity>
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
                    <Text>File Path: {selectedSong.file}</Text>
                </View>
            )}

            {/* Play button that is always visible */}
            <View style={styles.playButtonContainer}>
                <TouchableOpacity onPress={handlePlay}>
                    <Image
                        source={require("../../assets/images/play-button.png")}
                        style={styles.playButtonImage}
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
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
    selectButton: {
        marginTop: 10,
        backgroundColor: "#6200EE",
        padding: 10,
        borderRadius: 5,
    },
    selectButtonText: {
        color: "#fff",
        fontSize: 16,
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
    playButtonContainer: {
        position: "absolute",
        bottom: 200,
        left: "50%",
        transform: [{ translateX: "-50%" }],
        zIndex: 1,
    },
    playButtonImage: {
        width: 100,
        height: 100,
    },
    image: {
    flex: 1,
    justifyContent: 'center',
  },
});
