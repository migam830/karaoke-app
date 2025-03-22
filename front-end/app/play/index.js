import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";

export default function PlayScreen() {
    const { songId, songTitle } = useLocalSearchParams();
    const [recording, setRecording] = useState();
    const [sound, setSound] = useState();
    const [recordingStatus, setRecordingStatus] = useState("idle");

    useEffect(() => {
        async function getPermissions() {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== "granted") {
                console.log("Please grant audio recording permissions!");
                return;
            }
        }
        getPermissions();
    }, []);

    async function startRecording() {
        try {
            console.log("Requesting permissions..");
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log("Starting recording..");
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            await recording.startAsync();
            setRecording(recording);
            setRecordingStatus("recording");
            console.log("Recording started");
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function stopRecording() {
        console.log("Stopping recording..");
        setRecordingStatus("stopped");
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording stopped and stored at", uri);
        setSound(uri);
    }

    async function playSound() {
        if (sound) {
            console.log("Loading Sound");
            const { sound: playbackSound } = await Audio.Sound.createAsync({
                uri: sound,
            });
            setSound(playbackSound);
            console.log("Playing Sound");
            await playbackSound.playAsync();
        }
    }

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
        <ImageBackground
                                source={require("../../assets/images/background.png")}
                                resizeMode="cover"
                                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                            >
            <Text>Now Playing: {songTitle}</Text>
            <Text>Song ID: {songId}</Text>
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
            {recordingStatus === "stopped" && (
                <Button title="Play Recording" onPress={playSound} />
            )}
        </ImageBackground>
        </View>
    );
}
