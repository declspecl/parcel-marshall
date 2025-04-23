import { Direction } from "./Direction";
import { Destination, addCumulativeDistance } from "./Destination";
import { getHaversineDistance, Location } from "./Location";

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

export function removeDestination(self: Driver, destinationAddress: string): Driver {
    const destinationToRemove = self.destinations.find((destination) => destination.address === destinationAddress);
    if (!destinationToRemove) {
        throw new Error(`Destination with address ${destinationAddress} not found.`);
    }

    return {
        ...self,
        destinations: self.destinations.filter((destination) => destination.address !== destinationAddress)
    };
}

export function updateDirection(self: Driver, direction: Direction): Driver {
    return { ...self, direction };
}

export function updateDestinationAddress(self: Driver, oldAddress: string, newDestination: Destination): Driver {
    const destinationToUpdate = self.destinations.find((destination) => destination.address === oldAddress);
    if (!destinationToUpdate) {
        throw new Error(`Destination with address ${oldAddress} not found.`);
    }

    const updatedDestinations = self.destinations.map((destination) =>
        destination.address === oldAddress ? { ...destination, ...newDestination } : destination
    );

    return {
        ...self,
        destinations: updatedDestinations
    };
}

export function sortDestinationsByProximity(self: Driver): Driver {
    const newDestinations = [...self.destinations].sort((a, b) => {
        const aDistance = a.type === "full" ? a.travelDistance : getHaversineDistance(self.currentLocation, a);
        const bDistance = b.type === "full" ? b.travelDistance : getHaversineDistance(self.currentLocation, b);

        return aDistance - bDistance;
    });

    return { ...self, destinations: newDestinations };
}

export function getFastestRoute(currentLocation: Location, destinations: Destination[]): Destination[] {
    const remaining = [...destinations];
    const sorted: Destination[] = [];
    let current = currentLocation;

    while (remaining.length > 0) {
        remaining.sort((a, b) => getHaversineDistance(current, a) - getHaversineDistance(current, b));
        const next = remaining.shift();
        if (next) {
            sorted.push(next);
            current = next;
        }
    }

    return sorted;
}

//heh happy I messed up and kept this nested function
export function sortDestinationsByFastestRoute(self: Driver): Driver {
    const sorted = getFastestRoute(self.currentLocation, self.destinations);
    const withCumulative = addCumulativeDistance(sorted);

    return { ...self, destinations: withCumulative };
}
