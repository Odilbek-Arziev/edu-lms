import React, {useState} from "react";
import {Card, CardBody, Collapse} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import {SectionHeader} from "../Submissions/SectionHeader";
import {TaskInfoCardProps} from "../../../types/SubmissionReview";


function TaskInfoCard({submission, isOverdue}: TaskInfoCardProps) {
    const {t} = useTranslation();
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
                </CardBody>
            </Collapse>
        </Card>
    );
}

export default TaskInfoCard;