import React from "react";
import {Badge, Button} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import {QueueFilter, SubmissionsTableRowProps} from "../../../types/HomeworkSubmission";
import {FILTERS} from "../../../utils/submission";
import {formatFullDate} from "../../../utils/date";
import {getAvatarColor, getInitials} from "../../../utils/getters";


function SubmissionsTableRow({submission, onOpen}: SubmissionsTableRowProps) {
    const {t} = useTranslation();

    const rowState: QueueFilter = submission.is_checked
        ? (submission.is_approved ? 'approved' : 'rejected')
        : 'open';

    const config = FILTERS.find((f) => f.key === rowState) || FILTERS[0];

    const fullName = `${submission.student?.first_name || ''} ${submission.student?.last_name || ''}`.trim();
    const avatarColor = getAvatarColor(fullName || String(submission.id));

    return (
        <tr
            style={{cursor: 'pointer'}}
            onClick={() => onOpen(submission.id)}
        >
            <td style={{maxWidth: 280, whiteSpace: 'normal'}}>
                <div className="text-muted fs-11 d-flex align-items-center gap-1 mb-1">
                    <FeatherIcon size={11} icon="clipboard"/>
                    {t('homework')}
                </div>
                <h6 className="fs-13 mb-1" title={submission.homework?.title}>
                    {submission.homework?.title}
                </h6>
                <div className="text-muted fs-12 text-truncate">
                    {submission.homework?.lesson?.title}
                </div>
            </td>

            <td>
                <div className="d-flex align-items-center gap-2">
                    <div className="avatar-xs flex-shrink-0">
                        <div className={`avatar-title rounded-circle fw-semibold fs-12 bg-${avatarColor}-subtle text-${avatarColor}`}>
                            {getInitials(submission.student?.first_name, submission.student?.last_name)}
                        </div>
                    </div>
                    <div style={{minWidth: 0}}>
                        <div className="fw-medium fs-13 text-truncate" style={{maxWidth: 160}} title={fullName}>
                            {fullName}
                        </div>
                        <div className="text-muted fs-12">
                            {formatFullDate(submission.submitted_at)}
                        </div>
                    </div>
                </div>
            </td>

            <td style={{maxWidth: 320, whiteSpace: 'normal'}}>
                {submission.comment_from_student && (
                    <div
                        className="fs-13 mb-1"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                        title={submission.comment_from_student}
                    >
                        {submission.comment_from_student}
                    </div>
                )}
                {submission.file ? (
                    <span className="text-muted fs-12 d-flex align-items-center gap-1">
                        <FeatherIcon size={11} icon="paperclip"/>
                        {t('attached_files')}
                    </span>
                ) : (
                    !submission.comment_from_student && <span className="text-muted">—</span>
                )}
            </td>

            <td>
                <Badge className={`bg-${config.color}-subtle text-${config.color}`}>
                    <FeatherIcon size={11} icon={config.icon} className="me-1"/>
                    {t(config.label)}
                </Badge>
                {submission.review?.created_at && (
                    <div className="text-muted fs-12 mt-1">
                        {formatFullDate(submission.review.created_at)}
                    </div>
                )}
            </td>

            <td className="text-end">
                <Button
                    className={`btn btn-sm btn-icon ${rowState === 'open' ? 'btn-primary' : 'btn-soft-secondary'}`}
                    title={t(rowState === 'open' ? 'check' : 'view')}
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen(submission.id);
                    }}
                >
                    <FeatherIcon size={13} icon={rowState === 'open' ? 'edit-3' : 'eye'}/>
                </Button>
            </td>
        </tr>
    );
}

export default SubmissionsTableRow;