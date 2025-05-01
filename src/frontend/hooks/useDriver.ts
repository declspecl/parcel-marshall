import { useContext } from "react";
import { DriverContext } from "@/context/DriverContext";

export function useDriver() {
    const context = useContext(DriverContext);
    if (context === null) {
        throw new Error(`useDriver must be used within a DriverContextProvider`);
    }
    return context;
}
