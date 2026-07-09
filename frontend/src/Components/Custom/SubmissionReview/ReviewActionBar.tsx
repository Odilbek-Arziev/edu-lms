import React from "react";
import {Button, Input, Label, Spinner} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import {ReviewActionBarProps} from "../../../types/SubmissionReview";


function ReviewActionBar({
                             isReviewed, generalFeedback, onChangeFeedback,
                             saving, onAccept, onReject,
                         }: ReviewActionBarProps) {
    const {t} = useTranslation();

    if (isReviewed) {
        return (
            <div className="border-top p-3">
                {generalFeedback && (
                    <div className="mb-2">
                        <Label className="form-label text-muted small mb-1">
                            {t('general_feedback')}
                        </Label>
                        <p className="mb-0 fs-13">{generalFeedback}</p>
                    </div>
                )}
                <div className="alert alert-secondary mb-0 small d-flex align-items-center gap-2">
                    <FeatherIcon icon="info" size={14}/>
                    {t('already_reviewed_notice')}
                </div>
            </div>
        );
    }

    return (
        <div className="border-top p-3 bg-light">
            <div className="d-flex gap-2 align-items-start flex-wrap">
                <Input
                    type="textarea"
                    rows={1}
                    className="flex-grow-1"
                    style={{minHeight: 38, minWidth: 200, resize: 'vertical'}}
                    placeholder={t('general_feedback_placeholder')}
                    value={generalFeedback}
                    onChange={(e) => onChangeFeedback(e.target.value)}
                />
                <Button
                    color="success"
                    className="d-flex align-items-center gap-1 flex-shrink-0"
                    disabled={saving !== null}
                    onClick={onAccept}
                >
                    {saving === 'accept'
                        ? <Spinner size="sm"/>
                        : <FeatherIcon icon="check" size={14}/>}
                    {t('accept')}
                </Button>
                <Button
                    className="btn btn-soft-danger d-flex align-items-center gap-1 flex-shrink-0"
                    disabled={saving !== null}
                    onClick={onReject}
                >
                    {saving === 'reject'
                        ? <Spinner size="sm"/>
                        : <FeatherIcon icon="x" size={14}/>}
                    {t('reject')}
                </Button>
            </div>
        </div>
    );
}

export default ReviewActionBar;