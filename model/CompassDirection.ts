export enum CompassDirection {
    NORTH = "North",
    EAST = "East",
    SOUTH = "South",
    WEST = "West",
    NORTH_EAST = "North East",
    NORTH_WEST = "North West",
    SOUTH_EAST = "South East",
    SOUTH_WEST = "South West"
}

export function getCompassDirectionAbbreviation(self: CompassDirection): string {
    return self
        .split(" ")
        .map((word) => word[0])
        .join();
}
