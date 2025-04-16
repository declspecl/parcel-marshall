import { useContext } from "react";
import { LocationPollingContext } from "@/context/LocationPollingContext";

export const useLocationPolling = () => {
    const context = useContext(LocationPollingContext);
    if (!context) {
        throw new Error("useLocationPolling must be used within a LocationPollingContextProvider");
    }

    return context;
};
