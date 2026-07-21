import {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";
import {CommonRenderRoute, RenderRouteKey} from "./types.ts";


type ConnectContextType<T extends RenderRouteKey = RenderRouteKey> = {
    action?: CommonRenderRoute<T>;
    proceed: <K>(action: Promise<K>) => Promise<K>
}

const ConnectContext = createContext<ConnectContextType>({
    proceed: (r) => Promise.resolve(r),
});

export const useConnect = <T extends RenderRouteKey = RenderRouteKey>() => useContext(ConnectContext) as Required<ConnectContextType<T>>;

export type ConnectProviderProps = {
    response?: CommonRenderRoute;
    proceed: <K>(action: Promise<K>) => Promise<K>;
}
export const ConnectProvider = (props: PropsWithChildren<ConnectProviderProps>) => {
    const {children, response, proceed} = props;
    const [action, setAction] = useState<CommonRenderRoute>();

    useEffect(() => {
        if (response) {
            setAction(response);
        }
    }, [response])

    const contextValue = useMemo(() => {
        return {
            action,
            proceed
        };
    }, [action, proceed]);

    return (
        <ConnectContext.Provider value={contextValue}>
            {children}
        </ConnectContext.Provider>
    );
}
