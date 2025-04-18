import { Direction, Duration, Location } from "./";

export interface TravelData {
    readonly travelDuration: Duration;
    readonly travelDistance: number;
    readonly travelDirection: Direction;
}

export type EmptyDestination = Location & {
    readonly address: string;
};

//working on cumulative distance
export type FullDestination = Location &
    TravelData & {
        readonly address: string;
        readonly cumulativeDistance?: number;
    };

export type Destination =
    | (EmptyDestination & { readonly type: "empty" })
    | (FullDestination & { readonly type: "full" });

export function setTravelData(self: Destination, travelData: TravelData): FullDestination {
    return { ...self, ...travelData };
}

export function stripTravelData(self: Destination): EmptyDestination {
    return {
        latitude: self.latitude,
        longitude: self.longitude,
        address: self.address
    };
}

export function addCumulativeDistance(destinations: Destination[]): Destination[] {
    let total = 0;

    return destinations.map((dest) => {
        if (dest.type === "full") {
            total += dest.travelDistance;
            return { ...dest, cumulativeDistance: total };
        }

        return dest;
    });
}
