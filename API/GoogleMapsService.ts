/**
 * GoogleMapsService.ts
 *
 * Utility functions for interacting with the Google Maps API,
 * including geocoding and (eventually?) distance matrix lookups.
 *
 * Securely pulls API key from .env via Expo's config system.
 *
 * If you're reading this, I probably know your coordinates.
 * Just kidding. Probably. 🛰️🐱‍👤
 *
 * (Seriously though don’t hardcode the API key. Anton will find you.)
 */

import { Destination } from "@/model/Destination";
import {
    Client,
    GeocodeResponse,
    LatLng,
    LatLngLiteral,
    LatLngLiteralVerbose
} from "@googlemaps/google-maps-services-js";
import Constants from "expo-constants";

//using the key from env file 😈
const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey ?? "";
//returns null if the key is not set
const googleClient = new Client({});

export async function getGeocode(address: string): Promise<[string, LatLngLiteral] | null> {
    const response: GeocodeResponse = await googleClient.geocode({
        params: {
            key: GOOGLE_API_KEY,
            address
        },
        adapter: "xhr",
        withCredentials: false,
        transformRequest: [
            (data, headers) => {
                if (headers) {
                    delete headers["User-Agent"];
                }
                return data;
            }
        ]
    });

    const result = response.data.results[0];
    return result ? [result.formatted_address, result.geometry.location] : null;
}
