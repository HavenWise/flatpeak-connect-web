import {HTMLAttributes} from "react";

const FixedSurchargesIcon = (props: HTMLAttributes<SVGElement> & {width?: number, height?: number}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width || 26}
        height={props.height || 26}
        fill="none"
        {...props}
    >
        <g clipPath="url(#a)" fill="#0096F7">
            <path d="M10.563 13.813H5.686a1.625 1.625 0 0 0-1.625 1.624v4.876a1.625 1.625 0 0 0 1.625 1.625h4.875a1.625 1.625 0 0 0 1.626-1.625v-4.875a1.625 1.625 0 0 0-1.626-1.626Zm-4.876 6.5v-4.875h4.875v4.874H5.689Z"/>
            <path d="M15.438 17.063v1.625h4.874a1.625 1.625 0 0 0 1.625-1.625V5.688a1.625 1.625 0 0 0-1.625-1.625H8.938a1.625 1.625 0 0 0-1.624 1.625v4.875h1.625V5.686h11.374v11.375"/>
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h26v26H0z"/>
            </clipPath>
        </defs>
    </svg>
)

export default FixedSurchargesIcon
