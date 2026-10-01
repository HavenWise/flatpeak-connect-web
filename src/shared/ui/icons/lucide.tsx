import {HTMLAttributes} from "react";
import {LucideIcon, LucideProps} from "lucide-react";

/*
 * Havenwise uses Lucide icons only (HAV-1039). Each icon module keeps the name, props and default
 * size of the Flatpeak icon it replaced, so no call site or layout changes; colours are tokens.
 */
export type IconProps = HTMLAttributes<SVGElement> & {width?: number; height?: number; color?: string};

type IconDefaults = {width: number; height: number; color: string};

export const lucideIcon = (Icon: LucideIcon, defaults: IconDefaults) => {
    const Wrapped = (props: IconProps) => {
        const {width = defaults.width, height = defaults.height, color = defaults.color, ...rest} = props;
        return <Icon width={width} height={height} color={color} {...(rest as LucideProps)} />;
    };
    Wrapped.displayName = `${Icon.displayName ?? "Lucide"}Icon`;
    return Wrapped;
};
