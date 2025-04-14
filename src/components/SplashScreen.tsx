import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";

type SplashScreenProps = {
    onFinish: () => void;
};

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Fade out
    useEffect(() => {
        const timeout = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }).start(() => {
                onFinish();
            });
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    // Pulse effect
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 800,
                    useNativeDriver: true
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
            <Animated.Image
                source={require("../../assets/images/logo.png")}
                style={[
                    styles.logo,
                    { transform: [{ scale: pulseAnim }] } // ✨ apply pulse
                ]}
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    animatedContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1A2538"
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 30,
        borderRadius: 150,
        shadowColor: "#88aaff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 15
    },
    spinner: {
        marginTop: 0
    }
});

export default SplashScreen;
