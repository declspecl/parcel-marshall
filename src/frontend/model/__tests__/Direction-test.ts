import { CompassDirection } from "@/model/CompassDirection";
import { Direction, getCompassDirection } from "@/model/Direction";

describe("Direction", () => {
    it("should throw an error for invalid degrees", () => {
        expect(() => getCompassDirection({ degrees: -1 })).toThrow("Degrees must be between 0 and 359.");
        expect(() => getCompassDirection({ degrees: 360 })).toThrow("Degrees must be between 0 and 359.");
    });

    it("should return the correct compass directions", () => {
        const degreesToTest: Array<[number, CompassDirection]> = [
            [0, CompassDirection.NORTH],
            [15, CompassDirection.NORTH],
            [45, CompassDirection.NORTH_EAST],
            [90, CompassDirection.EAST],
            [135, CompassDirection.SOUTH_EAST],
            [180, CompassDirection.SOUTH],
            [225, CompassDirection.SOUTH_WEST],
            [270, CompassDirection.WEST],
            [315, CompassDirection.NORTH_WEST],
            [330, CompassDirection.NORTH]
        ];
        degreesToTest.forEach(([degrees, expectedDirection]) => {
            const direction: Direction = { degrees };
            expect(getCompassDirection(direction)).toBe(expectedDirection);
        });
    });

    it("should return the correct degrees", () => {
        const direction: Direction = { degrees: 90 };
        expect(direction.degrees).toBe(90);
    });
});
