export class Location {
    private latitude: number;
    private longitude: number;
    private address: string | null;

    constructor(latitude: number, longitude: number, address: string | null) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    public getLatitude(): number {
        return this.latitude;
    }

    public getLongitude(): number {
        return this.longitude;
    }

    public getAddress(): string | null {
        return this.address;
    }

    public getDistanceFrom(other: Location): number {
        // TODO: implement

        return 0;
    }

    public getDirectionTo(other: Location): string {
        // TODO: implement

        return "";
    }
}
