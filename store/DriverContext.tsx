import { RouteName } from "@/lib/Routes";
import { Destination } from "@/model/Destination";
import { Direction } from "@/model/Direction";
import {
    addDestination,
    Driver,
    removeDestination,
    sortDestinationsByFastestRoute,
    sortDestinationsByProximity,
    updateDirection,
    updateLocation
} from "@/model/Driver";
import { getDistanceFrom, Location } from "@/model/Location";

import { createContext, useContext, useEffect, useReducer } from "react";
import { LayoutAnimation } from "react-native";
import { PersistantStoreService } from "./PersistantStoreService";
import { useNavigationState } from "@react-navigation/native"; // You had the wrong quotes in original

type DriverState = Driver;

interface DriverContextType {
    driver: DriverState;
    updateLocation: (location: Location) => void;
    addDestination: (destination: Destination) => void;
    removeDestination: (destination: Destination) => void;
    sortDestinationByProximity: () => void;
    sortDestinationByFastestRoute: () => void;
    updateDirection: (direction: Direction) => void;
}

const DriverContext = createContext<DriverContextType | null>(null);

enum DriverActionTypes {
    UPDATE_LOCATION = "UPDATE_LOCATION",
    ADD_DESTINATION = "ADD_DESTINATION",
    REMOVE_DESTINATION = "REMOVE_DESTINATION",
    SORT_DEST_BY_PROXIMITY = "SORT_DEST_BY_PROXIMITY",
    SORT_DEST_BY_FASTEST_ROUTE = "SORT_DEST_BY_FASTEST_ROUTE",
    UPDATE_DIRECTION = "UPDATE_DIRECTION"
}

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

type DriverStateAction =
    | UpdateLocationAction
    | AddDestinationAction
    | RemoveDestinationAction
    | SortDestinationByProximityAction
    | SortDestinationByFastestRouteAction
    | UpdateDirectionAction;

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
        case DriverActionTypes.SORT_DEST_BY_PROXIMITY: {
            return sortDestinationsByProximity(state);
        }
        //fixed typo in action type
        case DriverActionTypes.SORT_DEST_BY_FASTEST_ROUTE: {
            return sortDestinationsByFastestRoute(state);
        }

        case DriverActionTypes.UPDATE_DIRECTION: {
            return updateDirection(state, action.payload);
        }
        default: {
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
        currentLocation: { latitude: 5, longitude: 5, address: null },
        destinations: storeService.getDestinations() ?? [
            {
                latitude: 4.7,
                longitude: 5.7,
                //travelDuration: 20,
                travelDuration: 60,
                address: "318 Meadow Brook Rd, Rochester, MI 48309",
                //travelDistance: parseInt((Math.random() * 100).toFixed(0)),
                travelDistance: 60,
                //travelDirection: { degrees: 50 }
                travelDirection: { degrees: 180 }
            },
            {
                latitude: 5.1, // testing purposes
                longitude: 5.1,
                travelDuration: 20,
                address: "Anton’s Discrete Math Asylum, UA 01001",
                //travelDistance: parseInt((Math.random() * 100).toFixed(0)),
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
                //travelDistance: parseInt((Math.random() * 100).toFixed(0)),
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
                //sortDestinationByProximity(); commenting out for now as i am handling this
                // in update button
                break;
            case RouteName.Route:
                //sortDestinationByFastestRoute();
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

    function updateLocation(location: Location) {
        driverDispatch({ type: DriverActionTypes.UPDATE_LOCATION, payload: location });
    }
    function addDestination(destination: Destination) {
        driverDispatch({ type: DriverActionTypes.ADD_DESTINATION, payload: destination });
    }
    function removeDestination(destination: Destination) {
        driverDispatch({ type: DriverActionTypes.REMOVE_DESTINATION, payload: destination });
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
