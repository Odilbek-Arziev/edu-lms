import {SubmissionFilters} from "./SubmissionFIlters";
import {useCascadeSelect} from "../hooks/useCascadeSelect";
import {TriState} from "../Components/Custom/Submissions/TriStateSwitch";

export interface HomeworkCriterionShort {
    id: number;
    text: string;
}

export interface HomeworkShort {
    id: number;
    title: string;
    description: string;
    deadline: string | null;
    max_attempts: number;
    lesson: any;
    criteria: HomeworkCriterionShort[];
}

export interface StudentShort {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
}

export interface SubmissionCriterionResult {
    id: number;
    is_met: boolean;
    feedback: string | null;
    criterion: HomeworkCriterionShort;
    review: number | SubmissionReview | null;
}

export interface SubmissionReview {
    id: number;
    received_at: string;
    is_accepted: boolean;
    general_feedback: string;
    submission: number;
    reviewer: StudentShort;
    criteria_results?: SubmissionCriterionResult[];
}

export interface HomeworkSubmission {
    id: number;
    file: string | null;
    comment_from_student: string;
    student: StudentShort;
    homework: HomeworkShort;
    is_active: boolean;
    previous_submission: number | null;
    is_checked: boolean;
    is_approved: boolean;
    review: SubmissionReview | null;
    submitted_at?: string;
}

export interface DateRangeFilterProps {
    icon: string;
    label: string;
    from: string;
    to: string;
    onChangeFrom: (v: string) => void;
    onChangeTo: (v: string) => void;
}

export interface SubmissionsTableRowProps {
    submission: HomeworkSubmission;
    onOpen: (id: number) => void;
}

export interface SubmissionsFilterPanelProps {
    filters: SubmissionFilters;
    updateFilter: <K extends keyof SubmissionFilters>(key: K, value: SubmissionFilters[K]) => void;
    resetFilters: () => void;
    activeCount: number;
    cascade: ReturnType<typeof useCascadeSelect>;
}

export interface TriStateSwitchProps {
    value: TriState;
    onChange: (v: TriState) => void;
    disabled?: boolean;
    t: (k: string) => string;
}

export interface SubmissionsTableProps {
    submissions: HomeworkSubmission[];
    onOpen: (id: number) => void;
}


export type SubmissionStatusFilter = '' | 'open' | 'checked';
export type SubmissionStateFilter = '' | 'approved' | 'rejected';
export type QueueFilter = 'open' | 'approved' | 'rejected';
