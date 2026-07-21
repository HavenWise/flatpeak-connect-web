import {HTMLAttributes} from "react";

type Direction = 'right' | 'left' | 'up' | 'down';

const SmallArrowRightIcon = (props: HTMLAttributes<SVGElement> & {width?: number, height?: number, direction?: Direction, color?: string}) => {
    const { direction = 'right', width = 7, height = 11, color = 'rgba(0, 0, 0, 0.4)', ...svgProps } = props;
    
    const getRotation = () => {
        switch (direction) {
            case 'left': return 'rotate(180deg)';
            case 'up': return 'rotate(-90deg)';
            case 'down': return 'rotate(90deg)';
            case 'right':
            default: return 'rotate(0deg)';
        }
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 7 11"
            fill="none"
            style={{ transform: getRotation() }}
            {...svgProps}
        >
            <path
                fill={color}
                d="M6.115 5.77a.534.534 0 0 1-.17.386l-4.64 4.541a.526.526 0 0 1-.387.159.524.524 0 0 1-.533-.534c0-.152.058-.281.152-.38L4.803 5.77.537 1.598a.556.556 0 0 1-.152-.381c0-.305.234-.533.533-.533.152 0 .281.052.387.152l4.64 4.547c.112.105.17.24.17.387Z"
            />
        </svg>
    );
}
export default SmallArrowRightIcon
