import React, {useEffect, useState} from "react";
import {Input} from "reactstrap";

interface SearchInputProps {
    value: string;
    onSearch: (value: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onSearch,
    placeholder = "Search..."
}) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className="search-box">
            <Input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSearch(localValue.trim());
                    }
                }}
            />
            <i className="ri-search-line search-icon"/>
        </div>
    );
};

export default SearchInput;
