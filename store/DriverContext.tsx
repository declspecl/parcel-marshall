import { Destination } from "@/model/Destination";
import { Direction } from "@/model/Direction";
import { Driver } from "@/model/driver";
import { Location } from "@/model/Location";
import { createContext, useReducer } from "react";

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
    type: DriverActionTypes;
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
    switch (action.type) {
        case DriverActionTypes.UPDATE_LOCATION: {
        }
        case DriverActionTypes.ADD_DESTINATION: {
        }
        case DriverActionTypes.REMOVE_DESTINATION: {
        }
        case DriverActionTypes.SORT_DEST_BY_PROXIMITY: {
        }
        case DriverActionTypes.SORT_DEST_BY_PROXIMITY: {
        }
        case DriverActionTypes.UPDATE_DIRECTION: {
        }
        default: {
            return state;
        }
    }
    return state;
};

interface DriverCtxProviderProps {
    children: React.ReactNode;
}

export default function DriverCtxProvider({ children }: DriverCtxProviderProps) {
    const [driverState, driverDispatch] = useReducer<DriverReducerType>(
        driverStateReducer,
        undefined as unknown as DriverState
    );

    // TODO: Call dispatch in these functions
    function updateLocation(location: Location) {}
    function addDestination(destination: Destination) {}
    function removeDestination(destination: Destination) {}
    function sortDestinationByProximity() {}
    function sortDestinationByFastestRoute() {}
    function updateDirection(direction: Direction) {}

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
