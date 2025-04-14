import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DriverCtxProvider } from "@/context/DriverContext";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import { RouteLabel, RouteName } from "@/lib/Routes";
import { initGoogleMapsAPI } from "@/lib/GoogleMapsService";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SplashScreen from "@/components/SplashScreen";
import { RouteLabel, RouteName } from "@/lib/Routes";
import { DriverCtxProvider } from "@/context/DriverContext";

export default function RootLayout() {
    const [isSplashVisible, setSplashVisible] = useState(true);
    useEffect(() => {
        initGoogleMapsAPI();
    }, []);
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
                    name={RouteName.Index}
                    options={{
                        tabBarLabel: RouteLabel.Home,
                        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                        title: "ParcelMarshall: Next stop: World domination (or just Gavin’s Rust Hideout) 🦀🧠"
                    }}
                />
                <Tabs.Screen
                    name={RouteName.Route}
                    options={{
                        tabBarLabel: RouteLabel.Route,
                        tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
                        title: "ParcelMarshall: Drift Mode Engaged 🏎️💨"
                    }}
                />
                <Tabs.Screen
                    name={RouteName.Settings}
                    options={{
                        tabBarLabel: RouteLabel.Settings,
                        tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
                        title: "Settings"
                    }}
                />
            </Tabs>
        </DriverCtxProvider>
    );
}
