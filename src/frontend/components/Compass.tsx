import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { CompassDirection, Destination, getCompassDirection } from "@/model";
import { useThemeSettings } from "@/context/ThemeContext";
interface CompassProps {
    readonly destination: Destination;
}

const compassIconMap: Record<CompassDirection, { name: keyof typeof Ionicons.glyphMap; rotation: number }> = {
    [CompassDirection.NORTH]: { name: "arrow-up", rotation: 0 },
    [CompassDirection.NORTH_EAST]: { name: "arrow-up", rotation: 45 },
    [CompassDirection.EAST]: { name: "arrow-up", rotation: 90 },
    [CompassDirection.SOUTH_EAST]: { name: "arrow-up", rotation: 135 },
    [CompassDirection.SOUTH]: { name: "arrow-up", rotation: 180 },
    [CompassDirection.SOUTH_WEST]: { name: "arrow-up", rotation: 225 },
    [CompassDirection.WEST]: { name: "arrow-up", rotation: 270 },
    [CompassDirection.NORTH_WEST]: { name: "arrow-up", rotation: 315 }
};

export function Compass({ destination }: CompassProps) {
    if (destination.type !== "full") return null;
    const compassDirection = getCompassDirection(destination.travelDirection);
    const { name: iconName, rotation } = compassIconMap[compassDirection];
    const { darkMode, bernardMode } = useThemeSettings();

    const borderColor = bernardMode ? "#a4f6aa" : darkMode ? "#bbb" : "#000";
    const arrowColor = bernardMode ? "#baffc9" : darkMode ? "#eee" : "#000";

    return (
        <View style={[styles.container, { borderColor }]}>
            <Ionicons
                name={iconName}
                size={14}
                color={arrowColor}
                style={{ transform: [{ rotate: `${rotation}deg` }] }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 999,
        padding: 4,
        marginLeft: 4,
        minWidth: 22,
        minHeight: 22
    }
});
