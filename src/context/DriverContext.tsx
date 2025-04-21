import { RouteName } from "@/lib/Routes";
import { getGeocode } from "@/lib/GoogleMapsService";
import { LocationService } from "@/lib/LocationService";
import { createContext, useEffect, useReducer } from "react";
import { useNavigationState } from "@react-navigation/native";
import { PersistantStoreService } from "@/store/PersistantStoreService";
import { Driver, Location, Destination, Direction, EmptyDestination } from "@/model";
import { DriverActionTypes, DriverReducerType, driverStateReducer } from "@/state/DriverStateReducer";

export interface DriverContextType {
    driver: Driver;
    updateLocation: (location: Location) => void;
    addDestination: (address: string) => Promise<void>;
    removeDestination: (address: string) => void;
    updateDestinationAddress: (oldAddress: string, newAddress: string) => void;
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
        const pollLocations = async () => {
            const location = await locationService.getCurrentLocation();
            if (location) {
                updateLocation(location);
                // broken because not including driverState in the dependencies list
                // setDestinations(await updateDestinations(driverState.currentLocation, driverState.destinations));
            }
        };

        pollLocations();
        const interval = setInterval(() => {
            pollLocations();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    function updateLocation(location: Location) {
        driverDispatch({ type: DriverActionTypes.UPDATE_LOCATION, payload: location });
    }
    async function addDestination(address: string) {
        const geocode = await getGeocode(address);
        if (!geocode) throw new Error("Failed to fetch geocode");

        const [formattedAddress, latLong] = geocode;

        if (driverState.destinations.some((dest) => dest.address === formattedAddress)) {
            throw new Error("Destination already exists");
        }

        const destination: EmptyDestination = {
            latitude: latLong.latitude,
            longitude: latLong.longitude,
            address: formattedAddress
        };

        driverDispatch({ type: DriverActionTypes.ADD_DESTINATION, payload: destination });
    }
    function removeDestination(address: string) {
        driverDispatch({ type: DriverActionTypes.REMOVE_DESTINATION, payload: { address } });
    }
    async function updateDestinationAddress(oldAddress: string, newAddress: string) {
        const geocode = await getGeocode(newAddress);
        if (!geocode) throw new Error("Failed to fetch geocode");

        const [formattedAddress, latLong] = geocode;
        const destination: EmptyDestination = {
            latitude: latLong.latitude,
            longitude: latLong.longitude,
            address: formattedAddress
        };

        driverDispatch({
            type: DriverActionTypes.UPDATE_DESTINATION,
            payload: { oldAddress, updatedData: destination }
        });
    }
    function sortDestinationByProximity() {
        driverDispatch({ type: DriverActionTypes.SORT_DEST_BY_PROXIMITY });
    }
    function sortDestinationByFastestRoute() {
        driverDispatch({ type: DriverActionTypes.SORT_DEST_BY_FASTEST_ROUTE });
    }
    function updateDirection(direction: Direction) {
        driverDispatch({ type: DriverActionTypes.UPDATE_DIRECTION_ADDRESS, payload: direction });
    }
    function setDestinations(destinations: Destination[]) {
        driverDispatch({ type: DriverActionTypes.SET_DESTINATIONS, payload: destinations });
    }

    const ctxValue: DriverContextType = {
        driver: driverState,
        updateLocation,
        addDestination,
        removeDestination,
        updateDestinationAddress,
        sortDestinationByProximity,
        sortDestinationByFastestRoute,
        updateDirection,
        setDestinations
    };

    return <DriverContext.Provider value={ctxValue}>{children}</DriverContext.Provider>;
}

const defaultDestinations: Destination[] = [
    {
        type: "empty",
        latitude: 42.6377478,
        longitude: -83.2199907,
        address: "202 N Squirrel Rd, Auburn Hills, MI 48326, USA"
    },
    {
        type: "empty",
        address: "4170 Pontiac Lake Rd, Waterford Twp, MI 48328, USA",
        latitude: 42.6552567,
        longitude: -83.3695752
    },
    {
        type: "empty",
        address: "2645 Woodward Ave, Detroit, MI 48201, USA",
        latitude: 42.3415519,
        longitude: -83.0543162
    },
    {
        type: "empty",
        address: "150 W Jefferson Ave, Detroit, MI 48226, USA",
        latitude: 42.32824919999999,
        longitude: -83.04648279999999
    }
];
