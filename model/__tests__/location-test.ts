import { Location } from "@/model/location";
import { Direction } from "@/model/direction";

describe("Location", () => {
    it("accurately calculates distance between two locations", () => {
        const location1 = new Location(1, 1, "test");
        const location2 = new Location(2, 2, "test");

        const distance = location1.getDistanceFrom(location2);

        expect(distance).toBe(2);
    });

    it("accurately calculates direction between two locations", () => {
        const location1 = new Location(1, 1, "test");
        const location2 = new Location(2, 2, "test");

        const direction = location1.getDirectionTo(location2);

        // TODO: don't know correct answer
        expect(direction).toBe(new Direction(50));
    });
});
