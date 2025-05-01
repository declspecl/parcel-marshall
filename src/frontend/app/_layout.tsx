import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SplashScreen from "@/components/ui/SplashScreen";
import { RouteLabel, RouteName } from "@/lib/Routes";
import { DriverCtxProvider } from "@/context/DriverContext";
import { initGoogleMapsAPI } from "@/lib/GoogleMapsService";
import Toast, { BaseToast } from "react-native-toast-message";
import { ThemeProvider } from "@/context/ThemeContext";
import { BernardToast } from "@/components/ui/BernardToast";
import { DarkToast } from "@/components/ui/DarkThemeToast";
import { View, Text } from "react-native";
import { useThemeSettings } from "@/context/ThemeContext";

//toast config for settings page

const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: "#007AFF",
                height: 120,
                padding: 20,
                borderRadius: 12,
                backgroundColor: "#e0f0ff"
            }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            text1Style={{
                fontSize: 14,
                fontWeight: "bold"
            }}
            text2Style={{
                fontSize: 18,
                marginTop: 5
            }}
        />
    ),

    info: (props: any) => (
        <View
            style={{
                backgroundColor: "#edf6ff",
                borderLeftColor: "#007AFF",
                borderLeftWidth: 6,
                borderRadius: 12,
                padding: 16,
                margin: 8,
                minHeight: 90,
                flexDirection: "column",
                alignItems: "flex-start"
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#111",
                    flexWrap: "wrap",
                    width: "100%"
                }}
            >
                {props.text1}
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: "#444",
                    marginTop: 4,
                    flexWrap: "wrap",
                    width: "100%"
                }}
                numberOfLines={0}
            >
                {props.text2}
            </Text>
        </View>
    ),

    dark: (props: any) => <DarkToast {...props} />,

    bernard: (props: any) => <BernardToast {...props} />
};

//couldnt call hooks in root layout so made a nested function and plugged it in
//this was to add dark mode lol
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
            <ThemeProvider>
                <>
                    <MainTabs />
                    <Toast config={toastConfig} />
                </>
            </ThemeProvider>
        </DriverCtxProvider>
    );
}

function MainTabs() {
    const { darkMode, bernardMode } = useThemeSettings();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: bernardMode ? "#58d68d" : darkMode ? "#ccc" : "#007AFF",
                tabBarInactiveTintColor: darkMode ? "#888" : "#8E8E93",
                tabBarStyle: {
                    backgroundColor: bernardMode ? "#0d2f23" : darkMode ? "#111" : "#fff",
                    borderTopColor: darkMode || bernardMode ? "#333" : "#ddd"
                },
                headerStyle: {
                    backgroundColor: bernardMode ? "#0d2f23" : darkMode ? "#111" : "#fff"
                },
                headerTitleStyle: {
                    color: bernardMode ? "#a4f6aa" : darkMode ? "#eee" : "#000",
                    fontWeight: "bold"
                },
                headerTintColor: bernardMode ? "#a4f6aa" : darkMode ? "#eee" : "#000"
            }}
        >
            <Tabs.Screen
                name={RouteName.Index}
                options={{
                    tabBarLabel: bernardMode ? "Marsh 🐸" : RouteLabel.Home,
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                    title: bernardMode
                        ? "ParcelMarsh 🐸: Gently Slidin’ Through the Swamp"
                        : "ParcelMarshall: Next stop, world domination 🧠🦀"
                }}
            />

            <Tabs.Screen
                name={RouteName.Route}
                options={{
                    tabBarLabel: bernardMode ? "Hop Map 🐸" : RouteLabel.Route,
                    tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
                    title: bernardMode
                        ? "ParcelMarsh: Hop Optimization Active 🐸📦"
                        : "ParcelMarshall: Drift Mode Engaged 🏎️💨"
                }}
            />

            <Tabs.Screen
                name={RouteName.Settings}
                options={{
                    tabBarLabel: bernardMode ? "Swamp Tools 🐸" : RouteLabel.Settings,
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
                    title: bernardMode ? "ParcelMarsh Settings: Tune Your Vibes 🐸" : "Settings"
                }}
            />
        </Tabs>
    );
}
