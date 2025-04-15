import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Destination } from "@/model/Destination";
import { useDriver } from "@/hooks/useDriver";
import { EditAddressModal } from "./EditAddressModal";
import { getCompassDirection } from "@/model/Direction";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getCompassDirectionAbbreviation } from "@/model/CompassDirection";
import { Compass } from "./Compass";
import { getGeocode } from "../lib/GoogleMapsService";
import { emptyDuration } from "@/model/Duration";

interface DestinationCardProps {
    readonly destination: Destination;
    readonly isCurrent?: boolean;
}

export function DestinationCard({ destination, isCurrent = false }: DestinationCardProps) {
    const { driver, removeDestination, updateDestination } = useDriver();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSaveAddress = async (newAddress: string) => {
        if (!newAddress.trim()) return;

        const res = await getGeocode(newAddress);
        if (!res) return;

        const [formatted_address, latLng] = res;
        if (driver.destinations.some((d) => d.latitude === latLng.lat() && d.longitude === latLng.lng())) {
            console.warn("Duplicate address detected — skipping");
            return;
        }

        const newDestination: Destination = {
            latitude: latLng.lat(),
            longitude: latLng.lng(),
            address: formatted_address,
            travelDuration: emptyDuration,
            travelDistance: 0,
            travelDirection: { degrees: 0 }
        };

        setIsModalVisible(false);
        updateDestination(destination, newDestination);
    };

    return (
        <>
            <View style={[styles.card, isCurrent && styles.currentCard]}>
                <View>
                    <Text style={{ textOverflow: "clip" }}>{destination.address.substring(0, 35)}</Text>
                    <Text style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Text>{destination.travelDistance}mi </Text>

                        <Text>
                            {destination.travelDirection.degrees}°
                            {getCompassDirectionAbbreviation(getCompassDirection(destination.travelDirection))}
                        </Text>

                        <Compass destination={destination} />
                    </Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <Pressable style={styles.editBtn} onPress={() => setIsModalVisible(true)}>
                        <Text>
                            <Ionicons name="pencil" size={16} color="black" />
                        </Text>
                    </Pressable>
                    <Pressable style={styles.removeBtn} onPress={() => removeDestination(destination)}>
                        <Text>
                            <Ionicons name="trash" size={16} color="black" />
                        </Text>
                    </Pressable>
                </View>
            </View>

            <EditAddressModal
                isVisible={isModalVisible}
                destination={destination}
                onSave={handleSaveAddress}
                onClose={() => setIsModalVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "auto"
    },
    currentCard: {
        borderColor: "#3366ff",
        borderWidth: 2,
        backgroundColor: "#e6f0ff"
    },
    buttonsContainer: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    editBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ddd"
    },
    removeBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#ff0000",
        borderWidth: 1,
        borderColor: "#ddd"
    }
});
