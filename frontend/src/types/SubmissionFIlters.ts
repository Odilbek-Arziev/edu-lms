import {TriState} from "../Components/Custom/Submissions/TriStateSwitch";

export interface SubmissionFilters {
    student: string;
    submittedFrom: string;
    submittedTo: string;
    checked: TriState;
    approved: TriState;
    reworked: TriState;
    checkedFrom: string;
    checkedTo: string;
}