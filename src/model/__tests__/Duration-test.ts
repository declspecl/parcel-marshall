import { Duration, durationToString, secondsToDuration } from "@/model/Duration";

describe("Duration", () => {
    it("should throw an error for negative seconds", () => {
        expect(() => secondsToDuration(-1)).toThrow("Seconds can't be negative");
    });
    it("should convert from seconds to Duration correctly", () => {
        const durationsToTest: Array<[number, Duration]> = [
            [60, { days: 0, hours: 0, minutes: 1, seconds: 0 }],
            [12345, { days: 0, hours: 3, minutes: 25, seconds: 45 }],
            [268127, { days: 3, hours: 2, minutes: 28, seconds: 47 }]
        ];
        durationsToTest.forEach(([sec, dur]) => {
            expect(secondsToDuration(sec)).toStrictEqual(dur);
        });
    });
    it("should convert duration to string correctly", () => {
        const durationsToTest: Array<[Duration, string]> = [
            [{ days: 0, hours: 0, minutes: 0, seconds: 0 }, "0s"],
            [{ days: 0, hours: 0, minutes: 1, seconds: 0 }, "1m"],
            [{ days: 0, hours: 3, minutes: 25, seconds: 45 }, "3h 25m 45s"],
            [{ days: 3, hours: 2, minutes: 28, seconds: 47 }, "3d 2h 28m 47s"]
        ];
        durationsToTest.forEach(([dur, str]) => {
            expect(durationToString(dur)).toBe(str);
        });
    });
});
