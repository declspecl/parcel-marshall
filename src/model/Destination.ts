import { Direction, Duration, Location } from "./";

export interface TravelData {
    readonly travelDuration: Duration;
    readonly travelDistance: number;
    readonly travelDirection: Direction;
}

export type EmptyDestination = Location & {
    readonly address: string;
};

export type FullDestination = Location &
    TravelData & {
        readonly address: string;
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
