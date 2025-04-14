import { Location } from "@/model/Location";
import { Destination } from "@/model/Destination";
import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is not defined in .env");
}

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

export async function getGeocode(address: string): Promise<[string, google.maps.LatLng] | null> {
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

function metresToMiles(metres: number): number {
    return metres / 1609.344;
}

export async function updateDestinations(currLocation: Location, destinations: Location[]): Promise<Destination[]> {
    if (distanceMatrixService === undefined) return [];
    const transformedDestinations: google.maps.LatLngLiteral[] = destinations.map((value) => {
        return {
            lat: value.latitude,
            lng: value.longitude
        };
    });
    const latLngCurrLoc: google.maps.LatLngLiteral = { lat: currLocation.latitude, lng: currLocation.longitude };
    const request = {
        origins: [latLngCurrLoc],
        destinations: transformedDestinations,
        travelMode: google.maps.TravelMode.DRIVING
    };
    console.log(request);
    const matrix = await distanceMatrixService.getDistanceMatrix(request);
    console.log(matrix);
    // Verify that API returns elements in order that it was sent
    const elements = matrix.rows[0].elements;
    const newDestinations: Destination[] = destinations.map((dest, index) => ({
        address: matrix.destinationAddresses[index],
        latitude: dest.latitude,
        longitude: dest.longitude,
        travelDuration: parseFloat(metresToMiles(elements[index].duration.value).toFixed(1)),
        travelDistance: parseFloat(metresToMiles(elements[index].distance.value).toFixed(1)),
        travelDirection: { degrees: 0 }
    }));
    return newDestinations;
}
