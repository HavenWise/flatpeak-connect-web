import {HTMLAttributes} from "react";

const PercentageIcon = (props: HTMLAttributes<SVGElement> & {width?: number, height?: number}) => (
    <svg
        width={23}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#a)" fill="#0096F7">
            <path d="M6.469 10.563a3.594 3.594 0 1 1 0-7.188 3.594 3.594 0 0 1 0 7.188Zm0-5.75a2.156 2.156 0 1 0 0 4.312 2.156 2.156 0 0 0 0-4.313ZM19.109 3.375 2.875 19.609l1.016 1.016L20.125 4.391l-1.016-1.016ZM16.531 20.625a3.594 3.594 0 1 1 0-7.187 3.594 3.594 0 0 1 0 7.187Zm0-5.75a2.157 2.157 0 1 0 0 4.313 2.157 2.157 0 0 0 0-4.313Z"/>
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" transform="translate(0 .5)" d="M0 0h23v23H0z"/>
            </clipPath>
        </defs>
    </svg>
)

export default PercentageIcon

