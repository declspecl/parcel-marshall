import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, Pressable } from "react-native";
import { Destination } from "@/model/Destination";
import { useThemeSettings } from "@/context/ThemeContext";

interface EditAddressModalProps {
    isVisible: boolean;
    destination: Destination | null; // Allow null initially
    onSave: (newAddress: string) => void;
    onClose: () => void;
}

export function EditAddressModal({ isVisible, destination, onSave, onClose }: EditAddressModalProps) {
    const [editedAddress, setEditedAddress] = useState("");
    const { darkMode, bernardMode } = useThemeSettings();

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
                <View
                    style={[
                        styles.modalView,
                        darkMode && { backgroundColor: "#222" },
                        bernardMode && { backgroundColor: "#1f3d1f" }
                    ]}
                >
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons
                            name="close-circle"
                            size={24}
                            color={bernardMode ? "#baffc9" : darkMode ? "#aaa" : "grey"}
                        />
                    </Pressable>
                    <Text
                        style={[styles.modalTitle, darkMode && { color: "#eee" }, bernardMode && { color: "#baffc9" }]}
                    >
                        Edit Address
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            darkMode && {
                                backgroundColor: "#333",
                                color: "#fff",
                                borderColor: "#555"
                            },
                            bernardMode && {
                                backgroundColor: "#284f28",
                                color: "#d0ffd6",
                                borderColor: "#67b067"
                            }
                        ]}
                        onChangeText={setEditedAddress}
                        value={editedAddress}
                        placeholder="Enter new address"
                        placeholderTextColor={darkMode || bernardMode ? "#aaa" : "#999"}
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
