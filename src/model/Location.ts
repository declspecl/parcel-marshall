import { Direction } from "./Direction";

export interface Location {
    readonly latitude: number;
    readonly longitude: number;
    readonly address: string | null;
}

export function getUniqueDestinationKey(self: Location): string {
    return `${self.latitude}-${self.longitude}-${self.address || "n/a"}`;
}

// This function calculates the distance between two locations using the Pythagorean theorem.
//using for testing purposes - STIN
//hopefully this will create separate functionality of the update button on each page
//with this working for routes
//will switch this with real destination data later from the API
export function getDistanceFrom(a: Location, b: Location): number {
    const dx = a.latitude - b.latitude;
    const dy = a.longitude - b.longitude;
    return Math.sqrt(dx * dx + dy * dy);
}

export function getDirectionTo(self: Location, other: Location): Direction {
    // TODO: implement

    return { degrees: 0 };
}

export function getFormattedLocation(self: Location): string {
    return `${self.latitude.toFixed(5)}°N, ${self.longitude.toFixed(5)}°E`;
}
