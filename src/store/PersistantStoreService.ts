import { Platform } from "react-native";
import { Destination } from "@/model/Destination";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

export class PersistantStoreService {
    getDestinations(): Destination[] | null {
        const destinations = isWeb ? localStorage.getItem("destinations") : SecureStore.getItem("destinations");

        if (!destinations) {
            return null;
        }

        return JSON.parse(destinations);
    }

    async getDestinationsAsync(): Promise<Destination[] | null> {
        const destinations = isWeb
            ? localStorage.getItem("destinations")
            : await SecureStore.getItemAsync("destinations");

        if (!destinations) {
            return null;
        }

        return JSON.parse(destinations);
    }

    setDestinations(destinations: Destination[]): void {
        if (isWeb) {
            localStorage.setItem("destinations", JSON.stringify(destinations));
        } else {
            SecureStore.setItem("destinations", JSON.stringify(destinations));
        }
    }

    async setDestinationsAsync(destinations: Destination[]): Promise<void> {
        if (isWeb) {
            localStorage.setItem("destinations", JSON.stringify(destinations));
        } else {
            await SecureStore.setItemAsync("destinations", JSON.stringify(destinations));
        }
    }
}
