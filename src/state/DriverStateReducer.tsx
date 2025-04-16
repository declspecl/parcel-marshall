import { Direction, Destination, Location, EmptyDestination, TravelData } from "@/model";
import {
    addDestination,
    Driver,
    removeDestination,
    sortDestinationsByFastestRoute,
    sortDestinationsByProximity,
    updateDestinationAddress,
    updateDirection,
    updateLocation
} from "@/model/Driver";

export enum DriverActionTypes {
    UPDATE_LOCATION,
    ADD_DESTINATION,
    REMOVE_DESTINATION,
    UPDATE_DESTINATION,
    SORT_DEST_BY_PROXIMITY,
    SORT_DEST_BY_FASTEST_ROUTE,
    UPDATE_DIRECTION_ADDRESS,
    SET_DESTINATIONS,
    SET_TRAVEL_DATA
}

type UpdateLocationAction = {
    type: DriverActionTypes.UPDATE_LOCATION;
    payload: Location;
};

type AddDestinationAction = {
    type: DriverActionTypes.ADD_DESTINATION;
    payload: EmptyDestination;
};

type RemoveDestinationAction = {
    type: DriverActionTypes.REMOVE_DESTINATION;
    payload: {
        address: string;
    };
};

type UpdateDestinationAddressAction = {
    type: DriverActionTypes.UPDATE_DESTINATION;
    payload: {
        oldAddress: string;
        updatedData: EmptyDestination;
    };
};

type SortDestinationByProximityAction = {
    type: DriverActionTypes.SORT_DEST_BY_PROXIMITY;
};

type SortDestinationByFastestRouteAction = {
    type: DriverActionTypes.SORT_DEST_BY_FASTEST_ROUTE;
};

type UpdateDirectionAction = {
    type: DriverActionTypes.UPDATE_DIRECTION_ADDRESS;
    payload: Direction;
};

type SetDestinationsActions = {
    type: DriverActionTypes.SET_DESTINATIONS;
    payload: Destination[];
};

type SetTravelDataActions = {
    type: DriverActionTypes.SET_TRAVEL_DATA;
    payload: {
        address: string;
        travelData: TravelData;
    };
};

type DriverStateAction =
    | UpdateLocationAction
    | AddDestinationAction
    | RemoveDestinationAction
    | UpdateDestinationAddressAction
    | SortDestinationByProximityAction
    | SortDestinationByFastestRouteAction
    | UpdateDirectionAction
    | SetDestinationsActions
    | SetTravelDataActions;

export type DriverReducerType = (prevState: Driver, action: DriverStateAction) => Driver;
export const driverStateReducer: DriverReducerType = (state, action) => {
    switch (action.type) {
        case DriverActionTypes.UPDATE_LOCATION: {
            return updateLocation(state, action.payload);
        }
        case DriverActionTypes.ADD_DESTINATION: {
            return addDestination(state, { ...action.payload, type: "empty" });
        }
        case DriverActionTypes.REMOVE_DESTINATION: {
            return removeDestination(state, action.payload.address);
        }
        case DriverActionTypes.UPDATE_DESTINATION: {
            return updateDestinationAddress(state, action.payload.oldAddress, {
                ...action.payload.updatedData,
                type: "empty"
            });
        }
        case DriverActionTypes.SORT_DEST_BY_PROXIMITY: {
            return sortDestinationsByProximity(state);
        }
        case DriverActionTypes.SORT_DEST_BY_FASTEST_ROUTE: {
            return sortDestinationsByFastestRoute(state);
        }
        case DriverActionTypes.UPDATE_DIRECTION_ADDRESS: {
            return updateDirection(state, action.payload);
        }
        case DriverActionTypes.SET_DESTINATIONS: {
            return { ...state, destinations: action.payload };
        }
        case DriverActionTypes.SET_TRAVEL_DATA: {
            const { address, travelData } = action.payload;
            const updatedDestinations: Destination[] = state.destinations.map((destination) =>
                destination.address === address ? { ...destination, type: "full", ...travelData } : destination
            );

            return { ...state, destinations: updatedDestinations };
        }
        default: {
            return state;
        }
    }
};
