import React, { useState, useEffect } from "react";
import { useDriver } from "@/hooks/useDriver";
import UpdateButton from "@/components/UpdateButton";
import { updateDestinations, geocodeAddress, chunkAndUpdateDestinations } from "@/lib/GoogleMapsService";
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
    //adding state to control the toggle for bulk add
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkInput, setBulkInput] = useState("");
    const [failedAddresses, setFailedAddresses] = useState<string[]>([]);

    const [isUpdating, setIsUpdating] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    //setting up bernard mode 🐸
    const { darkMode, bernardMode } = useThemeSettings();

    const handleAdd = async () => {
        if (!address.trim()) return;

        setIsUpdating(true);
        setToastMessage(bernardMode ? "🐸 Bernard is adding your destination..." : "Adding destination...");

        try {
            await addDestination(address.trim());
            setToastMessage(bernardMode ? "🐸 Destination added successfully!" : "Destination added successfully!");
        } catch (error) {
            console.error(error);
            setToastMessage(
                bernardMode
                    ? "🐸 Bernard denied your duplicate address. Please try again."
                    : "Duplicate address denied. Please try again."
            );
        }

        setAddress("");
        setModalVisible(false);

        setTimeout(() => {
            setIsUpdating(false);
            setToastMessage(null);
        }, 2000);
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
        //chunking function that gets by 25 limit api calls
        //const newDestinations = await updateDestinations(driver.currentLocation, driver.destinations);
        const newDestinations = await chunkAndUpdateDestinations(driver.currentLocation, driver.destinations);
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
    //bulk add function
    const handleBulkAdd = async () => {
        setFailedAddresses([]);
        const lines = bulkInput
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (lines.length === 0) {
            setToastMessage("No valid addresses found");
            return;
        }

        setIsUpdating(true);
        setToastMessage(bernardMode ? "🐸 Bulk hopping to destinations..." : "Adding multiple destinations...");

        let added = 0;
        let failed: string[] = [];
        let newDestinations: Destination[] = [];

        await Promise.all(
            lines.map(async (line) => {
                try {
                    console.log(`🛠️ Attempting to geocode: "${line}"`);
                    const result = await geocodeAddress(line);
                    if (result) {
                        newDestinations.push({
                            ...result,
                            address: result.address ?? "Unknown location",
                            type: "partial",
                            travelDuration: "0 min",
                            travelDistance: 0,
                            travelDirection: "N/A"
                        });

                        added++;
                    } else {
                        failed.push(line);
                    }
                } catch (error) {
                    console.warn(`❌ Failed to geocode: "${line}"`, error);
                    failed.push(line);
                }
            })
        );
        //chunking function to get past 25 limit on API
        //const updated = await updateDestinations(driver.currentLocation, [...driver.destinations, ...newDestinations]);
        const updated = await chunkAndUpdateDestinations(driver.currentLocation, [
            ...driver.destinations,
            ...newDestinations
        ]);
        setDestinations(updated);
        setFailedAddresses(failed);

        console.log(`✅ Added ${added} destinations. Skipped ${failed.length}.`);
        console.log("Total now in state:", updated.length);

        setBulkInput("");
        if (failed.length === 0) {
            setModalVisible(false);
        }

        const resultMessage =
            failed.length === 0
                ? bernardMode
                    ? `🐸 All ${added} lily pads added!`
                    : `✅ Added ${added} addresses!`
                : bernardMode
                  ? `🐸 Added ${added}. Skipped ${failed.length} swampy ones.`
                  : `✅ Added ${added}, failed on ${failed.length}`;

        setToastMessage(resultMessage);

        setTimeout(() => {
            setIsUpdating(false);
            setToastMessage(null);
        }, 4000);
    };
    const current = destinations[0];
    //for grabbing city name instead of coords
    useEffect(() => {
        if (driver.currentLocation) {
            getCityFromCoords(driver.currentLocation.latitude, driver.currentLocation.longitude)
                .then((name) => {
                    //console.log("📍 City result:", name);
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

            <UpdateButton onPress={handleUpdate} loading={isUpdating} />

            {toastMessage && (
                <View style={[styles.toast, bernardMode && { backgroundColor: "#2a6f2a" }]}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </View>
            )}

            <FlatList
                data={destinations}
                keyExtractor={(item) => getUniqueDestinationKey(item)}
                renderItem={({ item, index }) => (
                    <DestinationCard
                        destination={item}
                        index={index}
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
                        bulkMode && styles.modalLarge,
                        darkMode && { backgroundColor: "#222" },
                        bernardMode && { backgroundColor: "#1f3d1f" }
                    ]}
                >
                    <Pressable
                        style={styles.closeBtn}
                        onPress={() => {
                            setModalVisible(false);
                            setFailedAddresses([]);
                        }}
                    >
                        <Text style={styles.closeText}>❌</Text>
                    </Pressable>

                    <Text
                        style={[styles.modalTitle, darkMode && { color: "#fff" }, bernardMode && { color: "#baffc9" }]}
                    >
                        {bulkMode ? "Bulk Add Destinations" : "Add Destination"}
                    </Text>

                    {bulkMode ? (
                        <>
                            <TextInput
                                multiline
                                numberOfLines={15}
                                placeholder="Paste multiple addresses, one per line to ensure accuracy!"
                                placeholderTextColor={darkMode || bernardMode ? "#aaa" : "#999"}
                                value={bulkInput}
                                onChangeText={setBulkInput}
                                style={[
                                    styles.input,
                                    {
                                        height: 450,
                                        width: "100%",
                                        textAlignVertical: "top",
                                        fontSize: 18,
                                        lineHeight: 27,
                                        padding: 20,
                                        borderRadius: 10,
                                        fontFamily: "monospace",
                                        backgroundColor: "#f5f5f5",
                                        color: "#222",
                                        borderWidth: 1,
                                        borderColor: "#ccc"
                                    },
                                    darkMode && {
                                        backgroundColor: "#2a2a2a",
                                        color: "#fff",
                                        borderColor: "#555"
                                    },
                                    bernardMode && {
                                        backgroundColor: "#284f28",
                                        color: "#d0ffd6",
                                        borderColor: "#67b067"
                                    }
                                ]}
                            />

                            {failedAddresses.length > 0 && (
                                <View
                                    style={{
                                        marginTop: 10,
                                        padding: 16,
                                        backgroundColor: bernardMode ? "#452a2a" : "#ffeeee",
                                        borderRadius: 10,
                                        borderColor: bernardMode ? "#bb7777" : "#cc0000",
                                        borderWidth: 1,
                                        minWidth: 400
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: 6,
                                            color: bernardMode ? "#ffbbbb" : "#cc0000",
                                            fontSize: 16
                                        }}
                                    >
                                        ❌ {failedAddresses.length} address{failedAddresses.length !== 1 ? "es" : ""}{" "}
                                        failed to geocode:
                                    </Text>
                                    {failedAddresses.map((addr, index) => (
                                        <Text
                                            key={index}
                                            style={{
                                                color: bernardMode ? "#ffdddd" : "#990000",
                                                fontSize: 18,
                                                lineHeight: 22
                                            }}
                                        >
                                            • {addr}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </>
                    ) : (
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
                    )}

                    <Pressable
                        style={[styles.modalAdd, bernardMode && { backgroundColor: "#4CAF50" }]}
                        onPress={bulkMode ? handleBulkAdd : handleAdd}
                    >
                        <Text style={styles.modalAddText}>{bulkMode ? "Add All" : "Add"}</Text>
                    </Pressable>

                    {/* Bulk Toggle Button */}
                    <Pressable
                        style={styles.bulkToggle}
                        onPress={() => {
                            setBulkMode(!bulkMode);
                            setFailedAddresses([]);
                        }}
                    >
                        <Text style={styles.bulkToggleText}>
                            {bulkMode ? "↩️ Switch to Single Add" : "📋 Bulk Add Mode"}
                        </Text>
                    </Pressable>
                </View>
            </Modal>
            {toastMessage && (
                <View style={[styles.toast, bernardMode && { backgroundColor: "#2a6f2a" }]}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </View>
            )}
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
        backgroundColor: "#f2f2ff", // white card for contrast
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
    },
    //toggle bulk add button
    bulkToggle: {
        position: "absolute",
        bottom: 12,
        right: 12,
        padding: 6,
        borderRadius: 4,
        backgroundColor: "transparent"
    },
    bulkToggleText: {
        color: "#00bfff",
        fontSize: 16,
        textAlign: "right"
    },
    //adding larger modal size for bulk add
    modalLarge: {
        width: "90%",
        height: "65%",
        top: "15%"
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
