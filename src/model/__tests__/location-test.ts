import { getDistanceFrom, Location } from "@/model/Location";

describe("Location", () => {
    it("can calculate a zero distance for the same location", () => {
        const location: Location = { latitude: 1, longitude: 1, address: "test" };

        const distance = getDistanceFrom(location, location);

        expect(distance).toBe(0);
    });
});
