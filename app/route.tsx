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

import React, { useState } from "react";
import { Text, View, StyleSheet, FlatList, Pressable, Modal, TextInput } from "react-native";

export default function Route() {
    const [modalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState("");

    //mock data to get a grip on the UI
    // this would be replaced with actual data from your API or state management
    //but you know me 😎
    const [destinations, setDestinations] = useState([
        {
            id: "1",
            address: "318 Meadow Brook Rd, Rochester, MI 48309",
            distance: "30mi",
            direction: "NE"
        },
        {
            id: "2",
            address: "Anton’s Discrete Math Asylum, UA 01001",
            distance: "12mi",
            direction: "NW"
        },
        {
            id: "3",
            address: "Bernard's Cool Car, Rochester, MI 48309",
            distance: "69mi",
            direction: "W"
        },
        {
            id: "4",
            address: "Gavin's Rust Hideout, Rochester, MI 48309",
            distance: "404mi",
            direction: "SE"
        },
        {
            id: "5",
            address: "318 Meadow Brook Rd, Rochester, MI 48309",
            distance: "1mi",
            direction: "S"
        }
    ]);

    const handleAdd = () => {
        console.log("Add destination:", address);
        setModalVisible(false);
        setAddress("");
        // you’d actually update state here
    };

    const handleRemove = (id: string) => {
        setDestinations(destinations.filter((destination) => destination.id !== id));
    };
    //will update title and text to be more relevant to the app
    //we want a professional look and feel, not a meme fest
    //but for now I like the memes 😎
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Route Page (a.k.a. The Drift Zone 🏎️💨)</Text>
            <Text style={styles.location}>You are here: ... XYZ address</Text>
            <Text style={styles.direction}>Traveling 🧭 N</Text>
            <Pressable style={styles.updateBtn}>
                <Text>Update now</Text>
            </Pressable>

            <FlatList
                data={destinations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>{item.address}</Text>
                        <Text>
                            {item.distance} 🧭 {item.direction}
                        </Text>
                        <Pressable style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
                            <Text>❌</Text>
                        </Pressable>
                    </View>
                )}
            />

            <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.addText}>➕</Text>
            </Pressable>

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
    addBtn: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        backgroundColor: "#3366ff",
        borderRadius: 50,
        padding: 12
    },
    addText: {
        fontSize: 24
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
