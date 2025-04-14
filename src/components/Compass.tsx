import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { CompassDirection, Destination, getCompassDirection } from "@/model";

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
    const compassDirection = getCompassDirection(destination.travelDirection);
    const { name: iconName, rotation } = compassIconMap[compassDirection];

    return (
        <View style={styles.container}>
            <Ionicons name={iconName} size={16} color="black" style={{ transform: [{ rotate: `${rotation}deg` }] }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: "100%"
    }
});
