import React from "react";
import {Input} from "reactstrap";
import {FilterLabel} from "./FilterLabel";
import {DateRangeFilterProps} from "../../../types/HomeworkSubmission";


export function DateRangeFilter({icon, label, from, to, onChangeFrom, onChangeTo}: DateRangeFilterProps) {
    return (
        <div className="mb-3">
            <FilterLabel icon={icon} text={label}/>
            <div className="d-flex gap-2">
                <Input
                    type="date"
                    bsSize="sm"
                    value={from}
                    onChange={(e) => onChangeFrom(e.target.value)}
                />
                <Input
                    type="date"
                    bsSize="sm"
                    value={to}
                    onChange={(e) => onChangeTo(e.target.value)}
                />
            </div>
        </div>
    );
}