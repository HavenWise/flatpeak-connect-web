import {HTMLAttributes} from "react";

const DirectionIcon = (props: HTMLAttributes<SVGElement> & {width?: number, height?: number}) => (
    <svg
        width={props.width || 13}
        height={props.height || 14}
        viewBox="0 0 13 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_3780_13641)">
            <path d="M4.63531 11.3022L3.18094 9.84375H11.375V9.03125H3.18094L4.63531 7.57281L4.0625 7L1.625 9.4375L4.0625 11.875L4.63531 11.3022Z" fill="#0096F7"/>
            <path d="M11.375 4.5625L8.9375 2.125L8.36469 2.69781L9.81906 4.15625H1.625V4.96875H9.81906L8.36469 6.42719L8.9375 7L11.375 4.5625Z" fill="#0096F7"/>
        </g>
        <defs>
            <clipPath id="clip0_3780_13641">
                <rect width="13" height="13" fill="white" transform="translate(0 0.5)"/>
            </clipPath>
        </defs>
    </svg>
)

export default DirectionIcon
