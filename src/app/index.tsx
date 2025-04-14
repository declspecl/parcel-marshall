import React, { useEffect, useState } from "react";
import { useDriver } from "@/hooks/useDriver";
import { Destination } from "@/model/Destination";
import UpdateButton from "@/components/UpdateButton";
import AddAddressButton from "@/components/AddAddressButton";
import CompletionButton from "@/components/CompletionButton";
import { DestinationCard } from "@/components/DestinationCard";
import { getFormattedLocation, getUniqueDestinationKey } from "@/model/Location";
import { Text, View, StyleSheet, Pressable, FlatList, Modal, TextInput } from "react-native";
import { updateDestinations } from "@/lib/GoogleMapsService";

import { getGeocode } from "../lib/GoogleMapsService";

export default function Home() {
    const { driver, addDestination, removeDestination, setDestinations } = useDriver();
    const destinations = driver.destinations;

    const [modalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState("");

    const handleComplete = () => {
        if (destinations.length === 0) return;
        removeDestination(destinations[0]);
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

        const res = await getGeocode(address);
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
            travelDuration: 10,
            travelDistance: 500,
            travelDirection: { degrees: 0 }
        };

        addDestination(newDestination);
        setAddress("");
        setModalVisible(false);
    };

    const current = destinations[0];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Page (but we’re never home) 🏡</Text>
            <Text style={styles.subtext}>The only ‘home’ we know is the next stop</Text>
            <Text style={styles.location}>You are at: {getFormattedLocation(driver.currentLocation)}</Text>
            <Text style={styles.direction}>Traveling 🧭 N</Text>
            <UpdateButton onPress={handleUpdate} loading={isUpdating} />
            {showToast && (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>📍 ParcelMarshall is rerouting...</Text>
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

            {destinations.length > 0 ? (
                <CompletionButton onPress={handleComplete} label="Mark as Complete" />
            ) : (
                <CompletionButton onPress={() => {}} label="📦 Mission Complete, Marshall!" disabled />
            )}

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modal}>
                    <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeText}>❌</Text>
                    </Pressable>
                    <Text style={styles.modalTitle}>Add Destination</Text>
                    <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
                    <Pressable style={styles.modalAdd} onPress={handleAdd}>
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
