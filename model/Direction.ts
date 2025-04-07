import { CompassDirection } from "./compass_direction";

export class Direction {
    private degrees: number;

    constructor(degrees: number) {
        this.degrees = degrees;
    }

    public getDegrees(): number {
        return this.degrees;
    }

    public getCompassDirection(): CompassDirection {
        // TODO: implement

        return CompassDirection.NORTH;
    }
}
