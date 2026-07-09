import {HomeworkSubmission} from "./HomeworkSubmission";
import {CriterionResultDraft} from "../Components/Custom/Submissions/CriterionResultRow";

export interface TaskInfoCardProps {
    submission: HomeworkSubmission;
    isOverdue: boolean;
}

export interface StudentInfoCardProps {
    submission: HomeworkSubmission;
}

export interface WorkHeaderBarProps {
    title?: string;
    currentIdx: number;
    total: number;
    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    focusMode: boolean;
    onToggleFocus: () => void;
    onClose: () => void;
}

export interface ReviewActionBarProps {
    isReviewed: boolean;
    generalFeedback: string;
    onChangeFeedback: (v: string) => void;
    saving: 'accept' | 'reject' | null;
    onAccept: () => void;
    onReject: () => void;
}

export interface ChecklistCardProps {
    drafts: CriterionResultDraft[];
    isReviewed: boolean;
    metCount: number;
    allMet: boolean;
    progressPct: number;
    progressColor: string;
    onToggleAll: () => void;
    onChangeDraft: (idx: number, next: CriterionResultDraft) => void;
}

export interface QueueCardProps {
    queue: HomeworkSubmission[];
    currentId: number;
    onSelect: (id: number) => void;
}