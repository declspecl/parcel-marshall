import { Driver } from "@/model/driver";
import { createContext, useReducer } from "react";

export const DriverContext = createContext<Driver | null>(null);

interface DriverStateAction {}

type DriverReducerType = (prevState: Driver, action: DriverStateAction) => Driver;

const driverStateReducer: DriverReducerType = (state, action) => {
    return state;
};

interface DriverCtxProviderProps {
    children: React.ReactNode;
}

export default function DriverCtxProvider({ children }: DriverCtxProviderProps) {
    const [driverState, driverDispatch] = useReducer<DriverReducerType>(driverStateReducer, new Driver(null, [], null));
    return <DriverContext.Provider value={driverState}>{children}</DriverContext.Provider>;
}
