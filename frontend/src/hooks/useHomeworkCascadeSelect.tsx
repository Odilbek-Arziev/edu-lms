import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {coursesThunks} from "../slices/courses/reducer";
import {modulesThunks} from "../slices/modules/reducer";
import {lessonsThunks} from "../slices/lessons/reducer";

export function useCascadeSelect(initial?: {
    course?: any; module?: any; lesson?: any;
}) {
    const dispatch = useDispatch<any>();

    const [courses, setCourses] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);

    const [courseId, setCourseId] = useState<any>(initial?.course ?? null);
    const [moduleId, setModuleId] = useState<any>(initial?.module ?? null);
    const [lessonId, setLessonId] = useState<any>(initial?.lesson ?? null);

    useEffect(() => {
        dispatch(coursesThunks.fetch())
            .then((res: any) => setCourses(res?.results || []));
    }, []);

    useEffect(() => {
        setModuleId(null);
        setLessonId(null);

        setModules([]);
        setLessons([]);

        if (courseId) {
            dispatch(modulesThunks.fetch({course: courseId}))
                .then((res: any) => setModules(res?.results || []));
        }
    }, [courseId]);

    useEffect(() => {
        setLessonId(null);
        setLessons([]);

        if (moduleId) {
            dispatch(lessonsThunks.fetch({module: moduleId}))
                .then((res: any) => setLessons(res?.results || []));
        }
    }, [moduleId]);

    return {
        courseId, moduleId, lessonId,
        setCourseId, setModuleId, setLessonId,

        coursesOptions: courses.map((c: any) => ({value: c.id, label: c.title})),
        modulesOptions: modules.map((m: any) => ({value: m.id, label: m.title})),
        lessonsOptions: lessons.map((l: any) => ({value: l.id, label: l.title})),

        reset: () => {
            setCourseId(null);
            setModuleId(null);
            setLessonId(null);
        },
    };
}