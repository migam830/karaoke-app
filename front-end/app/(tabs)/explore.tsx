import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ExploreScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Explore screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default ExploreScreen;
