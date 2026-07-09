import React from "react";
import Select from "react-select";

export interface Option {
    value: number | string;
    label: string;
}

interface SelectProps {
    value: number | string | null;
    options: Option[];
    onChange: (value: number | string | null) => void;
    placeholder?: string;
    width?: string;
    isClearable?: boolean;
    isDisabled?: boolean;
}

const CustomSelect: React.FC<SelectProps> = ({
    value,
    options,
    onChange,
    placeholder = "Select necessary...",
    width = "100%",
    isClearable = true,
    isDisabled = false,
}) => {
    return (
        <Select<Option>
            value={options.find(o => o.value === value) || null}
            options={options}
            isClearable={isClearable}
            isDisabled={isDisabled}
            placeholder={placeholder}
            styles={{
                container: (provided: any) => ({
                    ...provided,
                    width,
                }),
            }}
            onChange={(option: any) => onChange(option ? option.value : null)}
        />
    );
};

export default CustomSelect;