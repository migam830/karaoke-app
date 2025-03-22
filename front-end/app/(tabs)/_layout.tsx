import { Stack } from "expo-router"; // We will use Stack to manage a single screen
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme"; // For dark/light theme support

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            {/* Only render the index screen, no tab bar */}
            <Stack.Screen
                name="index" // Assuming this is your main screen name
                options={{
                    title: "Home", // The screen's title if you want
                    headerShown: false, // Hide the header if not needed
                }}
            />
        </Stack>
    );
}
