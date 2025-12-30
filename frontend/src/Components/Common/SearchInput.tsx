import React, {useEffect, useState} from "react";
import {Input} from "reactstrap";
import {withTranslation} from "react-i18next";

interface SearchInputProps {
    value: string,
    onSearch: (value: string) => void,
    t: (key: string) => string,
    placeholder?: string,
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onSearch,
    placeholder,
    t
}) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const resolvedPlaceholder = placeholder ?? `${t('search')}...`;

    return (
        <div className="search-box">
            <Input
                type="text"
                className="form-control"
                placeholder={resolvedPlaceholder}
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

export default withTranslation()(SearchInput);
