import { getDirectionTo, getHaversineDistance, Location } from "@/model/Location";
import { Direction } from "../Direction";

describe("Location", () => {
    it("can calculate a zero distance for the same location", () => {
        const location: Location = { latitude: 1, longitude: 1, address: "test" };

        const distance = getHaversineDistance(location, location);

        expect(distance).toBe(0);
    });

    it("calculates the distance correctly", () => {
        const location: Location = { latitude: 64, longitude: 90, address: "test" };
        const location2: Location = { latitude: 30, longitude: 56, address: "test" };

        const distance = getHaversineDistance(location, location2);

        expect(distance.toFixed(1)).toEqual("4466.7");
    });
    it("can calculate Direction degrees correctly", () => {
        // Current location is Hess-Hathaway Park
        const currLocation: Location = { latitude: 42.62852552843098, longitude: -83.44033282721112, address: null };

        const locationsToTest: Array<[Location, Direction]> = [
            // Oakland Center
            [{ latitude: 42.67437662431578, longitude: -83.21672102765892, address: null }, { degrees: 74.35 }],
            // Amazon office
            [{ latitude: 42.32827296250154, longitude: -83.04649160042362, address: null }, { degrees: 135.82 }]
        ];
        locationsToTest.forEach(([dest, { degrees }]) => {
            expect(getDirectionTo(currLocation, dest).degrees).toBeCloseTo(degrees);
        });
    });
});
