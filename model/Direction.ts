import { CompassDirection } from "./compass_direction";

export interface Direction {
    readonly degrees: number;
}

export function getCompassDirection(self: Direction): CompassDirection {
    // TODO: implement

    return CompassDirection.NORTH;
}
