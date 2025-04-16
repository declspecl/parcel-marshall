import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Destination, EmptyDestination } from "@/model/Destination";

const isWeb = Platform.OS === "web";

export class PersistantStoreService {
    getDestinations(): EmptyDestination[] | null {
        const destinations = isWeb ? localStorage.getItem("destinations") : SecureStore.getItem("destinations");

        if (!destinations) {
            return null;
        }

        return JSON.parse(destinations);
    }

    async getDestinationsAsync(): Promise<EmptyDestination[] | null> {
        const destinations = isWeb
            ? localStorage.getItem("destinations")
            : await SecureStore.getItemAsync("destinations");

        if (!destinations) {
            return null;
        }

        return JSON.parse(destinations);
    }

    setDestinations(destinations: Destination[]): void {
        const emptyDestinations: EmptyDestination[] = destinations.map((destination) => ({
            address: destination.address,
            latitude: destination.latitude,
            longitude: destination.longitude
        }));

        if (isWeb) {
            localStorage.setItem("destinations", JSON.stringify(emptyDestinations));
        } else {
            SecureStore.setItem("destinations", JSON.stringify(emptyDestinations));
        }
    }

    async setDestinationsAsync(destinations: EmptyDestination[]): Promise<void> {
        const emptyDestinations: EmptyDestination[] = destinations.map((destination) => ({
            address: destination.address,
            latitude: destination.latitude,
            longitude: destination.longitude
        }));

        if (isWeb) {
            localStorage.setItem("destinations", JSON.stringify(emptyDestinations));
        } else {
            await SecureStore.setItemAsync("destinations", JSON.stringify(emptyDestinations));
        }
    }
}
