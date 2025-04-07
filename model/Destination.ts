import { Location } from "./Location";

export class Destination extends Location {
    private travelDuration: number;
    private travelDistance: number;
    private travelDirection: string;

    constructor(latitude: number, longitude: number, address: string | null, travelDuration: number, travelDistance: number, travelDirection: string) {
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

    public getTravelDirection(): string {
        return this.travelDirection;
    }

    public setTravelDuration(travelDuration: number): void {
        this.travelDuration = travelDuration;
    }

    public setTravelDistance(travelDistance: number): void {
        this.travelDistance = travelDistance;
    }

    public setTravelDirection(travelDirection: string): void {
        this.travelDirection = travelDirection;
    }
}
