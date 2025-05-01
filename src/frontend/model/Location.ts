import { Direction } from "./Direction";

export interface Location {
    readonly latitude: number;
    readonly longitude: number;
    readonly address: string | null;
}

export function getUniqueDestinationKey(self: Location): string {
    return `${self.latitude}-${self.longitude}-${self.address || "n/a"}`;
}

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI;
//Changed pythagorean function to haversine formula in order to calculate distance between the two points
export function getHaversineDistance(A: Location, B: Location): number {
    const radius = 6371; //Earth radius in kilometers

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

function locationDegToRad(self: Location): Location {
    return {
        latitude: degreesToRadians(self.latitude),
        longitude: degreesToRadians(self.longitude),
        address: self.address
    };
}

export function getDirectionTo(self: Location, other: Location): Direction {
    const radSelf = locationDegToRad(self);
    const radOther = locationDegToRad(other);
    const deltaLon = radOther.longitude - radSelf.longitude;
    let bearing = Math.atan2(
        Math.sin(deltaLon) * Math.cos(radOther.latitude),
        Math.cos(radSelf.latitude) * Math.sin(radOther.latitude) -
            Math.sin(radSelf.latitude) * Math.cos(radOther.latitude) * Math.cos(deltaLon)
    );
    bearing = radiansToDegrees(bearing);
    bearing = (bearing + 360) % 360;
    return { degrees: bearing };
}

export function getFormattedLocation(self: Location): string {
    const latDir = self.latitude >= 0 ? "N" : "S";
    const lngDir = self.longitude >= 0 ? "E" : "W";
    return `${Math.abs(self.latitude).toFixed(5)}°${latDir}, ${Math.abs(self.longitude).toFixed(5)}°${lngDir}`;
}
