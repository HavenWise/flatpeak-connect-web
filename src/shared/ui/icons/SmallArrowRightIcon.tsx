import {ChevronRight} from "lucide-react";
import {IconProps, lucideIcon} from "./lucide.tsx";

type Direction = "right" | "left" | "up" | "down";

const ROTATION: Record<Direction, string> = {
    right: "rotate(0deg)",
    left: "rotate(180deg)",
    up: "rotate(-90deg)",
    down: "rotate(90deg)",
};

const Chevron = lucideIcon(ChevronRight, {width: 11, height: 11, color: "var(--ink-3)"});

// Lucide glyphs are square, so the box takes the larger of the two dimensions the caller asked for.
const SmallArrowRightIcon = (props: IconProps & {direction?: Direction}) => {
    const {direction = "right", width = 7, height = 11, style, ...rest} = props;
    const size = Math.max(width, height);
    return <Chevron width={size} height={size} style={{transform: ROTATION[direction], ...style}} {...rest} />;
};
export default SmallArrowRightIcon;
