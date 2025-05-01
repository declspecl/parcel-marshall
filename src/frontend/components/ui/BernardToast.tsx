// components/ui/BernardToast.tsx
import React from "react";
import { View, Text } from "react-native";

export const BernardToast = ({ text1, text2 }: any) => {
    return (
        <View
            style={{
                backgroundColor: "#0d2f23",
                borderLeftColor: "#58d68d",
                borderLeftWidth: 6,
                borderRadius: 12,
                padding: 16,
                margin: 8
            }}
        >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#d6ffe7" }}>{text1}</Text>
            <Text style={{ fontSize: 16, color: "#c2ffe0", marginTop: 4 }}>{text2}</Text>
        </View>
    );
};
