import React, {useEffect, useState} from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import FeatherIcon from "feather-icons-react";
import {FormProps} from "../../../types/crud";
import {useDispatch} from "react-redux";
import {lessonsThunks} from "../../../slices/lessons/reducer";
import {withTranslation} from "react-i18next";
import {useTranslation} from "react-i18next";

type InputType = 'url' | 'file';

function MaterialForm({onSubmit, onCancel, loader, initialValues, action}: FormProps) {
    const {t} = useTranslation();
    const dispatch = useDispatch<any>();
    const [lessons, setLessons] = useState<any[]>([]);
    const [lessonsLoaded, setLessonsLoaded] = useState(false);
    const [inputType, setInputType] = useState<InputType>('url');

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            title: '',
            description: '',
            lesson_id: null,
            url: '',
            file: null,
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.title) errors.title = t('enter_title');
            if (!values.lesson_id) errors.lesson_id = t('select_lesson');

            if (inputType === 'url' && !values.url) {
                errors.url = t('enter_url');
            }
            if (inputType === 'file' && !values.file) {
                errors.file = t('load_file');
            }

            return errors;
        },
        onSubmit
    });

    useEffect(() => {
        dispatch(lessonsThunks.fetch({})).then((res: any) => {
            setLessons(res?.results || []);
            setLessonsLoaded(true);
        });
    }, []);

    function switchInputType(type: InputType) {
        setInputType(type);

        if (type === 'url') {
            validation.setFieldValue('file', null);
            validation.setFieldTouched('file', false);
        } else {
            validation.setFieldValue('url', '');
            validation.setFieldTouched('url', false);
        }
    }

    if (!lessonsLoaded) return <Spinner/>;

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('material_item')})}</p>

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
                    rows={4}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.description || ""}
                    invalid={!!(validation.touched.description && validation.errors.description)}
                />
                <FormFeedback>{validation.errors.description}</FormFeedback>
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('lesson')}</Label>
                <Input
                    type="select"
                    name="lesson_id"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.lesson_id || ""}
                    invalid={!!(validation.touched.lesson_id && validation.errors.lesson_id)}
                >
                    <option value="">{t('select_lesson')}</option>
                    {lessons.map((lesson: any) => (
                        <option key={lesson.id} value={lesson.id}>
                            {lesson.title}
                        </option>
                    ))}
                </Input>
                <FormFeedback>{validation.errors.lesson_id}</FormFeedback>
            </div>

            <div className="mb-3">
                <Label className="form-label">{t('source')}</Label>
                <div className="d-flex gap-2 mb-2">
                    <Button
                        type="button"
                        size="sm"
                        color={inputType === 'url' ? 'primary' : 'outline-primary'}
                        onClick={() => switchInputType('url')}
                    >
                        {t('url')}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        color={inputType === 'file' ? 'primary' : 'outline-primary'}
                        onClick={() => switchInputType('file')}
                    >
                        {t('file')}
                    </Button>
                </div>

                {inputType === 'url' ? (
                    <>
                        <Input
                            name="url"
                            placeholder={t('enter_url')}
                            type="url"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.url || ""}
                            invalid={!!(validation.touched.url && validation.errors.url)}
                        />
                        <FormFeedback>{validation.errors.url}</FormFeedback>
                    </>
                ) : (
                    <>
                        <Input
                            name="file"
                            type="file"
                            onChange={(e: any) => {
                                validation.setFieldValue('file', e.currentTarget.files?.[0] || null);
                            }}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.file && validation.errors.file)}
                        />
                        <FormFeedback>{validation.errors.file}</FormFeedback>
                    </>
                )}
            </div>

            <Button color="success" className="d-flex gap-1 align-items-center" type="submit" disabled={loader}>
                {loader && <Spinner size="sm">{t('loading')}...</Spinner>}
                <FeatherIcon icon="plus" size={12}/>
                {t('submit')}
            </Button>
        </Form>
    )
}

export default withTranslation()(MaterialForm);