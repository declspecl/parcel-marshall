import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DriverCtxProvider } from "@/store/DriverContext";
import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function RootLayout() {
    const [isSplashVisible, setSplashVisible] = useState(true);

    if (isSplashVisible) {
        return <SplashScreen onFinish={() => setSplashVisible(false)} />;
    }

    return (
        <DriverCtxProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#007AFF",
                    tabBarInactiveTintColor: "#8E8E93"
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                        title: "ParcelMarshall: Next stop: World domination (or just Gavin’s Rust Hideout) 🦀🧠"
                    }}
                />
                <Tabs.Screen
                    name="route"
                    options={{
                        tabBarLabel: "Route",
                        tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
                        title: "ParcelMarshall: Drift Mode Engaged 🏎️💨"
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        tabBarLabel: "Settings",
                        tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
                        title: "Settings"
                    }}
                />
            </Tabs>
        </DriverCtxProvider>
    );
}
