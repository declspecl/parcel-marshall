import { useRouter } from "expo-router";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useThemeSettings } from "@/context/ThemeContext";

export default function Feedback() {
    const router = useRouter();
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const { darkMode, bernardMode } = useThemeSettings();

    const handleSubmit = () => {
        if (!feedback.trim()) return;

        setLoading(true);

        setTimeout(() => {
            const message = bernardMode
                ? {
                      type: "bernard",
                      text1: "Froggy Feedback Deployed 🐸",
                      text2: "The frogs have spoken. Bernard is listening."
                  }
                : darkMode
                  ? {
                        type: "dark",
                        text1: "Feedback sent 🌒",
                        text2: "Launched into the void 🚀"
                    }
                  : {
                        type: "success",
                        text1: "Feedback sent!",
                        text2: "Launched into the void 🚀"
                    };

            Toast.show(message);
            setFeedback("");
            setLoading(false);
        }, 2000);
    };

    return (
        <View
            style={[
                styles.container,
                darkMode && { backgroundColor: "#111" },
                bernardMode && { backgroundColor: "#0d2f23" }
            ]}
        >
            <Text style={[styles.title, darkMode && { color: "#eee" }, bernardMode && { color: "#a4f6aa" }]}>
                {bernardMode ? "🐸 Speak your truth, traveler" : "Submit Feedback"}
            </Text>

            <TextInput
                multiline
                style={[
                    styles.input,
                    darkMode && {
                        backgroundColor: "#222",
                        color: "#fff",
                        borderColor: "#555"
                    },
                    bernardMode && {
                        backgroundColor: "#183c2e",
                        color: "#a4f6aa",
                        borderColor: "#58d68d"
                    }
                ]}
                placeholder={bernardMode ? "Drop a ribbit of wisdom 🐸" : "Speak your mind 👀"}
                placeholderTextColor={bernardMode ? "#c2ffe0" : darkMode ? "#ccc" : "#aaa"}
                value={feedback}
                onChangeText={setFeedback}
                returnKeyType="done"
                blurOnSubmit
            />

            <Button
                title={loading ? "Sending..." : bernardMode ? "Ribbit 🐸" : "Submit"}
                onPress={handleSubmit}
                disabled={loading || !feedback.trim()}
                color={bernardMode ? "#58d68d" : "#007AFF"}
            />

            {loading && (
                <ActivityIndicator size="small" color={bernardMode ? "#58d68d" : "#007AFF"} style={{ marginTop: 10 }} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    title: { fontSize: 22, marginBottom: 16 },
    input: {
        height: 120,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: "top",
        borderRadius: 6,
        backgroundColor: "#f9f9f9"
    }
});
