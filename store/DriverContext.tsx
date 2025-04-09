import { Driver } from "@/model/driver";
import { createContext, useReducer } from "react";

interface DriverState {
    driver: Driver;
}

export const DriverContext = createContext<DriverState | null>(null);

interface DriverStateAction {}

type DriverReducerType = (prevState: DriverState, action: DriverStateAction) => DriverState;

const driverStateReducer: DriverReducerType = (state, action) => {
    return state;
};

interface DriverCtxProviderProps {
    children: React.ReactNode;
}

export default function DriverCtxProvider({ children }: DriverCtxProviderProps) {
    const [driverState, driverDispatch] = useReducer<DriverReducerType>(driverStateReducer, {
        driver: new Driver(null, [], null)
    });

    const ctxValue: DriverState = {
        driver: driverState.driver
    };
    return <DriverContext.Provider value={ctxValue}>{children}</DriverContext.Provider>;
}
