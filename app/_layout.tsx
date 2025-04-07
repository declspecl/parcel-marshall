import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
    return (
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
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="route"
                options={{
                    tabBarLabel: "Map",
                    tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />
                }}
            />
        </Tabs>
    );
}
