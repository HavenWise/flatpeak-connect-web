import {HTMLAttributes} from "react";
const ArrowLeftIcon = (props: HTMLAttributes<SVGElement> & {width?: number, height?: number, showBackground?: boolean}) => {
    const { width = 32, height = 32, showBackground = true, ...svgProps } = props;
    
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox={"0 0 32 32"}
            fill="none"
            {...svgProps}
        >
            {showBackground && <circle cx={16} cy={16} r={16} fill="#F5F5F5"/>}
            <path
                fill="var(--color-icon-primary100)"
                d="M9.47 15.47a.75.75 0 0 0 0 1.06l4.773 4.773a.75.75 0 0 0 1.06-1.06L11.061 16l4.242-4.243a.75.75 0 0 0-1.06-1.06L9.47 15.47Zm.53 1.28h12v-1.5H10v1.5Z"
            />
        </svg>
    );
}
export default ArrowLeftIcon
