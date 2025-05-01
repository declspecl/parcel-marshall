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

    getTheme(): { darkMode: boolean; bernardMode: boolean } | null {
        const theme = isWeb ? localStorage.getItem("theme") : SecureStore.getItem("theme");
        if (!theme) {
            return null;
        }
        return JSON.parse(theme);
    }

    async getThemeAsync(): Promise<{ darkMode: boolean; bernardMode: boolean } | null> {
        const theme = isWeb ? localStorage.getItem("theme") : await SecureStore.getItemAsync("theme");
        if (!theme) {
            return null;
        }
        return JSON.parse(theme);
    }

    setTheme(theme: { darkMode: boolean; bernardMode: boolean }): void {
        if (isWeb) {
            localStorage.setItem("theme", JSON.stringify(theme));
        } else {
            SecureStore.setItem("theme", JSON.stringify(theme));
        }
    }

    async setThemeAsync(theme: { darkMode: boolean; bernardMode: boolean }): Promise<void> {
        if (isWeb) {
            localStorage.setItem("theme", JSON.stringify(theme));
        } else {
            await SecureStore.setItemAsync("theme", JSON.stringify(theme));
        }
    }
}
