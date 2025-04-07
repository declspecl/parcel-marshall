import { Location } from "./Location";
import { Direction } from "./Direction";

export class Destination extends Location {
    private travelDuration: number;
    private travelDistance: number;
    private travelDirection: Direction;

    constructor(
        latitude: number,
        longitude: number,
        address: string | null,
        travelDuration: number,
        travelDistance: number,
        travelDirection: Direction
    ) {
        super(latitude, longitude, address);

        this.travelDuration = travelDuration;
        this.travelDistance = travelDistance;
        this.travelDirection = travelDirection;
    }

    public getTravelDuration(): number {
        return this.travelDuration;
    }

    public getTravelDistance(): number {
        return this.travelDistance;
    }

    public getTravelDirection(): Direction {
        return this.travelDirection;
    }

    public setTravelDuration(travelDuration: number): void {
        this.travelDuration = travelDuration;
    }

    public setTravelDistance(travelDistance: number): void {
        this.travelDistance = travelDistance;
    }

    public setTravelDirection(travelDirection: Direction): void {
        this.travelDirection = travelDirection;
    }
}
