import { View, Text, StyleSheet } from "react-native";

export const DarkToast = ({ text1, text2 }: any) => (
    <View style={styles.toast}>
        <Text style={styles.text1}>{text1}</Text>
        <Text style={styles.text2}>{text2}</Text>
    </View>
);

const styles = StyleSheet.create({
    toast: {
        backgroundColor: "#222",
        borderLeftWidth: 6,
        borderLeftColor: "#999",
        borderRadius: 12,
        padding: 16,
        margin: 8
    },
    text1: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff"
    },
    text2: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 4
    }
});
