import {ArrowLeft} from "lucide-react";
import {IconProps, lucideIcon} from "./lucide.tsx";

const Arrow = lucideIcon(ArrowLeft, {width: 32, height: 32, color: "var(--color-icon-primary100)"});

const ArrowLeftIcon = (props: IconProps & {showBackground?: boolean}) => {
    const {showBackground = true, width = 32, height = 32, style, ...rest} = props;
    const background = showBackground
        ? {background: "var(--surface-2)", borderRadius: "50%", padding: Math.round(width * 0.2)}
        : {};
    return <Arrow width={width} height={height} style={{...background, ...style}} {...rest} />;
};
export default ArrowLeftIcon;
