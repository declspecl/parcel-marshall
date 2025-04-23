/*BulkToggleAdd.tsx
Adding a toggle button to the add address modal to handle bulk adds in a copy paste format
wanted to keep simple add address
Lets download the swamp 🐸
WIP I just have it set as a modal title rn
*/
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    enabled: boolean;
    onToggle: () => void;
};

const BulkToggleButton = ({ enabled, onToggle }: Props) => (
    <View style={styles.wrapper}>
        <Pressable onPress={onToggle} style={[styles.button, enabled && styles.enabled]}>
            <Text style={styles.icon}>{enabled ? "📋" : "➕"}</Text>
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 10,
        right: 10
    },
    button: {
        backgroundColor: "#2d2d2d",
        borderRadius: 999,
        padding: 10,
        borderWidth: 1,
        borderColor: "#555",
        alignItems: "center",
        justifyContent: "center"
    },
    enabled: {
        backgroundColor: "#6effa1",
        transform: [{ scale: 1.1 }]
    },
    icon: {
        fontSize: 18,
        color: "#fff"
    }
});

export default BulkToggleButton;
