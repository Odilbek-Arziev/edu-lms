import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Course} from "../types/Course";
import {coursesThunks} from "../slices/courses";

export function useCourseOptions() {
    const dispatch = useDispatch<any>()
    const [courses, setCourses] = useState<Course[]>([])
    const [coursesLoaded, setCoursesLoaded] = useState(false)

    useEffect(() => {
        dispatch(coursesThunks.fetch()).then((res: any) => {
            setCourses(res?.results || [])
            setCoursesLoaded(true)
        })
    }, [])

    const coursesOptions =
        courses.map((c: Course) => ({value: c.title, label: c.title}))

    return {courses, coursesOptions, coursesLoaded}
}
