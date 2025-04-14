import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, Pressable } from "react-native";
import { Destination } from "@/model/Destination";

interface EditAddressModalProps {
    isVisible: boolean;
    destination: Destination | null; // Allow null initially
    onSave: (newAddress: string) => void;
    onClose: () => void;
}

export function EditAddressModal({ isVisible, destination, onSave, onClose }: EditAddressModalProps) {
    const [editedAddress, setEditedAddress] = useState("");

    useEffect(() => {
        if (destination) {
            setEditedAddress(destination.address ?? "");
        }
    }, [destination]);

    const handleSave = () => {
        if (editedAddress.trim()) {
            onSave(editedAddress);
        } else {
            console.warn("Address cannot be empty.");
        }
    };

    if (!destination) {
        return null;
    }

    return (
        <Modal animationType="none" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close-circle" size={24} color="grey" />
                    </Pressable>
                    <Text style={styles.modalTitle}>Edit Address</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEditedAddress}
                        value={editedAddress}
                        placeholder="Enter new address"
                        autoFocus={true}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={onClose} color="#ff5c5c" />
                        <Button title="Save" onPress={handleSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "80%"
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold"
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: "100%",
        borderRadius: 5
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10
    }
});
