import {LiveSession} from "./LiveSession";

export interface KPICardsProps {
    loading: boolean;
    submissions: any[];
    liveSessions: LiveSession[];
    studentsCount: number;
    newStudentsWeek: number | null;
    coursesActive: number;
    coursesTotal: number;
    submissionsCount: number;
}