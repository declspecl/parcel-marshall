import { getDirectionTo, Location } from "@/model/Location";
import { Destination } from "@/model/Destination";
import { secondsToDuration } from "@/model/Duration";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is not defined in .env");
}

console.log("Google API key", GOOGLE_MAPS_API_KEY);

const GEOCODE_URL = (address: string) =>
    `https://maps.googleapis.com/maps/api/geocode/json?` +
    `address=${encodeURIComponent(address)}` +
    `&key=${GOOGLE_MAPS_API_KEY}`;

export async function getGeocode(address: string) {
    const res = await fetch(GEOCODE_URL(address));
    if (!res.ok) throw new Error(`Geocode HTTP error ${res.status}`);
    const json = await res.json();
    if (json.status !== "OK" || !json.results.length) return null;
    const result = json.results[0];
    return [
        result.formatted_address as string,
        {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng
        }
    ] as [string, { latitude: number; longitude: number }];
}

function metresToMiles(metres: number): number {
    return metres / 1609.344;
}

function locationToLatLngLiteral(location: Location): google.maps.LatLngLiteral {
    return { lat: location.latitude, lng: location.longitude };
}

function buildDistanceMatrixUrl(
    origin: { latitude: number; longitude: number },
    destinations: { latitude: number; longitude: number }[]
) {
    const originsParam = `${origin.latitude},${origin.longitude}`;
    const destParam = destinations.map((d) => `${d.latitude},${d.longitude}`).join("|");
    return (
        `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${originsParam}` +
        `&destinations=${destParam}` +
        `&mode=driving` +
        `&units=imperial` +
        `&key=${GOOGLE_MAPS_API_KEY}`
    );
}

export async function updateDestinations(currLocation: Location, destinations: Destination[]): Promise<Destination[]> {
    const url = buildDistanceMatrixUrl(currLocation, destinations);
    const res = await fetch(url);
    if (!res.ok) {
        console.warn("Distance Matrix HTTP error", res.status);
        return destinations;
    }
    const data = await res.json();
    if (data.status !== "OK") {
        console.warn("Distance Matrix API error", data.status);
        return destinations;
    }

    const row = data.rows[0];
    return destinations.map((dest, i) => {
        const elem = row.elements[i];
        if (elem.status !== "OK") return dest;
        return {
            ...dest,
            type: "full",
            address: data.destination_addresses[i],
            travelDuration: secondsToDuration(elem.duration.value),
            travelDistance: parseFloat((elem.distance.value / 1609.344).toFixed(1)),
            travelDirection: getDirectionTo(currLocation, dest)
        };
    });
}
