import { Location } from "./Location";
import { Direction } from "./Direction";
import { Destination } from "./Destination";

export interface Driver {
    readonly currentLocation: Location;
    readonly destinations: Destination[];
    readonly direction: Direction;
    readonly getCurrentLocation: () => Location;
}

function updateLocation(self: Driver, currentLocation: Location): Driver {
    return { ...self, currentLocation };
}

function addDestination(self: Driver, destination: Destination): Driver {
    const newDestinations = [...self.destinations, destination];
    return { ...self, destinations: newDestinations };
}

function removeDestination(self: Driver, destination: Destination): Driver {
    const newDestinations = [...self.destinations];
    const index = newDestinations.indexOf(destination);
    newDestinations.splice(index, 1);
    return { ...self, destinations: newDestinations };
}

function sortDestinationsByProximity(self: Driver): Driver {
    // TODO implment
    return self;
}

function sortDestinationsByFastestRoute(self: Driver): Driver {
    return self;
}

function updateDirection(self: Driver, direction: Direction): Driver {
    return { ...self, direction };
}
