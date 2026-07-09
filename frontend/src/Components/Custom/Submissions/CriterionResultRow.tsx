import React, {useState} from "react";
import {Collapse, Input} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";

export interface CriterionResultDraft {
    criterionId: number,
    criterionText: string,
    is_met: boolean,
    feedback: string
}

interface Props {
    draft: CriterionResultDraft,
    onChange: (next: CriterionResultDraft) => void;
    disabled?: boolean;
}

function CriterionResultRow({draft, onChange, disabled = false}: Props) {
    const {t} = useTranslation();
    const [showFeedback, setShowFeedback] = useState(!!draft.feedback);

    const toggleMet = () => {
        if (!disabled) onChange({...draft, is_met: !draft.is_met});
    };

    return (
        <div className="py-2 border-bottom">
            <div className="d-flex align-items-start gap-2">
                <div className="form-check form-switch form-switch-success mb-0 flex-shrink-0 pt-1">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={draft.is_met}
                        disabled={disabled}
                        onChange={toggleMet}
                        style={{cursor: disabled ? 'default' : 'pointer'}}
                    />
                </div>

                <span
                    className={`fs-13 flex-grow-1 ${draft.is_met ? '' : 'text-muted'}`}
                    style={{cursor: disabled ? 'default' : 'pointer', userSelect: 'none'}}
                    onClick={toggleMet}
                >
                    {draft.criterionText}
                </span>

                <button
                    type="button"
                    className="btn btn-sm btn-icon btn-ghost-secondary flex-shrink-0"
                    title={t('criterion_feedback_placeholder')}
                    onClick={() => setShowFeedback(v => !v)}
                >
                    <FeatherIcon
                        icon="message-square"
                        size={13}
                        className={draft.feedback ? 'text-primary' : 'text-muted'}
                    />
                </button>
            </div>

            <Collapse isOpen={showFeedback}>
                <Input
                    type="textarea"
                    className="mt-2"
                    rows={2}
                    placeholder={t('criterion_feedback_placeholder')}
                    value={draft.feedback}
                    disabled={disabled}
                    onChange={(e) => onChange({...draft, feedback: e.target.value})}
                />
            </Collapse>
        </div>
    );
}

export default CriterionResultRow;