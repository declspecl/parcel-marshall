import { Location } from "./location";
import { Direction } from "./direction";

export interface Destination extends Location {
    readonly travelDuration: number;
    readonly travelDistance: number;
    readonly travelDirection: Direction;
}

export function setTravelDuration(self: Destination, travelDuration: number): Destination {
    return { ...self, travelDuration };
}

export function setTravelDistance(self: Destination, travelDistance: number): Destination {
    return { ...self, travelDistance };
}

export function setTravelDirection(self: Destination, travelDirection: Direction): Destination {
    return { ...self, travelDirection };
}
