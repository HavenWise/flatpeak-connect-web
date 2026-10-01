import {TriangleAlert} from "lucide-react";
import {IconProps, lucideIcon} from "./lucide.tsx";

const Triangle = lucideIcon(TriangleAlert, {width: 83, height: 75, color: "var(--color-icon-primary100)"});

const WarningIcon = (props: IconProps & {opacity?: number}) => {
    const {opacity = 0.2, style, ...rest} = props;
    return <Triangle style={{opacity, ...style}} {...rest} />;
};
export default WarningIcon;
