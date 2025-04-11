import React, { useState } from "react";
import { useDriver } from "@/store/DriverContext";
import { Destination } from "@/model/Destination";
import { getUniqueDestinationKey } from "@/model/Location";
import { DestinationCard } from "@/components/DestinationCard";
import { Text, View, StyleSheet, Pressable, FlatList, Modal, TextInput } from "react-native";

export default function Home() {
    const { driver, addDestination, removeDestination } = useDriver();
    const destinations = driver.destinations;

    const [modalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState("");

    const handleComplete = () => {
        if (destinations.length === 0) return;
        removeDestination(destinations[0]);
    };

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

    const current = destinations[0];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Page (but we’re never home) 🏡</Text>
            <Text style={styles.subtext}>The only ‘home’ we know is the next stop</Text>

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

            <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.addText}>➕ Add Address</Text>
            </Pressable>

            {destinations.length > 0 ? (
                <Pressable style={styles.completeBtn} onPress={handleComplete}>
                    <Text style={styles.completeText}>Mark as Complete</Text>
                </Pressable>
            ) : (
                <Text style={styles.doneText}>All destinations completed! 🎉</Text>
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
    addBtn: {
        marginTop: 16,
        backgroundColor: "#3366ff",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
        alignSelf: "center"
    },
    addText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
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
    }
});
