export interface Duration {
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
}

const secInMinute = 60;
const secInHour = secInMinute * 60;
const secInDays = secInHour * 24;
export const emptyDuration: Duration = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function secondsToDuration(seconds: number): Duration {
    if (seconds < 0) throw new Error("Seconds can't be negative");
    const days = Math.floor(seconds / secInDays);
    seconds %= secInDays;
    const hours = Math.floor(seconds / secInHour);
    seconds %= secInHour;
    const minutes = Math.floor(seconds / secInMinute);
    seconds %= secInMinute;
    return {
        days,
        hours,
        minutes,
        seconds
    };
}

export function durationToString(duration: Duration): string {
    const parts = [];
    if (duration.days > 0) parts.push(`${duration.days}d`);
    if (duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes > 0) parts.push(`${duration.minutes}m`);
    if (duration.seconds > 0 || parts.length === 0) {
        parts.push(`${duration.seconds}s`);
    }
    return parts.join(" ");
}
