import { getCompassDirectionAbbreviation } from "@/model/CompassDirection";
import { Destination } from "@/model/Destination";
import { getCompassDirection } from "@/model/Direction";
import { useDriver } from "@/store/DriverContext";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface DestinationCardProps {
    readonly destination: Destination;
    readonly isCurrent?: boolean;
}

export function DestinationCard({ destination, isCurrent = false }: DestinationCardProps) {
    const { removeDestination } = useDriver();

    return (
        <View style={[styles.card, isCurrent && styles.currentCard]}>
            <Text>{destination.address}</Text>
            <Text>
                {destination.travelDistance}mi 🧭{" "}
                {getCompassDirectionAbbreviation(getCompassDirection(destination.travelDirection))}
            </Text>
            <Pressable style={styles.removeBtn} onPress={() => removeDestination(destination)}>
                <Text>❌</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f2f2f2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10
    },
    currentCard: {
        borderColor: "#3366ff",
        borderWidth: 2,
        backgroundColor: "#e6f0ff"
    },
    removeBtn: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 4
    }
});
