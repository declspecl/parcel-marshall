import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import { Image } from "react-native";

type SplashScreenProps = {
    onFinish: () => void;
};

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Fade out animation for loading screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }).start(() => {
                onFinish();
            });
        }, 2000); //2 seconds

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Animated.View style={[StyleSheet.absoluteFillObject, styles.container, { opacity: fadeAnim }]}>
            <Image source={require("../assets/images/image_2.png")} style={styles.logo} resizeMode="contain" />
            <ActivityIndicator size="large" color="007AFF" style={styles.spinner} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff" //change if we want diff color
    },
    logo: {
        width: 150,
        height: 150
    },
    spinner: {
        marginTop: 30
    }
});

export default SplashScreen;
