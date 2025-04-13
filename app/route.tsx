/**
 * Route Page (a.k.a. The Drift Zone 🚗💨)
 * This is where we send the boys (and the bugs).
 *
 * Features:
 * - Add destinations 🏁
 * - Delete them with extreme prejudice ❌
 * - Questionable compass direction logic 🧭
 *
 * Made with too much caffeine and not enough sleep.
 *
 *  we just vibe 😎
 */

import { Destination } from "@/model/Destination";
import { getUniqueDestinationKey } from "@/model/Location";
import { useDriver } from "@/store/DriverContext";
import React, { useState } from "react";
import { DestinationCard } from "@/components/DestinationCard";
import { Text, View, StyleSheet, FlatList, Pressable, Modal, TextInput } from "react-native";
import AddAddressButton from "@/components/AddAddressButton";
import CompletionButton from "@/components/CompletionButton";
import UpdateButton from "@/components/UpdateButton";

export default function Route() {
    const { driver, addDestination, removeDestination } = useDriver();
    const destinations = driver.destinations;

    const [modalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState("");

    //mock data to get a grip on the UI
    // this would be replaced with actual data from your API or state management
    //but you know me 😎

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
        addDestination(newDestination);
        setAddress("");
        setModalVisible(false);
    };

    //setting the scaffolding for future Update button here
    // There is current no google maps api logic so this will kinda work with that in the future
    const [isUpdating, setIsUpdating] = useState(false);
    const handleUpdate = () => {
        setIsUpdating(true);

        console.log("Refreshing route...");
        // Placeholder logic for updating the route
        // in a real app, this would involve API calls to update the route
        setTimeout(() => {
            setIsUpdating(false);
        }, 1500);
    };

    const handleComplete = () => {
        if (destinations.length === 0) return;
        removeDestination(destinations[0]);
    };

    const handleRemove = (destination: Destination) => {
        removeDestination(destination);
    };

    const current = destinations[0];

    //will update title and text to be more relevant to the app
    //we want a professional look and feel, not a meme fest
    //but for now I like the memes 😎
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Route Page (a.k.a. The Drift Zone 🏎️💨)</Text>
            <Text style={styles.subtext}>"The only 'route' we follow is pure chaos 🧭🔥"</Text>
            <Text style={styles.location}>You are here: ... XYZ address</Text>
            <Text style={styles.direction}>Traveling 🧭 N</Text>
            <UpdateButton onPress={handleUpdate} loading={isUpdating} />

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
                <CompletionButton onPress={handleComplete} />
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
    }
});
