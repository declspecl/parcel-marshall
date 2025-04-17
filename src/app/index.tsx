import React, { useState, useEffect } from "react";
import { useDriver } from "@/hooks/useDriver";
import UpdateButton from "@/components/UpdateButton";
import AddAddressButton from "@/components/AddAddressButton";
import CompletionButton from "@/components/CompletionButton";
import { updateDestinations } from "@/lib/GoogleMapsService";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { getFormattedLocation, getUniqueDestinationKey } from "@/model/Location";
import { Text, View, StyleSheet, Pressable, FlatList, Modal, TextInput } from "react-native";
import { useThemeSettings } from "@/context/ThemeContext";
import { getCityFromCoords } from "@/lib/CityGeoCode";

export default function Home() {
    const { driver, addDestination, removeDestination, setDestinations } = useDriver();
    const destinations = driver.destinations;
    const [cityName, setCityName] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState("");
    //setting up bernard mode 🐸
    const { darkMode, bernardMode } = useThemeSettings();

    const handleComplete = () => {
        if (destinations.length === 0) return;
        removeDestination(destinations[0].address);
    };

    const [isUpdating, setIsUpdating] = useState(false);
    const [showToast, setShowToast] = useState(false);

    //using antons code to sort the destinations by proximity to the driver
    // placeholder for future logic
    // shoutout to the goat ANTON!!
    const { sortDestinationByProximity } = useDriver();

    const handleUpdate = async () => {
        setIsUpdating(true);
        setShowToast(true);
        console.log("Refreshing route...");
        const updatedDestinations = await updateDestinations(driver.currentLocation, driver.destinations);
        setDestinations(updatedDestinations);
        sortDestinationByProximity();
        setTimeout(() => {
            setIsUpdating(false);
            setShowToast(false);
        }, 2000);
    };

    //new address
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

    const current = destinations[0];
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

    return (
        <View
            style={[
                styles.container,
                darkMode && { backgroundColor: "#111" },
                bernardMode && { backgroundColor: "#0e1e0e" } // Bernard Vibes 😎🐸
            ]}
        >
            <Text style={[styles.title, darkMode && { color: "#eee" }, bernardMode && { color: "#baffc9" }]}>
                {bernardMode ? "🐸 Welcome to the Marsh" : "Home Page (but we’re never home) 🏡"}
            </Text>

            <Text style={[styles.subtext, darkMode && { color: "#aaa" }, bernardMode && { color: "#d4ffd9" }]}>
                {bernardMode ? "Ribbit. The next stop is destiny." : "The only ‘home’ we know is the next stop"}
            </Text>

            <Text style={[styles.location, darkMode && { color: "#ccc" }, bernardMode && { color: "#c6fccc" }]}>
                {bernardMode
                    ? `🐸 You’ve waded into: ${cityName || "an uncharted lily pad"}`
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
                        {bernardMode ? "🐸Bernard is rerouting..." : "📍ParcelMarshall is rerouting..."}
                    </Text>
                </View>
            )}

            <FlatList
                data={destinations}
                keyExtractor={(item) => getUniqueDestinationKey(item)}
                renderItem={({ item }) => (
                    <DestinationCard
                        destination={item}
                        isCurrent={getUniqueDestinationKey(item) === getUniqueDestinationKey(current)}
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
    title: { fontSize: 24, marginBottom: 20 },
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
        backgroundColor: "#f2f2f2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        position: "relative"
    },
    completeBtn: {
        marginTop: 12,
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 6
    },
    completeText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    doneText: {
        fontSize: 18,
        fontStyle: "italic",
        color: "#888"
    },
    subtext: {
        fontSize: 14,
        fontStyle: "italic",
        color: "#666",
        marginBottom: 20
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
