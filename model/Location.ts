import { Direction } from "./direction";

export interface Location {
    readonly latitude: number;
    readonly longitude: number;
    readonly address: string | null;
}

export function getDistanceFrom(self: Location, other: Location): number {
    // TODO: implement

    return 0;
}

export function getDirectionTo(self: Location, other: Location): Direction {
    // TODO: implement

    return { degrees: 0 };
}
