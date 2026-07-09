import React, {useState} from "react";
import {Badge, Button, Card, CardBody, Collapse, Progress} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import CriterionResultRow from "../Submissions/CriterionResultRow";
import {SectionHeader} from "../Submissions/SectionHeader";
import {ChecklistCardProps} from "../../../types/SubmissionReview";


function ChecklistCard({
                           drafts, isReviewed,
                           metCount, allMet, progressPct, progressColor,
                           onToggleAll, onChangeDraft,
                       }: ChecklistCardProps) {
    const {t} = useTranslation();
    const [open, setOpen] = useState(true);

    return (
        <Card className="mb-3">
            <SectionHeader
                title={t('criteria_check')}
                icon="check-square"
                open={open}
                onToggle={() => setOpen(v => !v)}
                right={drafts.length > 0 ? (
                    <Badge className={`bg-${progressColor}-subtle text-${progressColor}`}>
                        {metCount}/{drafts.length}
                    </Badge>
                ) : undefined}
            />
            <Collapse isOpen={open}>
                <CardBody className="pt-2">
                    {drafts.length === 0 ? (
                        <div className="text-muted small">
                            {t('no_criteria_for_homework')}
                        </div>
                    ) : (
                        <>
                            <Progress
                                value={progressPct}
                                color={progressColor}
                                className="mb-2"
                                style={{height: 4}}
                            />

                            {!isReviewed && (
                                <div className="d-flex justify-content-end">
                                    <Button
                                        className="btn btn-ghost-primary btn-sm d-flex align-items-center gap-1 text-white"
                                        onClick={onToggleAll}
                                    >
                                        <FeatherIcon
                                            size={12}
                                            icon={allMet ? 'square' : 'check-square'}
                                        />
                                        {t(allMet ? 'unmark_all' : 'mark_all_met')}
                                    </Button>
                                </div>
                            )}

                            {drafts.map((draft, idx) => (
                                <CriterionResultRow
                                    key={draft.criterionId}
                                    draft={draft}
                                    disabled={isReviewed}
                                    onChange={(next) => onChangeDraft(idx, next)}
                                />
                            ))}
                        </>
                    )}
                </CardBody>
            </Collapse>
        </Card>
    );
}

export default ChecklistCard;