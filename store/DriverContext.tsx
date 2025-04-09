import { Destination } from "@/model/Destination";
import { Direction } from "@/model/Direction";
import { Driver } from "@/model/driver";
import { Location } from "@/model/Location";
import { createContext, useContext, useReducer } from "react";

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

export const DriverContext = createContext<DriverContextType | null>(null);

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

type DriverReducerType = (prevState: DriverState, action: DriverStateAction) => DriverState;
const driverStateReducer: DriverReducerType = (state, action) => {
    const stateCopy: Driver = structuredClone(state);
    switch (action.type) {
        case DriverActionTypes.UPDATE_LOCATION: {
            stateCopy.updateLocation(action.payload);
            break;
        }
        case DriverActionTypes.ADD_DESTINATION: {
            stateCopy.addDestination(action.payload);
            break;
        }
        case DriverActionTypes.REMOVE_DESTINATION: {
            stateCopy.removeDestination(action.payload);
            break;
        }
        case DriverActionTypes.SORT_DEST_BY_PROXIMITY: {
            stateCopy.sortDestinationsByProximity();
            break;
        }
        case DriverActionTypes.SORT_DEST_BY_PROXIMITY: {
            stateCopy.sortDestinationsByFastestRoute();
            break;
        }
        case DriverActionTypes.UPDATE_DIRECTION: {
            stateCopy.updateDirection(action.payload);
            break;
        }
        default: {
            return state;
        }
    }
    return stateCopy;
};

interface DriverCtxProviderProps {
    children: React.ReactNode;
}

function DriverCtxProvider({ children }: DriverCtxProviderProps) {
    const [driverState, driverDispatch] = useReducer<DriverReducerType>(
        driverStateReducer,
        undefined as unknown as DriverState
    );

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
    if (context === undefined) {
        throw new Error(`useDriver must be used within a ${DriverCtxProvider.name}`);
    }
    return context;
}

export { DriverCtxProvider, useDriver };
