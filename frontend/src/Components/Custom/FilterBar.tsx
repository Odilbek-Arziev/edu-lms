import React from "react";
import {Button} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import SearchInput from "../Common/SearchInput";
import CustomSelect from "../Common/CustomSelect";

export type FilterConfig = {
    placeholder?: string;
    value: any;
    options: any[];
    onChange: (value: any) => void;
    isClearable?: boolean;
    isDisabled?: boolean;
    width?: string;
    minWidth?: number;
    key?: string | number;
};

type FilterBarProps = {
    search?: string;
    onSearch?: (value: string) => void;
    showSearch?: boolean;

    filters?: FilterConfig[];

    onClear?: () => void;
    clearLabel?: string;

    onCreate?: () => void;
    createLabel?: string;
    createIcon?: string;

    actions?: React.ReactNode;
};

const FilterBar: React.FC<FilterBarProps> = ({
                                                 search = '',
                                                 onSearch,
                                                 showSearch = true,
                                                 filters = [],
                                                 onClear,
                                                 clearLabel,
                                                 onCreate,
                                                 createLabel,
                                                 createIcon = 'plus-circle',
                                                 actions,
                                             }) => {
    const {t} = useTranslation();

    return (
        <div className="d-flex justify-content-between my-2 flex-wrap gap-2">
            <div className="d-flex gap-1 flex-wrap align-items-center">
                {showSearch && onSearch && (
                    <SearchInput value={search} onSearch={onSearch}/>
                )}

                {filters.map((f, idx) => (
                    <div
                        key={f.key ?? idx}
                        style={f.width ? undefined : {minWidth: f.minWidth ?? 200}}
                    >
                        <CustomSelect
                            placeholder={f.placeholder}
                            value={f.value}
                            options={f.options || []}
                            onChange={f.onChange}
                            isClearable={f.isClearable}
                            isDisabled={f.isDisabled}
                            width={f.width}
                        />
                    </div>
                ))}

                {onClear && (
                    <Button
                        className="btn btn-secondary d-flex gap-1 align-items-center"
                        onClick={onClear}
                    >
                        <FeatherIcon color="white" size={12} icon="trash"/>
                        {clearLabel ?? t('clear')}
                    </Button>
                )}
            </div>

            {(onCreate || actions) && (
                <div className="d-flex gap-1">
                    {onCreate && (
                        <Button
                            className="btn btn-success d-flex gap-1 align-items-center"
                            onClick={onCreate}
                        >
                            <FeatherIcon color="white" size={12} icon={createIcon}/>
                            {createLabel ?? t('create')}
                        </Button>
                    )}
                    {actions}
                </div>
            )}
        </div>
    );
};

export default FilterBar;