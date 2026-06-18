import {User} from "./User";
import {Course} from "./Course";

export interface LiveSession {
    teacher: User,
    student: User,
    course: Course
    title: string;
    scheduled_at: Date;
    duration_minutes: number;
    link: string;
}