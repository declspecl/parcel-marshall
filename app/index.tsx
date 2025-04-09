import { Direction } from "@/model/Direction";
import { useDriver } from "@/store/DriverContext";
import { Text, View, StyleSheet, Button } from "react-native";

const styles = StyleSheet.create({});

export default function Index() {
    const { driver, updateDirection } = useDriver();

    return (
        <View>
            <Text>Home page</Text>
            <Text>{driver.direction.degrees}</Text>
            <Button title="change" onPress={() => updateDirection({ degrees: 100 })} />
        </View>
    );
}
