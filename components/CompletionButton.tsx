/**
 *  CompletionButton.tsx
 *  Stin Circular Buttons will rise again 🔵🐦‍🔥
 *
 *
 * A reusable button component for marking a delivery stop as complete.
 *
 * Props:
 * - onPress: Function to execute when the button is pressed
 * - label (optional): Custom text to display on the button (default: "Mark as Complete")
 * - disabled (optional): Whether the button should be non-interactive and styled as inactive
 *
 * Code Example in index.tsx:
 * <CompletionButton onPress={handleComplete} />
 * <CompletionButton onPress={() => {}} label="📦 All Parcels Delivered!" disabled />
 *
 * Notes:
 * - it does NOT manage state or handle actual destination updates.
 * - I do not know if we need this to do that yet.
 * - All completion logic should be handled externally and passed in via `onPress`.
 * - The label supports emoji or custom messaging to match ParcelMarshall’s tone.
 */

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
    onPress: () => void;
    label?: string;
    disabled?: boolean;
};

const CompletionButton = ({ onPress, label = "Mark as Complete", disabled = false }: Props) => (
    <Pressable style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
        <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        marginTop: 12,
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 6
    },
    disabled: {
        backgroundColor: "#a0a0a0"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    }
});

export default CompletionButton;
