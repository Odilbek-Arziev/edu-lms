import {Course} from "./Course";
import {User} from "./User";

export interface Enrollment {
    student: User;
    course: Course;
    status: string;
    progress: number;
    grade: number;
}