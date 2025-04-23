import { getDirectionTo, Location } from "@/model/Location";
import { Destination } from "@/model/Destination";
import { Loader } from "@googlemaps/js-api-loader";
import { secondsToDuration } from "@/model/Duration";
import { Platform } from "react-native";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is not defined in .env");
}

const DEBUG = false;

const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["routes", "geocoding"]
});

console.log("Google API key", GOOGLE_MAPS_API_KEY);

let distanceMatrixService: google.maps.DistanceMatrixService | undefined;
let geocodingService: google.maps.Geocoder | undefined;

export async function initGoogleMapsAPI() {
    loader.importLibrary("routes").then((value) => (distanceMatrixService = new value.DistanceMatrixService()));
    loader.importLibrary("geocoding").then((value) => (geocodingService = new value.Geocoder()));
}

export async function getGeocodeWithSdk(address: string): Promise<[string, google.maps.LatLng] | null> {
    if (geocodingService == undefined) return null;
    const response = await geocodingService.geocode({
        address
    });
    console.log(response);
    const res = response.results[0];
    if (res) {
        return [res.formatted_address, res.geometry.location];
    } else {
        return null;
    }
}

const GEOCODE_URL = (address: string) =>
    `https://maps.googleapis.com/maps/api/geocode/json?` +
    `address=${encodeURIComponent(address)}` +
    `&key=${GOOGLE_MAPS_API_KEY}`;

export async function getGeocodeWithRestApi(address: string) {
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

interface PlatformAgnosticGeocode {
    formattedAddress: string;
    getLatitude: () => number;
    getLongitude: () => number;
}

export async function getGeocode(address: string): Promise<PlatformAgnosticGeocode | null> {
    const isWeb = Platform.OS === "web";
    if (isWeb) {
        const geocode = await getGeocodeWithSdk(address);
        if (!geocode) return null;

        return {
            formattedAddress: geocode[0],
            getLatitude: () => geocode[1].lat(),
            getLongitude: () => geocode[1].lng()
        };
    } else {
        const geocode = await getGeocodeWithRestApi(address);
        if (!geocode) return null;

        return {
            formattedAddress: geocode[0],
            getLatitude: () => geocode[1].latitude,
            getLongitude: () => geocode[1].longitude
        };
    }
}

function metresToMiles(metres: number): number {
    return metres / 1609.344;
}

function locationToLatLngLiteral(location: Location): google.maps.LatLngLiteral {
    return { lat: location.latitude, lng: location.longitude };
}

//bulk add function to load addresses first then update when needed
//this reduces rate limiting
export async function geocodeAddress(address: string): Promise<Location | null> {
    if (!window.google || !window.google.maps) {
        console.warn("Google Maps API is not loaded.");
        return null;
    }

    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve) => {
        geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results && results.length > 0) {
                const { lat, lng } = results[0].geometry.location;
                resolve({
                    address: results[0].formatted_address,
                    latitude: lat(),
                    longitude: lng()
                });
            } else {
                console.warn(`❌ Geocode failed for: "${address}" — Status: ${status}`);
                resolve(null);
            }
        });
    });
}
//bulk add update to get past 25 limit.
//WIP I dont wanna fight it anymore 👿👿
declare global {
    interface Window {
        __MOCK_ROUTING__?: boolean;
    }
}
export async function chunkAndUpdateDestinations(
    currLocation: Location,
    destinations: Destination[],
    chunkSize = 25
): Promise<Destination[]> {
    const updatedAll: Destination[] = [];
    const validDestinations = destinations.filter((d) => !!d.latitude && !!d.longitude);

    for (let i = 0; i < validDestinations.length; i += chunkSize) {
        const chunk = validDestinations.slice(i, i + chunkSize);
        console.log(`🚚 Processing chunk ${i / chunkSize + 1}: ${chunk.length} destinations`);

        try {
            const updatedChunk = await updateDestinationsWithSdk(currLocation, chunk);
            updatedAll.push(...updatedChunk);
        } catch (error) {
            console.error(`🔥 Failed to update chunk ${i / chunkSize + 1}`, error);
            updatedAll.push(...chunk);
        }

        // Optional: Delay to avoid rate limits
        await new Promise((res) => setTimeout(res, 500));
    }

    return updatedAll;
}
//-------

export async function updateDestinationsWithSdk(
    currLocation: Location,
    destinations: Destination[]
): Promise<Destination[]> {
    if (distanceMatrixService === undefined) return [];
    const transformedDestinations: google.maps.LatLngLiteral[] = destinations.map(locationToLatLngLiteral);
    const latLngCurrLoc: google.maps.LatLngLiteral = locationToLatLngLiteral(currLocation);
    const request = {
        origins: [latLngCurrLoc],
        destinations: transformedDestinations,
        travelMode: google.maps.TravelMode.DRIVING
    };
    try {
        if (DEBUG) console.log(request);
        const matrix = await distanceMatrixService.getDistanceMatrix(request);
        if (DEBUG) console.log(matrix);
        const elements = matrix?.rows?.[0]?.elements || [];
        const newDestinations: Destination[] = destinations.map((dest, index) => {
            const element = elements[index];
            if (element.status != "OK") {
                console.warn(`❌ Unable to route to: ${dest.address} — Status: ${element?.status || "No Element"}`);
                return {
                    ...dest,
                    type: "partial",
                    travelDuration: "0 min",
                    travelDistance: 0,
                    travelDirection: "N/A"
                };
            }
            //work around for addresses we cannot route to

            return {
                type: "full",
                address: matrix.destinationAddresses[index],
                latitude: dest.latitude,
                longitude: dest.longitude,
                travelDuration: secondsToDuration(elements[index].duration.value),
                travelDistance: parseFloat(metresToMiles(elements[index].distance.value).toFixed(1)),
                travelDirection: getDirectionTo(currLocation, dest)
            };
        });
        if (DEBUG) {
            console.log(`✅ Final routed destinations: ${newDestinations.length}`);
            newDestinations.forEach((d, i) => {
                console.log(`#${i + 1}: ${d.address} — ${d.type}`);
            });
        }
        return newDestinations;
    } catch (error) {
        console.log(error);
        return destinations;
    }
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

export async function updateDestinationsWithRestApi(
    currLocation: Location,
    destinations: Destination[]
): Promise<Destination[]> {
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
        if (elem.status !== "OK") {
            console.warn(`❌ Unable to route to: ${dest.address} — Status: ${elem.status}`);
            return {
                ...dest,
                type: "partial",
                travelDuration: "0 min",
                travelDistance: 0,
                travelDirection: "N/A"
            };
        }
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

export async function updateDestinations(currLocation: Location, destinations: Destination[]): Promise<Destination[]> {
    const isWeb = Platform.OS === "web";
    if (isWeb) {
        return updateDestinationsWithSdk(currLocation, destinations);
    } else {
        return updateDestinationsWithRestApi(currLocation, destinations);
    }
}

export function getGoogleMapsDirectionsUrl(addresses: string[]): string {
    // Limit to 20 addresses for Google Maps
    const cappedAddresses = addresses.splice(1, 20);

    const baseUrl = "https://www.google.com/maps/dir/";
    const encodedAddresses = cappedAddresses.map(encodeURIComponent).join("/");
    return baseUrl + encodedAddresses;
}
