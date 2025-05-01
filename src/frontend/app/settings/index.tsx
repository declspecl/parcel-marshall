import { useRouter } from "expo-router";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useThemeSettings } from "@/context/ThemeContext";
import Toast from "react-native-toast-message";

export default function Settings() {
    const router = useRouter();

    // Setting up bernard mode 🐸
    const { darkMode, toggleDarkMode, bernardMode, toggleBernardMode } = useThemeSettings();

    const [autoSort, setAutoSort] = useState(true);
    const [warnOnSkip, setWarnOnSkip] = useState(true);

    return (
        <View
            style={[
                styles.container,
                darkMode && { backgroundColor: "#111" },
                bernardMode && { backgroundColor: "#003319" }
            ]}
        >
            <Text style={[styles.subtitle, darkMode && { color: "#eee" }, bernardMode && { color: "#a4f6aa" }]}>
                Preferences
            </Text>

            <Text style={[styles.note, darkMode && { color: "#aaa" }, bernardMode && { color: "#a4f6aa" }]}>
                {bernardMode
                    ? "Hop into your ideal vibe. No lily pad too far. 🐸"
                    : "Customize your chaos, one toggle at a time."}
            </Text>

            <View style={styles.setting}>
                <Text style={[styles.label, darkMode && { color: "#eee" }, bernardMode && { color: "#baffc9" }]}>
                    Dark Mode
                </Text>
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
            </View>

            <Text style={[styles.settingNote, darkMode && { color: "#aaa" }, bernardMode && { color: "#a4f6aa" }]}>
                For those who code in the shadows 🌑
            </Text>

            <View style={styles.setting}>
                <Text style={[styles.label, darkMode && { color: "#eee" }, bernardMode && { color: "#baffc9" }]}>
                    Auto-Sort Routes
                </Text>
                <Switch value={autoSort} onValueChange={setAutoSort} />
            </View>

            <Text style={[styles.settingNote, darkMode && { color: "#aaa" }, bernardMode && { color: "#a4f6aa" }]}>
                Let the app decide your fate 🔮 (WIP)
            </Text>

            <View style={styles.setting}>
                <Text style={[styles.label, darkMode && { color: "#eee" }, bernardMode && { color: "#baffc9" }]}>
                    Warn When Skipping Stop
                </Text>
                <Switch value={warnOnSkip} onValueChange={setWarnOnSkip} />
            </View>

            <Text style={[styles.settingNote, darkMode && { color: "#aaa" }, bernardMode && { color: "#a4f6aa" }]}>
                Because missing Gavin’s package is a federal offense 📦 (WIP)
            </Text>

            <View style={styles.setting}>
                <Text style={[styles.label, darkMode && { color: "#eee" }, bernardMode && { color: "#baffc9" }]}>
                    ParcelMarsh 🐸 (a.k.a. Bernard Mode 😎)
                </Text>
                <Switch value={bernardMode} onValueChange={toggleBernardMode} />
            </View>

            <Text style={[styles.settingNote, darkMode && { color: "#aaa" }, bernardMode && { color: "#a4f6aa" }]}>
                {bernardMode
                    ? "Time is just a ripple in the pond, bro. 🐸⏳"
                    : "Activates Bernard theme. Side effects may include chill vibes and improved morale."}
            </Text>

            <TouchableOpacity
                style={[
                    styles.button,
                    bernardMode && {
                        backgroundColor: "#25a244",
                        borderWidth: 2,
                        borderColor: "#1b6f34"
                    }
                ]}
                onPress={() => {
                    const toastType = bernardMode ? "bernard" : darkMode ? "dark" : "info";

                    Toast.show({
                        type: toastType,
                        text1: bernardMode
                            ? "Froggy Feedback Deployed 🐸"
                            : darkMode
                              ? "Launching Feedback Pod 🛰️"
                              : "Launching Feedback Pod 🛰️",
                        text2: bernardMode
                            ? "Ribbit ribbit. Bernard will receive your wisdom."
                            : darkMode
                              ? "We'll beam your thoughts straight to Gavin's garage."
                              : "We'll beam your thoughts straight to Gavin's garage.",
                        visibilityTime: 6000
                    });

                    router.push("/settings/feedback");
                }}
            >
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Submit Feedback</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#f6f6f6"
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center"
    },
    setting: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
    label: {
        fontSize: 18
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 40,
        alignSelf: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 16,
        fontWeight: "500",
        textAlign: "center"
    },
    note: {
        textAlign: "center",
        fontStyle: "italic",
        marginBottom: 16,
        color: "#666"
    },
    settingNote: {
        fontSize: 16,
        fontStyle: "italic",
        marginBottom: 12,
        marginLeft: 8,
        color: "#888"
    }
});
