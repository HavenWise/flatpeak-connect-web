import {HTMLAttributes} from "react";

const HourglassIcon = (props: HTMLAttributes<SVGElement> & {width?: number, height?: number, color?: string}) => (
    <svg width={props.width || 51} height={props.height || 50} viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clipPath="url(#clip0_3780_13796)">
            <path d="M27.0625 29.6875H23.9375V32.8125H27.0625V29.6875Z" fill="black"/>
            <path d="M27.0625 35.9375H23.9375V39.0625H27.0625V35.9375Z" fill="black"/>
            <path d="M36.4375 18.2344V6.25H41.125V3.125H9.875V6.25H14.5625V18.2344C14.5625 18.9105 14.7818 19.5684 15.1875 20.1094L18.8594 25L15.1875 29.8906C14.7818 30.4315 14.5625 31.0895 14.5625 31.7656V43.75H9.875V46.875H41.125V43.75H36.4375V31.7656C36.4375 31.0895 36.2182 30.4315 35.8125 29.8906L32.1406 25L35.8125 20.1094C36.2182 19.5684 36.4375 18.9105 36.4375 18.2344ZM33.3125 6.25V17.1875H17.6875V6.25H33.3125ZM33.3125 31.7656V43.75H17.6875V31.7656L22.7656 25L19.25 20.3125H31.75L28.2344 25L33.3125 31.7656Z" fill="black"/>
        </g>
        <defs>
            <clipPath id="clip0_3780_13796">
                <rect width="50" height="50" fill="white" transform="translate(0.5)"/>
            </clipPath>
        </defs>
    </svg>
)

export default HourglassIcon
