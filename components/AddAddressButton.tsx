/*
 * Stin Circular Buttons will rise again 🔵🐦‍🔥
 * AddAddressButton.tsx
 *
 * This component renders a button that allows users to add a new address.
 * It is styled to be circular and positioned at the bottom of the screen.
 *
 * @param {function} onPress - Function to call when the button is pressed.
 * @param {string} color - Optional color for the button background.
 *
 * this is in components folder to be a universal component for all screens.
 *
 * MIGHT need API integration for the button to work properly.
 */

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
    onPress: () => void;
    color?: string;
};

const AddAddressButton = ({ onPress, color = "#6495ED" }: Props) => (
    <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
        <Text style={styles.buttonText}>➕</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#6495ED",
        position: "absolute",
        bottom: 80,
        alignSelf: "center",
        borderRadius: 50,
        padding: 12,
        elevation: 5
    },
    buttonText: {
        fontSize: 24
    }

    /* Old button styles for reference
    addBtn: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        backgroundColor: "#3366ff",
        borderRadius: 50,
        padding: 12
    },
    addText: {
        fontSize: 24
    },
    */
});

export default AddAddressButton;
