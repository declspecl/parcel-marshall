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
    setDestinations: (destinations: Destination[]) => void;
}

export const DriverContext = createContext<DriverContextType | null>(null);

interface DriverCtxProviderProps {
    children: React.ReactNode;
}

export function DriverCtxProvider({ children }: DriverCtxProviderProps) {
    const storeService = new PersistantStoreService();
    const routeName = useNavigationState((state) => state.routes[state.index]?.name);

    const [driverState, driverDispatch] = useReducer<DriverReducerType>(driverStateReducer, {
        currentLocation: { latitude: 42.67116, longitude: -83.21659, address: null },
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
                latitude: latLng.lat(),
                longitude: latLng.lng(),
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
                latitude: latLng.lat(),
                longitude: latLng.lng(),
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
    function setDestinations(destinations: Destination[]) {
        driverDispatch({ type: DriverActionTypes.SET_DESTINATIONS, payload: destinations });
    }

    const ctxValue: DriverContextType = {
        driver: driverState,
        updateLocation,
        addDestination,
        removeDestination,
        updateDestination,
        sortDestinationByProximity,
        sortDestinationByFastestRoute,
        updateDirection,
        setDestinations
    };

    return <DriverContext.Provider value={ctxValue}>{children}</DriverContext.Provider>;
}

const defaultDestinations: Destination[] = [
    {
        latitude: 42.6377478,
        longitude: -83.2199907,
        address: "202 N Squirrel Rd, Auburn Hills, MI 48326, USA",
        travelDuration: 0,
        travelDistance: 0,
        travelDirection: { degrees: 0 }
    },
    {
        address: "4170 Pontiac Lake Rd, Waterford Twp, MI 48328, USA",
        latitude: 42.6552567,
        longitude: -83.3695752,
        travelDuration: 0,
        travelDistance: 0,
        travelDirection: { degrees: 0 }
    },
    {
        address: "2645 Woodward Ave, Detroit, MI 48201, USA",
        latitude: 42.3415519,
        longitude: -83.0543162,
        travelDuration: 0,
        travelDistance: 0,
        travelDirection: { degrees: 0 }
    },
    {
        address: "150 W Jefferson Ave, Detroit, MI 48226, USA",
        latitude: 42.32824919999999,
        longitude: -83.04648279999999,
        travelDuration: 0,
        travelDistance: 0,
        travelDirection: { degrees: 0 }
    }
];
