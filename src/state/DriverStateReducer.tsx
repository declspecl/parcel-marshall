import { Direction, Destination, Location } from "@/model";
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

export enum DriverActionTypes {
    UPDATE_LOCATION = "UPDATE_LOCATION",
    ADD_DESTINATION = "ADD_DESTINATION",
    REMOVE_DESTINATION = "REMOVE_DESTINATION",
    UPDATE_DESTINATION = "UPDATE_DESTINATION",
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

type DriverStateAction =
    | UpdateLocationAction
    | AddDestinationAction
    | RemoveDestinationAction
    | UpdateDestinationAction
    | SortDestinationByProximityAction
    | SortDestinationByFastestRouteAction
    | UpdateDirectionAction;

export type DriverReducerType = (prevState: Driver, action: DriverStateAction) => Driver;
export const driverStateReducer: DriverReducerType = (state, action) => {
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
            return state;
        }
    }
};
