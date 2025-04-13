import { getDistanceFrom, Location } from "./Location";
import { Direction } from "./Direction";
import { Destination } from "./Destination";

export interface Driver {
    readonly currentLocation: Location;
    readonly destinations: Destination[];
    readonly direction: Direction;
}

export function updateLocation(self: Driver, currentLocation: Location): Driver {
    return { ...self, currentLocation };
}

export function addDestination(self: Driver, destination: Destination): Driver {
    const newDestinations = [...self.destinations, destination];
    return { ...self, destinations: newDestinations };
}

export function removeDestination(self: Driver, destination: Destination): Driver {
    const newDestinations = [...self.destinations];
    const index = newDestinations.indexOf(destination);
    newDestinations.splice(index, 1);
    return { ...self, destinations: newDestinations };
}

//adding code for testing purposes -STIN
export function sortDestinationsByProximity(self: Driver): Driver {
    const newDestinations = [...self.destinations].sort(
        (a, b) => a.travelDistance - b.travelDistance
        // A is closer than B than result is negative -> A comes first
        // A is further than B than result is positive -> B comes first
        // A and B are equal than result is 0 -> no change in order
    );
    return { ...self, destinations: newDestinations };
    //will return a new driver object with the sorted destinations
}

export function sortDestinationsByFastestRoute(self: Driver): Driver {
    // TODO implement
    return self;
}

export function updateDirection(self: Driver, direction: Direction): Driver {
    return { ...self, direction };
}
