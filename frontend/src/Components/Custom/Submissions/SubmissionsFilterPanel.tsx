import React from "react";
import {Badge, Button, Card, CardBody, CardHeader} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import SearchInput from "../../Common/SearchInput";
import CascadeSelect from "../Homeworks/CascadeSelect";
import {FilterLabel} from "./FilterLabel";
import {DateRangeFilter} from "./DateRangeFilter";
import {SubmissionsFilterPanelProps} from "../../../types/HomeworkSubmission";
import {FilterSection} from "./FilterSection";
import {TriStateSwitch} from "./TriStateSwitch";


function SubmissionsFilterPanel({
                                    filters,
                                    updateFilter,
                                    resetFilters,
                                    activeCount,
                                    cascade
                                }: SubmissionsFilterPanelProps) {
    const {t} = useTranslation();

    return (
        <div className="position-sticky" style={{top: 90, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto'}}>
            <Card className="mb-3">
                <CardHeader className="d-flex align-items-center justify-content-between py-2">
                    <h6 className="mb-0 d-flex align-items-center gap-2">
                        <FeatherIcon icon="filter" size={14}/>
                        {t('filters')}
                        {activeCount > 0 && (
                            <Badge className="bg-primary-subtle text-primary">{activeCount}</Badge>
                        )}
                    </h6>
                    {activeCount > 0 && (
                        <Button
                            className="btn btn-ghost-secondary btn-sm btn-icon"
                            title={t('clear')}
                            onClick={resetFilters}
                        >
                            <FeatherIcon icon="x" size={14}/>
                        </Button>
                    )}
                </CardHeader>
                <CardBody className="pt-2">
                    <h6 className="text-uppercase fs-11 text-muted fw-semibold mb-3 pb-2 border-bottom">
                        {t('homework')}
                    </h6>

                    <div className="mb-3 d-flex flex-column gap-2">
                        <CascadeSelect cascade={cascade}/>
                    </div>

                    <FilterSection text={t('student')}/>

                    <div className="mb-3">
                        <FilterLabel icon="user" text={t('full_name')}/>
                        <SearchInput
                            value={filters.student}
                            onSearch={(v: string) => updateFilter('student', v)}
                            placeholder={t('search_by_student')}
                        />
                    </div>

                    <DateRangeFilter
                        icon="calendar"
                        label={t('submitted_date')}
                        from={filters.submittedFrom}
                        to={filters.submittedTo}
                        onChangeFrom={(v) => updateFilter('submittedFrom', v)}
                        onChangeTo={(v) => updateFilter('submittedTo', v)}
                    />

                    <FilterSection text={t('checking')}/>

                    <div className="mb-3">
                        <FilterLabel icon="edit-3" text={t('checked')}/>
                        <TriStateSwitch
                            value={filters.checked}
                            onChange={(v) => updateFilter('checked', v)}
                            t={t}
                        />
                    </div>

                    <div className="mb-3">
                        <FilterLabel icon="check-circle" text={t('accepted')}/>
                        <TriStateSwitch
                            value={filters.approved}
                            onChange={(v) => updateFilter('approved', v)}
                            disabled={filters.checked === 'no'}
                            t={t}
                        />
                    </div>

                    <div className="mb-3">
                        <FilterLabel icon="refresh-cw" text={t('reworked')}/>
                        <TriStateSwitch
                            value={filters.reworked}
                            onChange={(v) => updateFilter('reworked', v)}
                            t={t}
                        />
                    </div>

                    <DateRangeFilter
                        icon="calendar"
                        label={t('checked_date')}
                        from={filters.checkedFrom}
                        to={filters.checkedTo}
                        onChangeFrom={(v) => updateFilter('checkedFrom', v)}
                        onChangeTo={(v) => updateFilter('checkedTo', v)}
                    />
                </CardBody>
            </Card>
        </div>
    );
}

export default SubmissionsFilterPanel;