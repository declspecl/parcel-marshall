import { RouteName } from "@/lib/Routes";
import { Destination } from "@/model/Destination";
import { Direction } from "@/model/Direction";
import {
    addDestination,
    Driver,
    removeDestination,
    sortDestinationsByFastestRoute,
    sortDestinationsByProximity,
    updateDestination,
    updateDirection,
    updateLocation
} from "@/model/Driver";
import { Location } from "@/model/Location";

import { createContext, useContext, useEffect, useReducer } from "react";
import { PersistantStoreService } from "./PersistantStoreService";

import { useNavigationState } from "@react-navigation/native"; // You had the wrong quotes in original
import { LocationService } from "@/lib/LocationService";

type DriverState = Driver;

interface DriverContextType {
    driver: DriverState;
    updateLocation: (location: Location) => void;
    addDestination: (destination: Destination) => void;
    removeDestination: (destination: Destination) => void;
    updateDestination: (originalDestination: Destination, updatedData: Partial<Destination>) => void; // Added
    sortDestinationByProximity: () => void;
    sortDestinationByFastestRoute: () => void;
    updateDirection: (direction: Direction) => void;
}

const DriverContext = createContext<DriverContextType | null>(null);

enum DriverActionTypes {
    UPDATE_LOCATION = "UPDATE_LOCATION",
    ADD_DESTINATION = "ADD_DESTINATION",
    REMOVE_DESTINATION = "REMOVE_DESTINATION",
    UPDATE_DESTINATION = "UPDATE_DESTINATION", // Added
    SORT_DEST_BY_PROXIMITY = "SORT_DEST_BY_PROXIMITY",
    SORT_DEST_BY_FASTEST_ROUTE = "SORT_DEST_BY_FASTEST_ROUTE",
    UPDATE_DIRECTION = "UPDATE_DIRECTION"
}

// Action Types
type UpdateLocationAction = {
    type: DriverActionTypes.UPDATE_LOCATION;
    payload: Location;
};

type AddDestinationAction = {
    type: DriverActionTypes.ADD_DESTINATION;
    payload: Destination;
};

type RemoveDestinationAction = {
    type: DriverActionTypes.REMOVE_DESTINATION;
    payload: Destination;
};

// Added Action Type
type UpdateDestinationAction = {
    type: DriverActionTypes.UPDATE_DESTINATION;
    payload: {
        originalDestination: Destination;
        updatedData: Partial<Destination>;
    };
};

type SortDestinationByProximityAction = {
    type: DriverActionTypes.SORT_DEST_BY_PROXIMITY;
};

type SortDestinationByFastestRouteAction = {
    type: DriverActionTypes.SORT_DEST_BY_FASTEST_ROUTE;
};

type UpdateDirectionAction = {
    type: DriverActionTypes.UPDATE_DIRECTION;
    payload: Direction;
};

// Union Type including new action
type DriverStateAction =
    | UpdateLocationAction
    | AddDestinationAction
    | RemoveDestinationAction
    | UpdateDestinationAction // Added
    | SortDestinationByProximityAction
    | SortDestinationByFastestRouteAction
    | UpdateDirectionAction;

// Reducer
type DriverReducerType = (prevState: Driver, action: DriverStateAction) => Driver;
const driverStateReducer: DriverReducerType = (state, action) => {
    switch (action.type) {
        case DriverActionTypes.UPDATE_LOCATION: {
            return updateLocation(state, action.payload);
        }
        case DriverActionTypes.ADD_DESTINATION: {
            return addDestination(state, action.payload);
        }
        case DriverActionTypes.REMOVE_DESTINATION: {
            return removeDestination(state, action.payload);
        }
        case DriverActionTypes.UPDATE_DESTINATION: {
            return updateDestination(state, action.payload.originalDestination, action.payload.updatedData);
        }
        case DriverActionTypes.SORT_DEST_BY_PROXIMITY: {
            return sortDestinationsByProximity(state);
        }
        case DriverActionTypes.SORT_DEST_BY_FASTEST_ROUTE: {
            return sortDestinationsByFastestRoute(state);
        }
        case DriverActionTypes.UPDATE_DIRECTION: {
            return updateDirection(state, action.payload);
        }
        default: {
            // Ensure exhaustive check if needed, or just return state
            // const exhaustiveCheck: never = action;
            return state;
        }
    }
};

interface DriverCtxProviderProps {
    children: React.ReactNode;
}

function DriverCtxProvider({ children }: DriverCtxProviderProps) {
    const routeName = useNavigationState((state) => state.routes[state.index]?.name);
    const storeService = new PersistantStoreService();

    const [driverState, driverDispatch] = useReducer<DriverReducerType>(driverStateReducer, {
        currentLocation: { latitude: 0, longitude: 0, address: null },
        destinations: storeService.getDestinations() ?? [
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
        ],
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
    function addDestination(destination: Destination) {
        driverDispatch({ type: DriverActionTypes.ADD_DESTINATION, payload: destination });
    }
    function removeDestination(destination: Destination) {
        driverDispatch({ type: DriverActionTypes.REMOVE_DESTINATION, payload: destination });
    }
    // Added Dispatch Function
    function updateDestination(originalDestination: Destination, updatedData: Partial<Destination>) {
        driverDispatch({
            type: DriverActionTypes.UPDATE_DESTINATION,
            payload: { originalDestination, updatedData }
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

    // Context Value including new function
    const ctxValue: DriverContextType = {
        driver: driverState,
        updateLocation,
        addDestination,
        removeDestination,
        updateDestination, // Added
        sortDestinationByProximity,
        sortDestinationByFastestRoute,
        updateDirection
    };
    return <DriverContext.Provider value={ctxValue}>{children}</DriverContext.Provider>;
}

function useDriver() {
    const context = useContext(DriverContext);
    if (context === null) {
        throw new Error(`useDriver must be used within a ${DriverCtxProvider.name}`);
    }
    return context;
}

export { DriverCtxProvider, useDriver };
