//couldnt put this function in GoogleMapsService.ts for some ungodly reason
//so itll live here along with my rage 👿💢
//used to change coords to your city, setting it up in useState so it *should* auto
export async function getCityFromCoords(lat: number, lng: number): Promise<string | null> {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();
        if (!data.results || data.results.length === 0) return null;

        const components = data.results[0].address_components;

        // 🌆 Priority order: city > sublocality > neighborhood
        const cityComponent =
            components.find((comp: any) => comp.types.includes("locality")) ??
            components.find((comp: any) => comp.types.includes("sublocality")) ??
            components.find((comp: any) => comp.types.includes("neighborhood"));
        components.find((comp: any) => comp.types.includes("administrative_area_level_2"));

        return cityComponent?.long_name || null;
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return null;
    }
}
