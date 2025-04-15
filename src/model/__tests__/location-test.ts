import { getHaversineDistance, Location } from "@/model/Location";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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
});
