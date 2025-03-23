import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

export default function PlayScreen() {
    const { songId, songTitle } = useLocalSearchParams();
    const [recording, setRecording] = useState();
    const [sound, setSound] = useState();
    const [recordingStatus, setRecordingStatus] = useState("idle");
    const [recordingUri, setRecordingUri] = useState(null);

    // Define the backend URL for the Android Emulator
    const BACKEND_URL = "http://10.0.2.2:5000"; // Use 10.0.2.2 for Android Emulator

    useEffect(() => {
        async function getPermissions() {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Required",
                    "Please grant audio recording permissions!"
                );
            }
        }
        getPermissions();
    }, []);

    async function testBackend() {
        try {
            // Test the backend connection
            const response = await fetch(`${BACKEND_URL}/`);
            const text = await response.text();
            console.log("Response from backend:", text);
            Alert.alert("Backend Response", text);
        } catch (error) {
            console.error("Error connecting to backend:", error);
            Alert.alert("Error", "Could not connect to backend.");
        }
    }

    async function startRecording() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            await recording.startAsync();
            setRecording(recording);
            setRecordingStatus("recording");
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordingUri(uri);
        setRecording(undefined);
        setRecordingStatus("stopped");
        console.log("Recording stored at:", uri);
    }

    async function playSound() {
        if (recordingUri) {
            const { sound } = await Audio.Sound.createAsync({
                uri: recordingUri,
            });
            setSound(sound);
            await sound.playAsync();
        }
    }

    async function uploadRecording() {
        if (!recordingUri) {
            Alert.alert("Error", "No recording found.");
            return;
        }

        try {
            // Fetch the recording data from the URI
            const response = await fetch(recordingUri);
            const blob = await response.blob();

            let formData = new FormData();
            formData.append("song", blob, "recording.wav"); // Append the blob

            const uploadResponse = await fetch(`${BACKEND_URL}/upload-song`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const uploadData = await uploadResponse.json();
            const filePath = uploadData.file_path; // Get the saved file path from the response

            // Step 2: Analyze the uploaded file to extract notes
            const analyzeResponse = await fetch(`${BACKEND_URL}/analyse-song`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: filePath, // Send the file path to the backend for analysis
                }),
            });
            const analyzeData = await analyzeResponse.json();
            const userNotesList = analyzeData.notes; // Get the notes from the backend

            // Step 3: Calculate the score
            const scoreResponse = await fetch(
                `${BACKEND_URL}/calculate-score`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userNotesList: userNotesList, // Send the user notes to calculate the score
                        songChoice: songId, // Send the selected song's ID
                    }),
                }
            );
            const scoreData = await scoreResponse.json();
            const score = scoreData.score; // Get the score from the backend

            // Show the score
            Alert.alert("Your Score", `Your score is: ${score}`);
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert(
                "Error",
                "There was an error processing your recording."
            );
        }
    }

    return (
        <LinearGradient
            colors={["#f8b195", "#f67280", "#c06c84"]}
            style={styles.container}
        >
            <Text style={styles.text}>Now Playing: {songTitle}</Text>
            <Text style={styles.text}>Song ID: {songId}</Text>

            <TouchableOpacity style={styles.selectButton} onPress={testBackend}>
                <Text style={styles.selectButtonText}>Test Backend</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.selectButton}
                onPress={
                    recordingStatus === "recording"
                        ? stopRecording
                        : startRecording
                }
            >
                <Text style={styles.selectButtonText}>
                    {recordingStatus === "recording"
                        ? "Stop Recording"
                        : "Start Recording"}
                </Text>
            </TouchableOpacity>

            {recordingStatus === "stopped" && (
                <>
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={playSound}
                    >
                        <Text style={styles.selectButtonText}>
                            Play Recording
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={uploadRecording}
                    >
                        <Text style={styles.selectButtonText}>
                            Upload Recording
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        color: "white",
        marginBottom: 10,
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
});
