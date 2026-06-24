import React, {useEffect, useState} from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import FeatherIcon from "feather-icons-react";
import {FormProps} from "../../../types/crud";
import {withTranslation} from "react-i18next";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import {useCascadeSelect} from "../../../hooks/useHomeworkCascadeSelect";
import CascadeSelect from "./CascadeSelect";
import CriteriaPicker from "./Criterion/CriteriaPicker";

function HomeworkForm({onSubmit, onCancel, loader, initialValues, action}: FormProps) {
    const {t} = useTranslation();
    const cascade = useCascadeSelect({
        course: initialValues?.course_id != null ? Number(initialValues.course_id) : null,
        module: initialValues?.module_id != null ? Number(initialValues.module_id) : null,
        lesson: initialValues?.lesson_id != null ? Number(initialValues.lesson_id) : null,
    });

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            title: '',
            description: '',
            deadline: null,
            max_attempts: 0,
            lesson_id: '',
            criteria: [],
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t('enter_title')),
            description: Yup.string().required(t('enter_description')),
            deadline: Yup.string().required(t('enter_deadline')),
            max_attempts: Yup.string().optional(),
            lesson_id: Yup.string().required(t('select_lesson')),
            criteria: Yup.array().of(Yup.string().trim().required()).optional(),
        }),
        onSubmit
    });

    useEffect(() => {
        validation.setFieldValue('lesson_id', cascade.lessonId ?? '');
    }, [cascade.lessonId]);

    const isEdit = action === 'update';
    if (isEdit && !cascade.ready) return <Spinner/>;

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('homework_item')})}</p>

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
                <Label className="form-label">{t('description')}</Label>
                <Input
                    name="description"
                    placeholder={t('enter_description')}
                    type="textarea"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.description || ""}
                    invalid={!!(validation.touched.description && validation.errors.description)}
                />
                <FormFeedback>{validation.errors.description}</FormFeedback>
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('deadline')}</Label>
                <Flatpickr
                    className={
                        "form-control" +
                        (validation.touched.deadline && validation.errors.deadline ? " is-invalid" : "")
                    }
                    placeholder={t('enter_deadline')}
                    value={validation.values.deadline || ""}
                    options={{
                        dateFormat: "Y-m-d",
                        minDate: action === 'update' ? undefined : "today",
                    }}
                    onChange={(dates: Date[]) => {
                        validation.setFieldValue('deadline', dates[0] ?? null);
                    }}
                    onClose={() => validation.setFieldTouched('deadline', true)}
                />
                {validation.touched.deadline && validation.errors.deadline && (
                    <div className="invalid-feedback d-block">{validation.errors.deadline}</div>
                )}
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('max_attempts')}</Label>
                <Input
                    name="max_attempts"
                    placeholder={t('max_attempts')}
                    type="number"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.max_attempts || ""}
                    invalid={!!(validation.touched.max_attempts && validation.errors.max_attempts)}
                />
                <FormFeedback>{validation.errors.max_attempts}</FormFeedback>
            </div>

            <CascadeSelect cascade={cascade} layout='column'/>
            <CriteriaPicker
                value={validation.values.criteria}
                onChange={(v) => validation.setFieldValue('criteria', v)}
            />

            <Button color="success" className="d-flex gap-1 align-items-center" type="submit" disabled={loader}>
                {loader && <Spinner size="sm">{t('loading')}...</Spinner>}
                <FeatherIcon icon="plus" size={12}/>
                {t('submit')}
            </Button>
        </Form>
    )
}

export default withTranslation()(HomeworkForm);