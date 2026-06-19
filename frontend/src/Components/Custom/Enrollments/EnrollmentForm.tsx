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
import {enrollmentsTiles} from "../../../common/data/widgets";


function EnrollmentForm({onSubmit, onCancel, loader, initialValues, action}: FormProps) {
    const {t} = useTranslation();
    const dispatch = useDispatch<any>();
    const [courses, setCourses] = useState<any[]>([]);
    const [coursesLoaded, setCoursesLoaded] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [studentsLoaded, setStudentsLoaded] = useState(false);

    const isEdit = action === 'update' || !!initialValues?.id

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            student_id: '',
            course_id: '',
            status: null,
            progress: 0,
            final_grade: 0,
        },
        validationSchema: Yup.object({
            student_id: Yup.string().required(t('select_student')),
            course_id: Yup.string().required(t('select_course')),
            ...(isEdit && {
                status: Yup.string().optional(),
                progress: Yup.number().nullable(),
                final_grade: Yup.number().nullable(),
            })
        }),
        onSubmit
    });

    const statusOptions = enrollmentsTiles?.map((status: any) => ({
        value: status.label,
        label: status.label,
    })) || [];


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

    if (!coursesLoaded || !studentsLoaded) return <Spinner/>;

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('enrollment')})}</p>

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
                <Label className="form-label">{t('student')}</Label>
                <Input
                    type="select"
                    name="student_id"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.student_id || ""}
                    invalid={!!(validation.touched.student_id && validation.errors.student_id)}
                >
                    <option value="">{t('select_student')}</option>
                    {students.map((student: any) => (
                        <option key={student.id} value={student.id}>
                            {student.first_name} {student.last_name}
                        </option>
                    ))}
                </Input>
                <FormFeedback>{validation.errors.course_id}</FormFeedback>
            </div>


            {isEdit && (
                <>
                    <div className="mb-3">
                        <Label className="form-label">{t('status')}</Label>
                        <Input
                            type="select"
                            name="status"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.status || ""}
                            invalid={!!(validation.touched.status && validation.errors.status)}
                        >
                            <option value="">{t('select_status')}</option>
                            {statusOptions.map((status: any) => (
                                <option key={status.label} value={status.value}>
                                    {status.value}
                                </option>
                            ))}
                        </Input>
                        <FormFeedback>{validation.errors.status}</FormFeedback>
                    </div>

                    <div className="mb-3">
                        <Label className="form-label">{t('progress')}</Label>
                        <Input
                            name="progress"
                            placeholder={t('enter_progress')}
                            type="number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.progress ?? ""}
                            invalid={!!(validation.touched.progress && validation.errors.progress)}
                        />
                        <FormFeedback>{validation.errors.progress}</FormFeedback>
                    </div>
                    <div className="mb-3">
                        <Label className="form-label">{t('final_grade')}</Label>
                        <Input
                            name="final_grade"
                            placeholder={t('enter_final_grade')}
                            type="number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.final_grade ?? 0}
                            invalid={!!(validation.touched.final_grade && validation.errors.final_grade)}
                        />
                        <FormFeedback>{validation.errors.final_grade}</FormFeedback>
                    </div>
                </>
            )}

            <Button color="success" className="d-flex gap-1 align-items-center" type="submit" disabled={loader}>
                {loader && <Spinner size="sm">{t('loading')}...</Spinner>}
                <FeatherIcon icon="plus" size={12}/>
                {t('submit')}
            </Button>
        </Form>
    )
}

export default withTranslation()(EnrollmentForm);