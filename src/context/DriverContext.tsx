import { RouteName } from "@/lib/Routes";
import { getGeocode } from "@/lib/GoogleMapsService";
import { createContext, useEffect, useReducer } from "react";
import { useNavigationState } from "@react-navigation/native";
import { PersistantStoreService } from "@/store/PersistantStoreService";
import { Driver, Location, Destination, Direction, EmptyDestination, TravelData } from "@/model";
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
    setTravelData: (address: string, travelData: TravelData) => void;
}

export const DriverContext = createContext<DriverContextType | null>(null);

interface DriverCtxProviderProps {
    children: React.ReactNode;
}

export function DriverCtxProvider({ children }: DriverCtxProviderProps) {
    const storeService = new PersistantStoreService();

    const [driverState, driverDispatch] = useReducer<DriverReducerType>(driverStateReducer, {
        currentLocation: { latitude: 0, longitude: 0, address: null },
        destinations:
            storeService.getDestinations()?.map((destination) => ({ ...destination, type: "empty" })) ??
            defaultDestinations,
        direction: { degrees: 50 }
    });

    useEffect(() => {
        storeService.setDestinationsAsync(driverState.destinations).catch((err) => {
            console.error("Error saving destinations: ", err);
        });
    }, [driverState.destinations]);

    function updateLocation(location: Location) {
        driverDispatch({ type: DriverActionTypes.UPDATE_LOCATION, payload: location });
    }
    async function addDestination(address: string) {
        const geocode = await getGeocode(address);
        if (!geocode) throw new Error("Failed to fetch geocode");

        const [formattedAddress, latLong] = geocode;
        const destination: EmptyDestination = {
            latitude: latLong.lat(),
            longitude: latLong.lng(),
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
            latitude: latLong.lat(),
            longitude: latLong.lng(),
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
    function setTravelData(address: string, travelData: TravelData) {
        driverDispatch({ type: DriverActionTypes.SET_TRAVEL_DATA, payload: { address, travelData } });
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
        setDestinations,
        setTravelData
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
