/*
    * UpdateButton.tsx
    * Stin
    * Circular Buttons will rise again 🔵🐦‍🔥
    *
    * A button component that shows a loading spinner when the loading prop is true.
    * It uses React Native's Animated API to create a spinning effect for the loading state.
    * 
    *Notes:
    * - When `loading` is true, the 🔄 icon will continuously spin using an animated transform.
    * - Pressing the button while loading is disabled to prevent duplicate refresh calls.
    * 
    * 
    * Future Notes:
    * - When real location or routing logic is added, plug it into the onPress function.
    * - You can optionally swap the 🔄 emoji for a real icon (e.g., from react-native-vector-icons).
    * - This component is UI-only and does not manage state or location logic internally yet.
 
    
*/

import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View, Animated } from "react-native";

type Props = {
    onPress: () => void;
    loading?: boolean;
};

const UpdateButton = ({ onPress, loading = false }: Props) => {
    const spinAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                })
            ).start();
        } else {
            spinAnim.stopAnimation();
            spinAnim.setValue(0);
        }
    }, [loading]);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    });

    return (
        <Pressable style={styles.button} onPress={onPress} disabled={loading}>
            <View style={styles.buttonContent}>
                {loading ? (
                    <Animated.Text style={[styles.spinner, { transform: [{ rotate: spin }] }]}>🔄</Animated.Text>
                ) : (
                    <Text style={styles.spinner}>🔄</Text>
                )}
                <Text style={styles.buttonText}> Update Route</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ffc107",
        padding: 8,
        borderRadius: 6,
        alignSelf: "flex-start",
        marginBottom: 20
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center"
    },
    buttonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16
    },
    spinner: {
        fontSize: 16
    }
});

export default UpdateButton;
