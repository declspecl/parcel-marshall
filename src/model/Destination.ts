import { Location } from "./Location";
import { Direction } from "./Direction";
import { Duration } from "./Duration";

export interface Destination extends Location {
    readonly travelDuration: Duration;
    readonly travelDistance: number;
    readonly travelDirection: Direction;
    readonly address: string;
}

export function setTravelDuration(self: Destination, travelDuration: Duration): Destination {
    return { ...self, travelDuration };
}

export function setTravelDistance(self: Destination, travelDistance: number): Destination {
    return { ...self, travelDistance };
}

export function setTravelDirection(self: Destination, travelDirection: Direction): Destination {
    return { ...self, travelDirection };
}
