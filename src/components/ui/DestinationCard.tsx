import { Compass } from "../Compass";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDriver } from "@/hooks/useDriver";
import { EditAddressModal } from "../EditAddressModal";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Destination, getCompassDirection, getCompassDirectionAbbreviation } from "@/model";
import { useThemeSettings } from "@/context/ThemeContext";

interface DestinationCardProps {
    readonly destination: Destination;
    readonly isCurrent?: boolean;
    readonly isRoutesPage?: boolean;
}

export function DestinationCard({ destination, isCurrent = false, isRoutesPage = false }: DestinationCardProps) {
    const { driver, removeDestination, updateDestinationAddress } = useDriver();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { darkMode, bernardMode } = useThemeSettings();

    const handleSaveAddress = async (newAddress: string) => {
        if (!newAddress.trim()) return;

        setIsModalVisible(false);
        updateDestinationAddress(destination.address, newAddress);
    };

    return (
        <>
            <View
                style={[
                    styles.card,
                    darkMode && styles.darkCard,
                    bernardMode && styles.bernardCard,
                    isCurrent && styles.currentCard,
                    isCurrent && darkMode && styles.currentCardDark,
                    isCurrent && bernardMode && styles.currentCardBernard
                ]}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={[
                            styles.address,
                            (darkMode || bernardMode) && styles.addressDark,
                            bernardMode && styles.addressBernard
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {destination.address} {bernardMode && "🐸"}
                    </Text>

                    {destination.type === "full" ? (
                        <>
                            <Text
                                style={[
                                    styles.meta,
                                    darkMode && { color: "#ccc" },
                                    bernardMode && { color: "#c2ffd9" }
                                ]}
                            >
                                {destination.travelDistance.toFixed(1)}mi ·{" "}
                                {getCompassDirectionAbbreviation(getCompassDirection(destination.travelDirection))}{" "}
                                <Compass destination={destination} />
                            </Text>

                            {isRoutesPage && destination.cumulativeDistance !== undefined && (
                                <Text
                                    style={{
                                        marginTop: 2,
                                        fontSize: 13,
                                        fontWeight: "600",
                                        color: bernardMode ? "#8dfcba" : darkMode ? "#ddd" : "#333"
                                    }}
                                >
                                    {bernardMode
                                        ? `Hop Count: ${destination.cumulativeDistance.toFixed(1)} mi 🍃`
                                        : `Total: ${destination.cumulativeDistance.toFixed(1)} mi`}
                                </Text>
                            )}
                        </>
                    ) : (
                        <Text style={[styles.meta, darkMode && { color: "#bbb" }]}>Routing...</Text>
                    )}
                </View>

                <View style={styles.buttonsContainer}>
                    <Pressable
                        style={[
                            styles.editBtn,
                            darkMode && { backgroundColor: "#333" },
                            bernardMode && { backgroundColor: "#5fd27f", borderColor: "#1d4027" }
                        ]}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Ionicons name="pencil" size={16} color={darkMode ? "#fff" : "black"} />
                    </Pressable>

                    <Pressable
                        style={[
                            styles.removeBtn,
                            darkMode && { backgroundColor: "#aa0000" },
                            bernardMode && { backgroundColor: "#f25f5c", borderColor: "#2e8b57" }
                        ]}
                        onPress={() => removeDestination(destination.address)}
                    >
                        <Ionicons name="trash" size={16} color="white" />
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
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },
    darkCard: {
        backgroundColor: "#1a1a1a",
        borderColor: "#333"
    },
    bernardCard: {
        backgroundColor: "#0e1f0e",
        borderColor: "#5fd27f",
        shadowColor: "#0f0",
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    currentCard: {
        borderColor: "#3366ff",
        borderWidth: 2,
        backgroundColor: "#e6f0ff"
    },
    address: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4
    },
    meta: {
        fontSize: 14,
        color: "#4a4a4a", // darker and clearer than #666
        fontWeight: "500"
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginLeft: 10
    },
    editBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#e0e0e0", // ✨ Softer light gray
        borderWidth: 1,
        borderColor: "#ccc"
    },
    removeBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#ff4d4d", // ✨ Less saturated red
        borderWidth: 1,
        borderColor: "#d32f2f" // Optional subtle border
    },
    addressDark: {
        color: "#eee"
    },
    addressBernard: {
        color: "#baffc9"
    },
    currentCardDark: {
        backgroundColor: "#1c1c1c",
        borderColor: "#66aaff",
        borderWidth: 2
    },

    currentCardBernard: {
        backgroundColor: "#143d2b",
        borderColor: "#58d68d",
        borderWidth: 2
    }
});
