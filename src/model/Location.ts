import { Direction } from "./Direction";

export interface Location {
    readonly latitude: number;
    readonly longitude: number;
    readonly address: string | null;
}

export function getUniqueDestinationKey(self: Location): string {
    return `${self.latitude}-${self.longitude}-${self.address || "n/a"}`;
}

//Changed pythagorean function to haversine formula in order to calculate distance between the two points
export function getHaversineDistance(A: Location, B: Location): number {
    const radius = 6371; //Earth radius in kilometers

    const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const lat1 = A.latitude;
    const lat2 = B.latitude;
    const lon1 = A.longitude;
    const lon2 = B.longitude;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = radius * c;

    return distance;
}

export function getDirectionTo(self: Location, other: Location): Direction {
    // TODO: implement

    return { degrees: 0 };
}

export function getFormattedLocation(self: Location): string {
    return `${self.latitude.toFixed(5)}°N, ${self.longitude.toFixed(5)}°E`;
}
