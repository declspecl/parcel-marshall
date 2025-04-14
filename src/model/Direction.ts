import { CompassDirection } from "./CompassDirection";

export interface Direction {
    readonly degrees: number;
}

export function getCompassDirection(self: Direction): CompassDirection {
    const { degrees } = self;

    if (degrees < 0 || degrees >= 360) {
        throw new Error("Degrees must be between 0 and 359.");
    }

    if (degrees < 30 || degrees >= 330) {
        return CompassDirection.NORTH;
    }
    if (degrees < 60) {
        return CompassDirection.NORTH_EAST;
    }
    if (degrees < 120) {
        return CompassDirection.EAST;
    }
    if (degrees < 150) {
        return CompassDirection.SOUTH_EAST;
    }
    if (degrees < 210) {
        return CompassDirection.SOUTH;
    }
    if (degrees < 240) {
        return CompassDirection.SOUTH_WEST;
    }
    if (degrees < 300) {
        return CompassDirection.WEST;
    }

    return CompassDirection.NORTH_WEST;
}
