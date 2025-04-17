import { useDriver } from "@/hooks/useDriver";
import { LocationService } from "@/lib/LocationService";
import { updateDestinations } from "@/lib/GoogleMapsService";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
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

    const driverRef = useRef(driver);
    useEffect(() => {
        driverRef.current = driver;
    }, [driver]);

    const routeNameRef = useRef(routeName);
    useEffect(() => {
        routeNameRef.current = routeName;
    }, [routeName]);

    let isCancelled = false;

    const pollLocations = useCallback(async () => {
        const locationService = new LocationService();
        const location = await locationService.getCurrentLocation();
        if (!location) {
            console.error("Error getting location");
            return;
        }

        updateLocation(location);

        if (driverRef.current.destinations.length > 0) {
            const updatedDestinations = await updateDestinations(location, driverRef.current.destinations);
            if (isCancelled) return;

            setDestinations(updatedDestinations);

            if (routeName === routes.index) {
                sortDestinationByProximity();
            } else if (routeName === routes.route) {
                sortDestinationByFastestRoute();
            }
        }
    }, []);

    useEffect(() => {
        pollLocations();

        intervalRef.current = setInterval(pollLocations, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            isCancelled = true;
        };
    }, []);

    const pollNow = useCallback(() => {
        console.log("Polling location now...");
        pollLocations();
    }, [pollLocations]);

    return <LocationPollingContext.Provider value={{ pollNow }}>{children}</LocationPollingContext.Provider>;
}
