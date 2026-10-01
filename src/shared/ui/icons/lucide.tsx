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

/*
 * The header's round buttons (back, close): the glyph inset on a circular surface, as the Flatpeak
 * icons drew it, so both controls in NavigationButton read as the same kind of thing. The failure
 * theme sets --color-icon-surface so the white glyph stays legible on the error background.
 */
export const circledIcon = (Icon: LucideIcon) => {
    const Wrapped = (props: IconProps & {showBackground?: boolean}) => {
        const {
            showBackground = true, width = 32, height = 32, color = "var(--color-icon-primary100)", style, ...rest
        } = props;
        const background = showBackground
            ? {background: "var(--color-icon-surface, var(--surface-2))", borderRadius: "50%", padding: Math.round(width * 0.22)}
            : {};
        return (
            <Icon width={width} height={height} color={color} strokeWidth={1.5}
                  style={{...background, ...style}} {...(rest as LucideProps)} />
        );
    };
    Wrapped.displayName = `Circled${Icon.displayName ?? "Lucide"}Icon`;
    return Wrapped;
};
