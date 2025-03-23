import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
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

        let formData = new FormData();
        formData.append("song", {
            uri: recordingUri,
            type: "audio/wav",
            name: "recording.wav",
        });

        try {
            const response = await fetch(`${BACKEND_URL}/upload-song`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const text = await response.text();
            console.log("Upload response:", text);
            Alert.alert("Upload Success", text);
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Upload Failed", "Error uploading file.");
        }
    }

    return (
        <LinearGradient
            colors={["#f8b195", "#f67280", "#c06c84"]}
            style={styles.container}
        >
            <Text style={styles.text}>Now Playing: {songTitle}</Text>
            <Text style={styles.text}>Song ID: {songId}</Text>

            {/* Button to test connection to backend */}
            <Button title="Test Backend" onPress={testBackend} />

            {/* Button to start or stop recording */}
            <Button
                title={
                    recordingStatus === "recording"
                        ? "Stop Recording"
                        : "Start Recording"
                }
                onPress={
                    recordingStatus === "recording"
                        ? stopRecording
                        : startRecording
                }
            />

            {/* Show these buttons after recording is stopped */}
            {recordingStatus === "stopped" && (
                <>
                    <Button title="Play Recording" onPress={playSound} />
                    <Button
                        title="Upload Recording"
                        onPress={uploadRecording}
                    />
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
});
