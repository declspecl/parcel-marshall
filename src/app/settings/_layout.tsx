import { Stack } from "expo-router";
import { useThemeSettings } from "@/context/ThemeContext";

export default function SettingsLayout() {
    const { darkMode, bernardMode } = useThemeSettings();

    const headerBg = bernardMode ? "#0d2f23" : darkMode ? "#111" : "#fff";
    const headerColor = bernardMode ? "#a4f6aa" : darkMode ? "#eee" : "#000";

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: headerBg },
                headerTitleStyle: { color: headerColor },
                headerTintColor: headerColor // back arrow / icons
            }}
        >
            <Stack.Screen name="index" options={{ title: "Settings Home Page" }} />
            <Stack.Screen
                name="feedback"
                options={{
                    title: "Feedback Form",
                    presentation: "modal"
                }}
            />
        </Stack>
    );
}
