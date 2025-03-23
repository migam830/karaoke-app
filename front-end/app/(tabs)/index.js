import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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
        id: "3",
        title: "Song 3",
        file: require("../../assets/police-sirens-316719.mp3"),
    },
];

export default function HomeScreen() {
    const [selectedSongId, setSelectedSongId] = useState(null);

    const handleSelectSong = (song) => {
        setSelectedSongId(song.id);
    };

    const handlePlay = () => {
        if (selectedSongId) {
            const selectedSong = songs.find(
                (song) => song.id === selectedSongId
            );
            if (selectedSong) {
                router.push({
                    pathname: "/play",
                    params: {
                        songId: selectedSong.id,
                        songTitle: selectedSong.title,
                    },
                });
            } else {
                console.error("Selected song not found.");
            }
        } else {
            console.error("No song selected.");
        }
    };

    return (
        <LinearGradient
            colors={["#f8b195", "#f67280", "#c06c84"]}
            style={styles.container}
        >
            <Text style={styles.title}>Select a song to start singing!</Text>

            <FlatList
                data={songs}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        <Text style={styles.songTitle}>{item.title}</Text>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => handleSelectSong(item)}
                        >
                            <Text style={styles.selectButtonText}>Select</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList} // Add style for FlatList
            />

            <TouchableOpacity
                style={styles.playButtonContainer}
                onPress={handlePlay}
            >
                <Image
                    source={require("../../assets/images/play-button.png")}
                    style={styles.playButtonImage}
                />
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "white",
    },
    songItem: {
        marginVertical: 15,
        alignItems: "center",
        width: "90%",
    },
    songTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: "white",
    },
    selectButton: {
        marginTop: 10,
        backgroundColor: "#010122",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 20,
    },
    selectButtonText: {
        color: "white",
        fontSize: 16,
    },
    playButtonContainer: {
        marginTop: 40,
        alignSelf: "center",
    },
    playButtonImage: {
        width: Dimensions.get("window").width * 0.15,
        height: Dimensions.get("window").width * 0.15,
    },
    flatList: {
        // Style for FlatList
        width: "100%",
        flexGrow: 1, // Take up all available space
    },
});
