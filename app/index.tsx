import { Text, View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Hello, World!</Text>
        </View>
    );
}
