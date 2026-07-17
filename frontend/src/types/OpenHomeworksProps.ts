import {HomeworkSubmission} from "./HomeworkSubmission";

export interface OpenHomeworksProps {
    loading: boolean;
    submissions: HomeworkSubmission[];
    submissionsCount: number;
}