import {HTMLAttributes} from "react";

const IncidentIcon = (props: HTMLAttributes<SVGElement> & {width?: number, height?: number}) => (
    <svg
        width={props.width || 16}
        height={props.height || 14}
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_3780_13667)">
            <path d="M10.352 11.6907L10.82 12.4487L12.2158 11.6953V13.125H13.1519V11.6951L14.5633 12.4568L15.0312 11.6988L13.6202 10.9373L15.0267 10.1783L14.5587 9.42034L13.1519 10.1796V8.75H12.2158V10.1794L10.8117 9.42165L10.3438 10.1796L11.7478 10.9373L10.352 11.6907Z" fill="white"/>
            <path d="M8 10.0625C7.61169 10.0625 7.29688 10.3563 7.29688 10.7188C7.29688 11.0812 7.61169 11.375 8 11.375C8.38831 11.375 8.70312 11.0812 8.70312 10.7188C8.70312 10.3563 8.38831 10.0625 8 10.0625Z" fill="white"/>
            <path d="M8.46875 5.25H7.53125V9.1875H8.46875V5.25Z" fill="white"/>
            <path d="M8.93747 13.125H1.90622C1.74244 13.125 1.59047 13.0452 1.50558 12.9145C1.42055 12.7839 1.41483 12.6213 1.49034 12.4857L7.58409 1.54818C7.66477 1.40333 7.83239 1.3125 7.99997 1.3125C8.16755 1.3125 8.33517 1.40333 8.41584 1.54818L11.5846 7.23568L10.7528 7.63932L7.99997 2.69828L2.67834 12.25H8.93747V13.125Z" fill="white"/>
        </g>
        <defs>
            <clipPath id="clip0_3780_13667">
                <rect width="15" height="14" fill="white" transform="translate(0.5)"/>
            </clipPath>
        </defs>
    </svg>
)

export default IncidentIcon
