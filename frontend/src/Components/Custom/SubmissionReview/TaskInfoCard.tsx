import React, {useState} from "react";
import {Button, Card, CardBody, Collapse} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import {SectionHeader} from "../Submissions/SectionHeader";
import {TaskInfoCardProps} from "../../../types/SubmissionReview";
import {formatFullDate} from "../../../utils/date";
import {useNavigate} from "react-router-dom";


function TaskInfoCard({submission, isOverdue}: TaskInfoCardProps) {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const [open, setOpen] = useState(true);

    return (
        <Card className="mb-3">
            <SectionHeader
                title={t('homework')}
                icon="book-open"
                open={open}
                onToggle={() => setOpen(v => !v)}
            />
            <Collapse isOpen={open}>
                <CardBody className="fs-13">
                    {submission.homework?.description ? (
                        <p className="mb-3" style={{whiteSpace: 'pre-line'}}>
                            {submission.homework.description}
                        </p>
                    ) : (
                        <p className="text-muted fst-italic mb-3">—</p>
                    )}

                    <div className="d-flex flex-column gap-2 text-muted">
                        <span className="d-flex align-items-center gap-1">
                            <FeatherIcon size={13} icon="book-open"/>
                            {submission.homework?.lesson?.title}
                        </span>
                        {submission.homework?.deadline && (
                            <span className={`d-flex align-items-center gap-1 ${isOverdue ? 'text-danger' : ''}`}>
                                <FeatherIcon size={13} icon="calendar"/>
                                {t('deadline')}: {submission.homework.deadline}
                            </span>
                        )}
                    </div>
                    {submission.previous_submission_detail && (
                        <div className="mt-3 p-2 rounded bg-warning-subtle border-start border-warning border-3">
                            <div className="d-flex align-items-center gap-1 text-warning fw-medium fs-13 mb-1">
                                <FeatherIcon size={13} icon="refresh-cw"/>
                                {t('reworked')}
                            </div>
                            <div className="text-muted fs-12 mb-2">
                                {t('previous_submission_from')}{' '}
                                {formatFullDate(submission.previous_submission_detail.submitted_at)}
                            </div>
                            {submission.previous_submission_detail.review?.general_feedback && (
                                <div className="fs-12 fst-italic">
                                    "{submission.previous_submission_detail.review.general_feedback}"
                                </div>
                            )}
                            <Button
                                className="btn btn-sm btn-soft-warning mt-2"
                                onClick={() => navigate(`/submissions/${submission.previous_submission_detail.id}`)}
                            >
                                <FeatherIcon size={11} icon="eye" className="me-1"/>
                                {t('view_previous')}
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Collapse>
        </Card>
    );
}

export default TaskInfoCard;