import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function PlayScreen() {
    const { songId, songTitle } = useLocalSearchParams();

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>Now Playing: {songTitle}</Text>
            <Text>Song ID: {songId}</Text>
        </View>
    );
}
