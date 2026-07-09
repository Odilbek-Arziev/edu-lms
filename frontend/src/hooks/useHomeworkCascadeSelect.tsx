import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {coursesThunks} from "../slices/courses";
import {modulesThunks} from "../slices/modules";
import {lessonsThunks} from "../slices/lessons";

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

    const skipCourseEffect = useRef(!!initial?.course);
    const skipModuleEffect = useRef(!!initial?.module);

    useEffect(() => {
        dispatch(coursesThunks.fetch())
            .then((res: any) => setCourses(res?.results || []));
    }, []);

    useEffect(() => {
        if (skipCourseEffect.current) {
            skipCourseEffect.current = false;

            if (courseId) {
                dispatch(modulesThunks.fetch({course: courseId}))
                    .then((res: any) => setModules(res?.results || []));
            }
            return;
        }

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
        if (skipModuleEffect.current) {
            skipModuleEffect.current = false;
            if (moduleId) {
                dispatch(lessonsThunks.fetch({module: moduleId}))
                    .then((res: any) => setLessons(res?.results || []));
            }
            return;
        }

        setLessonId(null);
        setLessons([]);

        if (moduleId) {
            dispatch(lessonsThunks.fetch({module: moduleId}))
                .then((res: any) => setLessons(res?.results || []));
        }
    }, [moduleId]);

    const coursesOptions = courses.map((c: any) => ({value: c.id, label: c.title}));
    const modulesOptions = modules.map((m: any) => ({value: m.id, label: m.title}));
    const lessonsOptions = lessons.map((l: any) => ({value: l.id, label: l.title}));

    const ready =
        coursesOptions.length > 0 &&
        (!moduleId || modulesOptions.length > 0) &&
        (!lessonId || lessonsOptions.length > 0);

    return {
        courseId, moduleId, lessonId,
        setCourseId, setModuleId, setLessonId,
        coursesOptions, modulesOptions, lessonsOptions,
        ready,
        reset: () => {
            setCourseId(null);
            setModuleId(null);
            setLessonId(null);
        },
    };
}