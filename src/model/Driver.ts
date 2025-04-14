import { getDistanceFrom, getUniqueDestinationKey, Location } from "./Location";
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
    if (index > -1) {
        // Only splice if found
        newDestinations.splice(index, 1);
    } else {
        console.warn("removeDestination: Destination not found.");
    }
    return { ...self, destinations: newDestinations };
}

export function updateDirection(self: Driver, direction: Direction): Driver {
    return { ...self, direction };
}

export function updateDestination(
    self: Driver,
    originalDestination: Destination,
    updatedDestinationData: Partial<Destination>
): Driver {
    const index = self.destinations.findIndex(
        (d) => getUniqueDestinationKey(d) === getUniqueDestinationKey(originalDestination)
    );

    if (index === -1) {
        console.warn("updateDestination: Original destination not found, returning original state.");
        return self;
    }

    const finalDestinations = [...self.destinations];
    finalDestinations[index] = { ...finalDestinations[index], ...updatedDestinationData };

    return { ...self, destinations: finalDestinations };
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

//function to not affect global state

export function getFastestRoute(currentLocation: Location, destinations: Destination[]): Destination[] {
    const remaining = [...destinations];
    const sorted: Destination[] = [];
    let current = currentLocation;

    while (remaining.length > 0) {
        remaining.sort((a, b) => getDistanceFrom(current, a) - getDistanceFrom(current, b));
        const next = remaining.shift();
        if (next) {
            sorted.push(next);
            current = next;
        }
    }

    return sorted;
}

/*trying this as well - STIN

Start from your currentLocation.

Find the closest destination.

Move there, then repeat — from that location.

Keep building the list until all destinations are used.

this is my idea to represent routes as home page just grabs closest location
they are pretty similar right now as updating the location would make home update button do the same thing
but this route update button is calculating the fastest route before you complete any destinations
this will most likely work more as intended with API data
*/

export function sortDestinationsByFastestRoute(self: Driver): Driver {
    const sorted = getFastestRoute(self.currentLocation, self.destinations);
    return { ...self, destinations: sorted };
}
