import { RouteName } from "@/lib/Routes";
import { LocationService } from "@/lib/LocationService";
import { createContext, useEffect, useReducer } from "react";
import { useNavigationState } from "@react-navigation/native";
import { Driver, Location, Destination, Direction } from "@/model";
import { PersistantStoreService } from "@/store/PersistantStoreService";
import { DriverActionTypes, DriverReducerType, driverStateReducer } from "@/state/DriverStateReducer";
import { getGeocode } from "@/lib/GoogleMapsService";

export interface DriverContextType {
    driver: Driver;
    updateLocation: (location: Location) => void;
    addDestination: (destination: Destination) => void;
    removeDestination: (destination: Destination) => void;
    updateDestination: (
        originalDestination: Destination,
        updatedData: Omit<Destination, "latitude" | "longitude"> & Partial<Destination>
    ) => void;
    sortDestinationByProximity: () => void;
    sortDestinationByFastestRoute: () => void;
    updateDirection: (direction: Direction) => void;
}

export const DriverContext = createContext<DriverContextType | null>(null);

interface DriverCtxProviderProps {
    children: React.ReactNode;
}

export function DriverCtxProvider({ children }: DriverCtxProviderProps) {
    const storeService = new PersistantStoreService();
    const routeName = useNavigationState((state) => state.routes[state.index]?.name);

    const [driverState, driverDispatch] = useReducer<DriverReducerType>(driverStateReducer, {
        currentLocation: { latitude: 0, longitude: 0, address: null },
        destinations: storeService.getDestinations() ?? defaultDestinations,
        direction: { degrees: 50 }
    });

    useEffect(() => {
        switch (routeName) {
            case RouteName.Index:
                break;
            case RouteName.Route:
                break;
            case RouteName.Settings:
                break;
            default:
                console.log(`DriverCtxProvider: Unknown route name: ${routeName}`);
        }
    }, [routeName]);

    useEffect(() => {
        storeService.setDestinationsAsync(driverState.destinations).catch((err) => {
            console.error("Error saving destinations: ", err);
        });
    }, [driverState.destinations]);

    useEffect(() => {
        const locationService = new LocationService();
        const getLocation = async () => {
            const location = await locationService.getCurrentLocation();
            if (location) {
                updateLocation(location);
            }
        };

        getLocation();
        const interval = setInterval(() => {
            getLocation();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    function updateLocation(location: Location) {
        driverDispatch({ type: DriverActionTypes.UPDATE_LOCATION, payload: location });
    }
    function addDestination(destination: Omit<Destination, "latitude" | "longitude"> & Partial<Destination>) {
        getGeocode(destination.address!).then((res) => {
            if (!res) return;

            const [formatted_address, latLng] = res;

            const newDestination: Destination = {
                ...destination,
                latitude: latLng.lat,
                longitude: latLng.lng,
                address: formatted_address
            };

            driverDispatch({ type: DriverActionTypes.ADD_DESTINATION, payload: newDestination });
        });
    }
    function removeDestination(destination: Destination) {
        driverDispatch({ type: DriverActionTypes.REMOVE_DESTINATION, payload: destination });
    }
    function updateDestination(
        originalDestination: Destination,
        updatedData: Omit<Destination, "latitude" | "longitude"> & Partial<Destination>
    ) {
        getGeocode(updatedData.address!).then((res) => {
            if (!res) return;

            const [formatted_address, latLng] = res;

            const newDestination: Destination = {
                ...updatedData,
                latitude: latLng.lat,
                longitude: latLng.lng,
                address: formatted_address
            };

            driverDispatch({
                type: DriverActionTypes.UPDATE_DESTINATION,
                payload: { originalDestination, updatedData }
            });
        });
    }
    function sortDestinationByProximity() {
        driverDispatch({ type: DriverActionTypes.SORT_DEST_BY_PROXIMITY });
    }
    function sortDestinationByFastestRoute() {
        driverDispatch({ type: DriverActionTypes.SORT_DEST_BY_FASTEST_ROUTE });
    }
    function updateDirection(direction: Direction) {
        driverDispatch({ type: DriverActionTypes.UPDATE_DIRECTION, payload: direction });
    }

    const ctxValue: DriverContextType = {
        driver: driverState,
        updateLocation,
        addDestination,
        removeDestination,
        updateDestination,
        sortDestinationByProximity,
        sortDestinationByFastestRoute,
        updateDirection
    };

    return <DriverContext.Provider value={ctxValue}>{children}</DriverContext.Provider>;
}

const defaultDestinations: Destination[] = [
    {
        latitude: 4.7,
        longitude: 5.7,
        travelDuration: 60,
        address: "318 Meadow Brook Rd, Rochester, MI 48309",
        travelDistance: 60,
        travelDirection: { degrees: 180 }
    },
    {
        latitude: 5.1,
        longitude: 5.1,
        travelDuration: 20,
        address: "Anton’s Discrete Math Asylum, UA 01001",
        travelDistance: 10,
        travelDirection: { degrees: 90 }
    },
    {
        latitude: 3.2,
        longitude: 6.2,
        travelDuration: 40,
        address: "Bernard's Cool Car, Rochester, MI 48309",
        travelDistance: 30,
        travelDirection: { degrees: 270 }
    },
    {
        latitude: 4.1,
        longitude: 4.1,
        travelDuration: 50,
        address: "Gavin's Rust Hideout, Rochester, MI 48309",
        travelDistance: 70,
        travelDirection: { degrees: 45 }
    },
    {
        address: "A",
        latitude: 5,
        longitude: 5,
        travelDistance: 50,
        travelDuration: 10,
        travelDirection: { degrees: 0 }
    },
    {
        address: "B",
        latitude: 6,
        longitude: 5,
        travelDistance: 30,
        travelDuration: 10,
        travelDirection: { degrees: 0 }
    },
    {
        address: "C",
        latitude: 7,
        longitude: 5,
        travelDistance: 10,
        travelDuration: 10,
        travelDirection: { degrees: 0 }
    }
];
