import React from "react";
import {Input} from "reactstrap";

interface SearchInputProps {
    value: string,
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
     value,
     onChange,
     placeholder = "Search..."
 }) => {
    return (
        <div className="search-box">
            <Input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <i className="ri-search-line search-icon"/>
        </div>
    )
}
export default SearchInput