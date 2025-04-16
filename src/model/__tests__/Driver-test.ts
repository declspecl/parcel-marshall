import { Destination, Direction, Location, TravelData } from "../";
import {
    Driver,
    updateLocation,
    addDestination,
    removeDestination,
    updateDirection,
    updateDestinationAddress,
    sortDestinationsByProximity
} from "../Driver";

const newYorkLocation: Location = { latitude: 40.7128, longitude: -74.006, address: "NYC Start" };
const newYork: Destination = { ...newYorkLocation, address: "1 Main St", type: "empty" };

const timesSquareLocation: Location = { latitude: 40.758, longitude: -73.9855, address: "Times Square Dest" };
const timesSquare: Destination = {
    type: "empty",
    address: "3 Broadway",
    latitude: timesSquareLocation.latitude,
    longitude: timesSquareLocation.longitude
};

const chicagoLocation: Location = { latitude: 41.8781, longitude: -87.6298, address: "Chicago Dest" };
const chicago: Destination = {
    type: "empty",
    address: "2 Center St",
    latitude: chicagoLocation.latitude,
    longitude: chicagoLocation.longitude
};

const baseDriver: Driver = {
    currentLocation: newYorkLocation,
    destinations: [],
    direction: { degrees: 0 }
};

describe("Driver Model Functions", () => {
    describe("updateLocation", () => {
        it("should update the driver's current location", () => {
            const driver = updateLocation(baseDriver, newYorkLocation);

            expect(driver.currentLocation).toEqual(newYorkLocation);
            expect(driver.destinations).toEqual(baseDriver.destinations);
            expect(driver.direction).toEqual(baseDriver.direction);
        });
    });

    describe("addDestination", () => {
        it("should add a destination to the destinations list", () => {
            let driver = addDestination(baseDriver, newYork);

            expect(driver.destinations).toHaveLength(1);
            expect(driver.destinations).toContainEqual(newYork);

            driver = addDestination(driver, chicago);

            expect(driver.destinations).toHaveLength(2);
            expect(driver.destinations).toContainEqual(newYork);
            expect(driver.destinations).toContainEqual(chicago);
        });
    });

    describe("removeDestination", () => {
        const driverWithDests = { ...baseDriver, destinations: [newYork, chicago, timesSquare] };

        it("should remove an existing destination by address", () => {
            const updatedDriver = removeDestination(driverWithDests, chicago.address);

            expect(updatedDriver.destinations).toHaveLength(2);
            expect(updatedDriver.destinations).toContainEqual(newYork);
            expect(updatedDriver.destinations).toContainEqual(timesSquare);
            expect(updatedDriver.destinations).not.toContainEqual(chicago);
        });

        it("should throw an error if the destination address is not found", () => {
            expect(() => removeDestination(driverWithDests, "NonExistent St")).toThrow(
                "Destination with address NonExistent St not found."
            );
        });

        it("should throw an error when trying to remove from an empty list", () => {
            expect(() => removeDestination(baseDriver, newYork.address)).toThrow(
                `Destination with address ${newYork.address} not found.`
            );
        });
    });

    describe("updateDirection", () => {
        it("should update the driver's direction", () => {
            const newDirection: Direction = { degrees: 90 };
            const updatedDriver = updateDirection(baseDriver, newDirection);

            expect(updatedDriver.direction).toEqual(newDirection);
            expect(updatedDriver.currentLocation).toEqual(baseDriver.currentLocation);
            expect(updatedDriver.destinations).toEqual(baseDriver.destinations);
        });
    });

    describe("updateDestinationAddress", () => {
        const driverWithDests = { ...baseDriver, destinations: [newYork, chicago] };

        it("should update the details of an existing destination", () => {
            const updatedDriver = updateDestinationAddress(driverWithDests, newYork.address, timesSquare);

            expect(updatedDriver.destinations).toHaveLength(2);

            const updatedDest = updatedDriver.destinations.find((d) => d.address === timesSquare.address);
            const originalDest2 = updatedDriver.destinations.find((d) => d.address === chicago.address);

            expect(updatedDest).toBeDefined();
            expect(updatedDest?.latitude).toEqual(timesSquare.latitude);
            expect(updatedDest?.longitude).toEqual(timesSquare.longitude);
            expect(originalDest2).toEqual(chicago);
        });

        it("should throw an error if the old address is not found", () => {
            expect(() => updateDestinationAddress(driverWithDests, "NonExistent St", timesSquare)).toThrow(
                "Destination with address NonExistent St not found."
            );
        });
    });

    describe("sortDestinationsByProximity", () => {
        const driverInNewYork = {
            ...baseDriver,
            currentLocation: newYorkLocation,
            destinations: [newYork, chicago, timesSquare]
        };

        it("should sort destinations by Haversine distance from current location", () => {
            const sortedDriver = sortDestinationsByProximity(driverInNewYork);

            expect(sortedDriver.destinations.map((d) => d.address)).toEqual([
                newYork.address,
                timesSquare.address,
                chicago.address
            ]);
        });

        it("should handle destinations with pre-calculated travelDistance", () => {
            const farAwayTravelData: TravelData = {
                travelDistance: 100,
                travelDuration: { days: 0, hours: 1, minutes: 0, seconds: 0 },
                travelDirection: { degrees: 90 }
            };
            const destWithDistance: Destination = {
                type: "full",
                address: "Far Away",
                latitude: 0,
                longitude: 0,
                ...farAwayTravelData
            };
            const driverWithMixedDests = {
                ...baseDriver,
                currentLocation: newYorkLocation,
                destinations: [timesSquare, destWithDistance]
            };
            const sortedDriver = sortDestinationsByProximity(driverWithMixedDests);

            expect(sortedDriver.destinations.map((d) => d.address)).toEqual([
                timesSquare.address,
                destWithDistance.address
            ]);
        });

        it("should return an empty array if destinations list is empty", () => {
            const sortedDriver = sortDestinationsByProximity(baseDriver);

            expect(sortedDriver.destinations).toEqual([]);
        });

        it("should return the same array if only one destination exists", () => {
            const driverWithOneDest = { ...baseDriver, destinations: [newYork] };
            const sortedDriver = sortDestinationsByProximity(driverWithOneDest);

            expect(sortedDriver.destinations).toEqual([newYork]);
        });
    });
});
