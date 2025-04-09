import { Location } from "./Location";
import { Direction } from "./Direction";
import { Destination } from "./Destination";

export class Driver {
    private currentLocation: Location;
    private destinations: Destination[];
    private direction: Direction;

    constructor(currentLocation: Location, destinations: Destination[], direction: Direction) {
        this.currentLocation = currentLocation;
        this.destinations = destinations;
        this.direction = direction;
    }

    public getCurrentLocation(): Location {
        return this.currentLocation;
    }

    public getDestinations(): Destination[] {
        return this.destinations;
    }

    public getDirection(): Direction {
        return this.direction;
    }

    public updateLocation(location: Location): void {
        this.currentLocation = location;
    }

    public addDestination(destination: Destination): void {
        this.destinations.push(destination);
    }

    // TODO: reconsider if this is needed
    public removeDestination(destination: Destination): void {
        // TODO: implement
    }

    public sortDestinationsByProximity(): void {
        // TODO: implement
    }

    public sortDestinationsByFastestRoute(): void {
        // TODO: implement
    }

    public updateDirection(direction: Direction): void {
        this.direction = direction;
    }
}
