import { Location } from "./Location";
import { Direction } from "./Direction";
import { Destination } from "./Destination";

export interface Driver {
    readonly currentLocation: Location;
    readonly destinations: Destination[];
    readonly direction: Direction;
    readonly getCurrentLocation: () => Location;
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

export function sortDestinationsByProximity(self: Driver): Driver {
    // TODO implment
    return self;
}

export function sortDestinationsByFastestRoute(self: Driver): Driver {
    return self;
}

export function updateDirection(self: Driver, direction: Direction): Driver {
    return { ...self, direction };
}
