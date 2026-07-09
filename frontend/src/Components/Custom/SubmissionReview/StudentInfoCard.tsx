import React, {useState} from "react";
import {Card, CardBody, Collapse} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import {getAvatarColor, getInitials} from "../../../utils/getters";
import {SectionHeader} from "../Submissions/SectionHeader";
import {formatFullDate} from "../../../utils/date";
import {StudentInfoCardProps} from "../../../types/SubmissionReview";


function StudentInfoCard({submission}: StudentInfoCardProps) {
    const {t} = useTranslation();
    const [open, setOpen] = useState(true);

    const fullName = `${submission.student?.first_name || ''} ${submission.student?.last_name || ''}`.trim();
    const avatarColor = getAvatarColor(fullName || String(submission.id));

    return (
        <Card className="mb-3">
            <SectionHeader
                title={t('student')}
                icon="user"
                open={open}
                onToggle={() => setOpen(v => !v)}
            />
            <Collapse isOpen={open}>
                <CardBody>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="avatar-sm flex-shrink-0">
                            <div
                                className={`avatar-title rounded-circle fs-14 fw-semibold bg-${avatarColor}-subtle text-${avatarColor}`}>
                                {getInitials(submission.student?.first_name, submission.student?.last_name)}
                            </div>
                        </div>
                        <div style={{minWidth: 0}}>
                            <div className="fw-medium text-truncate">{fullName}</div>
                            <div className="text-muted fs-12">
                                {t('submitted_at')}: {formatFullDate(submission.submitted_at)}
                            </div>
                        </div>
                    </div>

                    {submission.comment_from_student ? (
                        <div className="bg-light rounded-3 p-2 fs-13 fst-italic">
                            <FeatherIcon size={12} icon="message-square" className="me-1 text-muted"/>
                            {submission.comment_from_student}
                        </div>
                    ) : (
                        <div className="text-muted fst-italic fs-13">
                            {t('no_comment')}
                        </div>
                    )}
                </CardBody>
            </Collapse>
        </Card>
    );
}

export default StudentInfoCard;