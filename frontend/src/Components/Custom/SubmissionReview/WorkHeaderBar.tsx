import React from "react";
import {Button} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useTranslation} from "react-i18next";
import {WorkHeaderBarProps} from "../../../types/SubmissionReview";


function WorkHeaderBar({
                           title, currentIdx, total,
                           hasPrev, hasNext, onPrev, onNext,
                           focusMode, onToggleFocus, onClose,
                       }: WorkHeaderBarProps) {
    const {t} = useTranslation();

    return (
        <div className="d-flex align-items-center justify-content-between gap-2 px-3 py-2 bg-primary-subtle">
            <h6 className="mb-0 text-truncate" title={title}>
                {title}
            </h6>
            <div className="d-flex align-items-center gap-1 flex-shrink-0">
                {currentIdx >= 0 && total > 0 && (
                    <>
                        <Button
                            className="btn btn-ghost-primary btn-icon btn-sm"
                            disabled={!hasPrev}
                            onClick={onPrev}
                        >
                            <FeatherIcon icon="chevron-left" size={16}/>
                        </Button>
                        <span className="fs-13 fw-medium px-1">
                            {currentIdx + 1} / {total}
                        </span>
                        <Button
                            className="btn btn-ghost-primary btn-icon btn-sm"
                            disabled={!hasNext}
                            onClick={onNext}
                        >
                            <FeatherIcon icon="chevron-right" size={16}/>
                        </Button>
                    </>
                )}
                <Button
                    className="btn btn-ghost-primary btn-icon btn-sm text-white"
                    title={t('fullscreen')}
                    onClick={onToggleFocus}
                >
                    <FeatherIcon icon={focusMode ? 'minimize-2' : 'maximize-2'} size={14}/>
                </Button>
                <Button
                    className="btn btn-ghost-primary btn-icon btn-sm text-white"
                    title={t('back_to_queue')}
                    onClick={onClose}
                >
                    <FeatherIcon icon="x" size={16}/>
                </Button>
            </div>
        </div>
    );
}

export default WorkHeaderBar;