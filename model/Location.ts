import { Direction } from "./Direction";

export interface Location {
    readonly latitude: number;
    readonly longitude: number;
    readonly address: string | null;
}

export function getUniqueDestinationKey(self: Location): string {
    return `${self.latitude}-${self.longitude}-${self.address || "n/a"}`;
}

export function getDistanceFrom(self: Location, other: Location): number {
    // TODO: implement

    return 0;
}

export function getDirectionTo(self: Location, other: Location): Direction {
    // TODO: implement

    return { degrees: 0 };
}
