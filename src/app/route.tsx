import React, { useState, useEffect } from "react";
import { useDriver } from "@/hooks/useDriver";
import UpdateButton from "@/components/UpdateButton";
import { updateDestinations } from "@/lib/GoogleMapsService";
import AddAddressButton from "@/components/AddAddressButton";
import CompletionButton from "@/components/CompletionButton";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { getFormattedLocation, getUniqueDestinationKey } from "@/model/Location";
import { Text, View, StyleSheet, FlatList, Pressable, Modal, TextInput } from "react-native";
import { Destination, getFastestRoute, sortDestinationsByFastestRoute, updateDestinationAddress } from "@/model";
import { useThemeSettings } from "@/context/ThemeContext";
import { getCityFromCoords } from "@/lib/CityGeoCode";

export default function Route() {
    const { driver, addDestination, removeDestination, setDestinations } = useDriver();
    const destinations = driver.destinations;
    const [cityName, setCityName] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [showToast, setShowToast] = useState(false);
    //setting up bernard mode 🐸
    const { darkMode, bernardMode } = useThemeSettings();
    const handleAdd = async () => {
        if (!address.trim()) return;

        try {
            await addDestination(address.trim());
        } catch (error) {
            console.error(error);
            alert(error);
            return;
        }

        setAddress("");
        setModalVisible(false);
    };

    const handleRemove = (destination: Destination) => {
        removeDestination(destination.address);
    };

    const handleUpdate = async () => {
        setIsUpdating(true);
        setShowToast(true);

        console.log("🔄 Refreshing route (by fastest time)...");
        console.log("🔄 Refreshing route from:", driver.currentLocation);
        console.log(
            "➡️ Before sort:",
            driver.destinations.map((d) => d.address)
        );
        const newDestinations = await updateDestinations(driver.currentLocation, driver.destinations);
        const sorted = sortDestinationsByFastestRoute({
            ...driver,
            destinations: newDestinations
        });

        setDestinations(sorted.destinations);

        console.log(
            "✅ After sort:",
            sorted.destinations.map((d) => d.address)
        );

        setTimeout(() => {
            setIsUpdating(false);
            setShowToast(false);
        }, 2000);
    };

    const current = destinations[0];
    //for grabbing city name instead of coords
    useEffect(() => {
        if (driver.currentLocation) {
            getCityFromCoords(driver.currentLocation.latitude, driver.currentLocation.longitude)
                .then((name) => {
                    console.log("📍 City result:", name);
                    setCityName(name);
                })
                .catch((err) => {
                    console.error("Reverse geocode failed:", err);
                    setCityName(null);
                });
        }
    }, [driver.currentLocation]);

    const handleComplete = () => {
        const toRemove = destinations[0];

        removeDestination(toRemove.address);
    };

    //will update title and text to be more relevant to the app
    //we want a professional look and feel, not a meme fest
    //but for now I like the memes 😎
    return (
        <View
            style={[
                styles.container,
                darkMode && { backgroundColor: "#111" },
                bernardMode && { backgroundColor: "#0e1e0e" }
            ]}
        >
            <Text
                style={[
                    { fontSize: 24, marginBottom: 20 },
                    darkMode && { color: "#eee" },
                    bernardMode && { color: "#baffc9" }
                ]}
            >
                {bernardMode ? "Bernard’s Drift Zone 🐸💨" : "Route Page (a.k.a. The Drift Zone 🏎️💨)"}
            </Text>

            <Text style={[styles.subtext, darkMode && { color: "#aaa" }, bernardMode && { color: "#d4ffd9" }]}>
                {bernardMode
                    ? '"All routes lead to the lily pad."'
                    : "\"The only 'route' we follow is pure chaos 🧭🔥\""}
            </Text>

            <Text style={[styles.location, darkMode && { color: "#ccc" }, bernardMode && { color: "#c6fccc" }]}>
                {bernardMode
                    ? `🐸 Currently drifting through: ${cityName || "a mysterious bog"}`
                    : cityName
                      ? `You are in: ${cityName}`
                      : `You are at: ${getFormattedLocation(driver.currentLocation)}`}
            </Text>

            <Text style={[styles.direction, darkMode && { color: "#bbb" }, bernardMode && { color: "#a0ffab" }]}>
                Traveling 🧭 N
            </Text>

            <UpdateButton onPress={handleUpdate} loading={isUpdating} />

            {showToast && (
                <View style={[styles.toast, bernardMode && { backgroundColor: "#2a6f2a" }]}>
                    <Text style={styles.toastText}>
                        {bernardMode
                            ? "🐸 Bernard is optimizing your vibes..."
                            : "⏱ ParcelMarshall is optimizing for speed..."}
                    </Text>
                </View>
            )}

            <FlatList
                data={destinations}
                keyExtractor={(item) => getUniqueDestinationKey(item)}
                renderItem={({ item }) => (
                    <DestinationCard
                        destination={item}
                        isCurrent={getUniqueDestinationKey(item) === getUniqueDestinationKey(destinations[0])}
                        isRoutesPage={true} // this enables the total distance display
                    />
                )}
            />

            <AddAddressButton onPress={() => setModalVisible(true)} />

            <CompletionButton
                onPress={destinations.length > 0 ? handleComplete : () => {}}
                label={
                    destinations.length > 0
                        ? bernardMode
                            ? "🐸 Another hop, another drop"
                            : "Mark as Complete"
                        : bernardMode
                          ? "🐸 Mission complete, Marsh Walker."
                          : "📦 Mission Complete, Marshall!"
                }
                disabled={destinations.length === 0}
            />

            <Modal visible={modalVisible} transparent animationType="fade">
                <View
                    style={[
                        styles.modal,
                        darkMode && { backgroundColor: "#222" },
                        bernardMode && { backgroundColor: "#1f3d1f" }
                    ]}
                >
                    <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeText}>❌</Text>
                    </Pressable>

                    <Text
                        style={[styles.modalTitle, darkMode && { color: "#fff" }, bernardMode && { color: "#baffc9" }]}
                    >
                        Add Destination
                    </Text>

                    <TextInput
                        placeholder="Address"
                        placeholderTextColor={darkMode || bernardMode ? "#aaa" : "#999"}
                        value={address}
                        onChangeText={setAddress}
                        style={[
                            styles.input,
                            darkMode && { color: "#fff", backgroundColor: "#333", borderColor: "#555" },
                            bernardMode && { color: "#d0ffd6", backgroundColor: "#284f28", borderColor: "#67b067" }
                        ]}
                    />

                    <Pressable
                        style={[styles.modalAdd, bernardMode && { backgroundColor: "#4CAF50" }]}
                        onPress={handleAdd}
                    >
                        <Text style={styles.modalAddText}>Add</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    location: { fontSize: 16, marginBottom: 4 },
    direction: { fontSize: 14, marginBottom: 10 },
    updateBtn: {
        backgroundColor: "#d9d9ff",
        padding: 6,
        borderRadius: 4,
        alignSelf: "flex-start",
        marginBottom: 20
    },
    card: {
        backgroundColor: "#ffffff", // white card for contrast
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        position: "relative",

        // Subtle outline
        borderWidth: 1,
        borderColor: "#ddd",

        // Shadow for web fallback
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2 // web fallback
    },

    removeBtn: {
        position: "absolute",
        right: 10,
        top: 10
    },

    modal: {
        backgroundColor: "white",
        margin: 40,
        padding: 20,
        borderRadius: 16,
        elevation: 10,
        justifyContent: "center",
        alignItems: "center",
        top: "30%"
    },
    modalTitle: { fontSize: 18, marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        padding: 8,
        borderRadius: 6,
        marginBottom: 10
    },
    modalAdd: {
        backgroundColor: "#3366ff",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6
    },
    modalAddText: {
        color: "white",
        fontWeight: "bold"
    },
    closeBtn: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 4
    },
    subtext: {
        fontSize: 14,
        fontStyle: "italic",
        color: "#666",
        marginBottom: 20
    },

    closeText: {
        fontSize: 18
    },
    //parcellmarshall toast for rerouting
    toast: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "#343a40",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        zIndex: 999,
        elevation: 10
    },
    toastText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
    }
});

/* Commenting out old code for adding destinations
    //keep this for reference, but we will be using the Google Maps API to get the address and coordinates
    const handleAdd = () => {
        if (!address.trim()) return;

        const newDestination: Destination = {
            latitude: 5,
            longitude: 56,
            address,
            travelDuration: 10,
            travelDistance: 500,
            travelDirection: { degrees: 0 }
        };

        addDestination(newDestination); // Updates global state
        setVirtualRoute(getFastestRoute(driver.currentLocation, [...driver.destinations, newDestination])); // Update local route view

        setAddress("");
        setModalVisible(false);
    };
    */
