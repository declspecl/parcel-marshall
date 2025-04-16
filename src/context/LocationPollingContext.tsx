import { useDriver } from "@/hooks/useDriver";
import { LocationService } from "@/lib/LocationService";
import { updateDestinations } from "@/lib/GoogleMapsService";
import { createContext, useCallback, useEffect, useRef, useContext, useState } from "react";
import { useNavigationState } from "@react-navigation/native";
import { routes } from "@/lib/Routes";

type LocationPollingContextType = {
    pollNow: () => void;
};

export const LocationPollingContext = createContext<LocationPollingContextType | null>(null);

interface LocationPollingContextProviderProps {
    children: React.ReactNode;
}

export function LocationPollingContextProvider({ children }: LocationPollingContextProviderProps) {
    const { driver, updateLocation, setDestinations, sortDestinationByProximity, sortDestinationByFastestRoute } =
        useDriver();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const routeName = useNavigationState((state) => state.routes[state.index]?.name);

    const pollLocations = useCallback(async () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(pollLocations, 5000);

        const locationService = new LocationService();
        const location = await locationService.getCurrentLocation();
        if (!location) {
            console.error("Error getting location");
            return;
        }

        updateLocation(location);

        if (driver.destinations.length > 0) {
            const updatedDestinations = await updateDestinations(location, driver.destinations);
            setDestinations(updatedDestinations);

            if (routeName === routes.index) {
                sortDestinationByProximity();
            } else if (routeName === routes.route) {
                sortDestinationByFastestRoute();
            }
        }
    }, [driver.destinations, setDestinations, updateLocation]);

    useEffect(() => {
        pollLocations();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [pollLocations]);

    const pollNow = useCallback(() => {
        console.log("Polling location now...");
        pollLocations();
    }, [pollLocations]);

    return <LocationPollingContext.Provider value={{ pollNow }}>{children}</LocationPollingContext.Provider>;
}
