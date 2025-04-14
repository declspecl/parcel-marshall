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

//okay I am trying a fetch request to the Google Maps API
//I am reading that this is an okay fix for EXPO before using a backend
//Moving forward, a backend will have better security as the API key will be hidden completely
import Constants from "expo-constants";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey ?? "";

/**
 * Fetches geolocation data for a given address using the Google Maps Geocoding API.
 * Returns null if no results or API error.
 */
export async function getGeocode(address: string): Promise<[string, { lat: number; lng: number }] | null> {
    if (!GOOGLE_API_KEY) {
        console.warn("Missing Google Maps API key.");
        return null;
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();

        if (data.status !== "OK" || !data.results?.length) {
            console.warn("Geocoding failed:", data.status);
            return null;
        }

        const result = data.results[0];
        return [result.formatted_address, result.geometry.location];
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}
