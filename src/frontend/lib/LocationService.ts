import { Location } from "@/model/Location";
import * as ExpoLocation from "expo-location";

export class LocationService {
    async requestPermissions(): Promise<boolean> {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        return status === "granted";
    }

    async getCurrentLocation(): Promise<Location | null> {
        let { status } = await ExpoLocation.getForegroundPermissionsAsync();
        if (status !== "granted") {
            const granted = await this.requestPermissions();
            if (!granted) {
                console.warn("Location permission denied.");
                return null;
            }
            status = (await ExpoLocation.getForegroundPermissionsAsync()).status;
            if (status !== "granted") {
                console.warn("Location permission still denied after request.");
                return null;
            }
        }

        try {
            const location = await ExpoLocation.getCurrentPositionAsync({});
            const modelLocation: Location = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                address: null
            };
            return modelLocation;
        } catch (error) {
            console.error("Error getting current location:", error);
            return null;
        }
    }
}
