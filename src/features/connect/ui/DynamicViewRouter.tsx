import {useConnect} from "../lib/ConnectProvider.tsx";
import {ComponentType, useEffect, useMemo} from "react";
import {useTheme} from "../../theme/ThemeProvider.tsx";
import {RenderRouteKey} from "../lib/types.ts";

export type DynamicViewRouterProps = Record<RenderRouteKey | "unknown" | "error", ComponentType>

export const DynamicViewRouter = (props: DynamicViewRouterProps) => {
    const {action} = useConnect();
    const {setTheme} = useTheme();

    const routeName = useMemo(() => action?.route || 'unknown', [action?.route]);

    useEffect(() => {
        const isUnknown = (routeName as RenderRouteKey | "unknown") === 'unknown' || !props.hasOwnProperty(routeName);
        setTheme(isUnknown ? 'failure' : 'light');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routeName, setTheme])
    
    const Tag = useMemo(() => {
        return props.hasOwnProperty(routeName) ? props[routeName] : props.unknown;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routeName]);
    
    return <Tag />;
}
