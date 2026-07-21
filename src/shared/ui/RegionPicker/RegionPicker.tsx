import {PropsWithChildren} from "react";
import Select from "../Select/Select.tsx";

type RegionPickerProps = {
	options: string[];
	name: string;
	defaultValue?: string;
	placeholder?: string;
	onChange?: (value: string) => void;
}

export default function RegionPicker(props: PropsWithChildren<RegionPickerProps>) {
    const {name, options, defaultValue, placeholder = "Choose your region", onChange} = props;
    
    return (
        <Select
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue || ""}
            options={options.map((opt) => ({label: opt, value: opt}))}
            onChange={onChange}
            required
        />
    );
}
