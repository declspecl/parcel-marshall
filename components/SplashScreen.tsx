import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ActivityIndicator, Image } from "react-native";

type SplashScreenProps = {
    onFinish: () => void;
};

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const timeout = setTimeout(() => {
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
            <View style={styles.content}>
                <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
                <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff" //change if we want diff color
    },
    content: {
        alignItems: "center",
        justifyContent: "center"
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 30
    },
    spinner: {
        marginTop: 0
    }
});

export default SplashScreen;
