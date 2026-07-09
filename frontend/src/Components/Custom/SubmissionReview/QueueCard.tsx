import React, {useState} from "react";
import {Badge, Card, Collapse} from "reactstrap";
import {useTranslation} from "react-i18next";
import {SectionHeader} from "../Submissions/SectionHeader";
import {formatFullDate} from "../../../utils/date";
import {QueueCardProps} from "../../../types/SubmissionReview";


function QueueCard({queue, currentId, onSelect}: QueueCardProps) {
    const {t} = useTranslation();
    const [open, setOpen] = useState(true);

    return (
        <Card className="mb-3">
            <SectionHeader
                title={t('review_queue')}
                icon="inbox"
                open={open}
                onToggle={() => setOpen(v => !v)}
                right={<Badge className="bg-secondary-subtle text-secondary">{queue.length}</Badge>}
            />
            <Collapse isOpen={open}>
                <div className="list-group list-group-flush" style={{maxHeight: 320, overflowY: 'auto'}}>
                    {queue.length === 0 && (
                        <div className="p-3 text-muted small">{t('no_data')}</div>
                    )}
                    {queue.map((s) => {
                        const active = s.id === currentId;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                className={`list-group-item list-group-item-action py-2 text-start ${active ? 'bg-primary-subtle' : ''}`}
                                onClick={() => !active && onSelect(s.id)}
                            >
                                <div className="d-flex justify-content-between align-items-center gap-2">
                                    <span className="fw-medium fs-13 text-truncate">
                                        {s.student?.first_name} {s.student?.last_name}
                                    </span>
                                    <span className="text-muted fs-11 flex-shrink-0">
                                        {formatFullDate(s.submitted_at)}
                                    </span>
                                </div>
                                <div className="text-muted fs-12 text-truncate">
                                    {s.homework?.title}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Collapse>
        </Card>
    );
}

export default QueueCard;