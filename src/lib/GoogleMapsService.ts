const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is not defined in .env");
}

type Geocode = [string, { lat: number; lng: number }];

/**
 * Fetches geolocation data for a given address using the Google Maps Geocoding API.
 * Returns null if no results or API error.
 */
export async function getGeocode(address: string): Promise<Geocode | null> {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Missing Google Maps API key.");
        return null;
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${GOOGLE_MAPS_API_KEY}`
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
