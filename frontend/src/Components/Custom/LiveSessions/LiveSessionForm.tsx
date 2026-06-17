import React, {useEffect, useState} from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import FeatherIcon from "feather-icons-react";
import {FormProps} from "../../../types/crud";
import {useDispatch} from "react-redux";
import {withTranslation} from "react-i18next";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import {coursesThunks} from "../../../slices/courses/reducer";
import {usersThunks} from "../../../slices/users/reducer";
import Flatpickr from "react-flatpickr";

function LiveSessionForm({onSubmit, onCancel, loader, initialValues, action}: FormProps) {
    const {t} = useTranslation();
    const dispatch = useDispatch<any>();
    const [courses, setCourses] = useState<any[]>([]);
    const [coursesLoaded, setCoursesLoaded] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [studentsLoaded, setStudentsLoaded] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [teachersLoaded, setTeachersLoaded] = useState(false);

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            title: '',
            scheduled_at: null,
            duration_minutes: 0,
            link: '',
            course_id: '',
            teacher_id: '',
            student_ids: [],
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t('enter_title')),
            scheduled_at: Yup.string().required(t('enter_scheduled_at')),
            duration_minutes: Yup.string().required(t('enter_duration_minutes')),
            link: Yup.string().required(t('enter_link')),
            course_id: Yup.string().required(t('select_course')),
            student_ids: Yup.array().min(1, t('select_students')),
            teacher_id: Yup.string().required(t('select_teacher')),
        }),
        onSubmit
    });

    useEffect(() => {
        dispatch(coursesThunks.fetch({})).then((res: any) => {
            setCourses(res?.results || []);
            setCoursesLoaded(true);
        });
    }, []);

    useEffect(() => {
        dispatch(usersThunks.getUsers('student')).then((res: any) => {
            setStudents(res?.results || []);
            setStudentsLoaded(true);
        });
    }, []);

    useEffect(() => {
        dispatch(usersThunks.getUsers('teacher')).then((res: any) => {
            setTeachers(res?.results || []);
            setTeachersLoaded(true);
        });
    }, []);

    if (!coursesLoaded || !studentsLoaded || !teachersLoaded) return <Spinner/>;

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('live_session_item')})}</p>

            <div className="mb-3">
                <Label className="form-label">{t('title')}</Label>
                <Input
                    name="title"
                    placeholder={t('enter_title')}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.title || ""}
                    invalid={!!(validation.touched.title && validation.errors.title)}
                />
                <FormFeedback>{validation.errors.title}</FormFeedback>
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('scheduled_at')}</Label>
                <Flatpickr
                    className={
                        "form-control" +
                        (validation.touched.scheduled_at && validation.errors.scheduled_at ? " is-invalid" : "")
                    }
                    placeholder={t('enter_scheduled_at')}
                    value={validation.values.scheduled_at || ""}
                    options={{
                        enableTime: true,
                        dateFormat: "Y-m-d H:i",
                        time_24hr: true,
                        minDate: "today",
                    }}
                    onChange={(dates: Date[]) => {
                        validation.setFieldValue('scheduled_at', dates[0] ?? null);
                    }}
                    onClose={() => validation.setFieldTouched('scheduled_at', true)}
                />
                {validation.touched.scheduled_at && validation.errors.scheduled_at && (
                    <div className="invalid-feedback d-block">{validation.errors.scheduled_at}</div>
                )}
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('duration_minutes')}</Label>
                <Input
                    name="duration_minutes"
                    placeholder={t('duration_minutes')}
                    type="number"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.duration_minutes || ""}
                    invalid={!!(validation.touched.duration_minutes && validation.errors.duration_minutes)}
                />
                <FormFeedback>{validation.errors.duration_minutes}</FormFeedback>
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('link')}</Label>
                <Input
                    name="link"
                    placeholder={t('enter_link')}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.link || ""}
                    invalid={!!(validation.touched.link && validation.errors.link)}
                />
                <FormFeedback>{validation.errors.link}</FormFeedback>
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('teacher')}</Label>
                <Input
                    type="select"
                    name="teacher_id"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.teacher_id || ""}
                    invalid={!!(validation.touched.teacher_id && validation.errors.teacher_id)}
                >
                    <option value="">{t('select_teacher')}</option>
                    {teachers.map((teacher: any) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.first_name} {teacher.last_name}
                        </option>
                    ))}
                </Input>
                <FormFeedback>{validation.errors.teacher_id}</FormFeedback>
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('course')}</Label>
                <Input
                    type="select"
                    name="course_id"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.course_id || ""}
                    invalid={!!(validation.touched.course_id && validation.errors.course_id)}
                >
                    <option value="">{t('select_course')}</option>
                    {courses.map((course: any) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </Input>
                <FormFeedback>{validation.errors.course_id}</FormFeedback>
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('students')}</Label>
                <Input
                    type="select"
                    multiple
                    name="student_ids"
                    onChange={(e) => {
                        const selected = Array.from(
                            (e.target as unknown as HTMLSelectElement).selectedOptions,
                            (o) => (o as HTMLOptionElement).value
                        );
                        validation.setFieldValue('student_ids', selected);
                    }}
                    onBlur={validation.handleBlur}
                    value={validation.values.student_ids || []}
                    invalid={!!(validation.touched.student_ids && validation.errors.student_ids)}
                >
                    {students.map((student: any) => (
                        <option key={student.id} value={student.id}>
                            {student.first_name} {student.last_name}
                        </option>
                    ))}
                </Input>
                <FormFeedback>{validation.errors.student_ids}</FormFeedback>
            </div>


            <Button color="success" className="d-flex gap-1 align-items-center" type="submit" disabled={loader}>
                {loader && <Spinner size="sm">{t('loading')}...</Spinner>}
                <FeatherIcon icon="plus" size={12}/>
                {t('submit')}
            </Button>
        </Form>
    )
}

export default withTranslation()(LiveSessionForm);