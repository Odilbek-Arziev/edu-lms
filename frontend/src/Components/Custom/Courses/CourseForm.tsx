import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";
import {withTranslation} from "react-i18next";
import {FormProps} from "../../../types/crud";
import {useSelector} from "react-redux";
import {RootState} from "../../../slices";
import Select from "react-select";


function CourseForm({onSubmit, onCancel, loader, initialValues, action, t}: FormProps) {
    const {languages, levels, categories} = useSelector((state: RootState) => state.Courses);
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            title: '',
            description: '',
            duration: 0,
            language: null,
            price: 0,
            category: null,
            level: null
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t('enter_name')),
            description: Yup.string().optional(),
            duration: Yup.string().required(t('enter_duration')),
            language: Yup.string().required(t('select_lang')),
            price: Yup.string().optional(),
            category: Yup.string().optional(),
            level: Yup.string().optional(),
            icon: Yup.string().optional()
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('course_item')})}</p>
            <div className="mb-3">
                <Label htmlFor="title" className="form-label">{t('name')}</Label>
                <Input
                    name="title"
                    className="form-control"
                    placeholder={t('enter_title')}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.title || ""}
                    invalid={!!(validation.touched.title && validation.errors.title)}
                />
                {validation.touched.title && validation.errors.title ? (
                    <FormFeedback
                        type="invalid">{validation.errors.title}</FormFeedback>
                ) : null}
            </div>
            <div className="mb-3">
                <Label htmlFor="description" className="form-label">{t('description')}</Label>
                <Input
                    name="description"
                    className="form-control"
                    placeholder={t('enter_description')}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.description || ""}
                />
            </div>
            <div className="mb-3">
                <Label htmlFor="duration" className="form-label">{t('duration')}</Label>
                <Input
                    name="duration"
                    className="form-control"
                    placeholder={t('enter_duration')}
                    type="number"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.duration || ""}
                    invalid={!!(validation.touched.duration && validation.errors.duration)}
                />
                {validation.touched.duration && validation.errors.duration ? (
                    <FormFeedback
                        type="invalid">{validation.errors.duration}</FormFeedback>
                ) : null}
            </div>
            <div className="mb-3">
                <Label htmlFor="icon" className="form-label">{t('select_lang')}</Label>
                <Select
                    options={languages}
                    isClearable
                    value={
                        languages.find(
                            (opt: any) => opt.value === validation.values.language
                        ) || null
                    }
                    onChange={(opt: any) =>
                        validation.setFieldValue('language', opt ? opt.value : null)
                    }
                />
                {validation.touched.language && validation.errors.language && (
                    <FormFeedback>{validation.errors.language}</FormFeedback>
                )}
            </div>
            <div className="mb-3">
                <Label htmlFor="price" className="form-label">{t('price')}</Label>
                <Input
                    name="price"
                    className="form-control"
                    placeholder={t('enter_price')}
                    type="number"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.price || ""}
                />
            </div>
            <div className="mb-3">
                <Label htmlFor="category" className="form-label">{t('select_category')}</Label>
                <Select
                    options={categories}
                    isClearable
                    value={
                        categories.find(
                            (opt: any) => opt.value === validation.values.category
                        ) || null
                    }
                    onChange={(opt: any) =>
                        validation.setFieldValue('category', opt ? opt.value : null)
                    }
                />
            </div>
            <div className="mb-3">
                <Label htmlFor="level" className="form-label">{t('select_level')}</Label>
                <Select
                    options={levels}
                    isClearable
                    value={
                        levels.find(
                            (opt: any) => opt.value === validation.values.level
                        ) || null
                    }
                    onChange={(opt: any) =>
                        validation.setFieldValue('level', opt ? opt.value : null)
                    }
                />
            </div>
            <div className="mb-3">
                <Label htmlFor="icon" className="form-label">{t('select_icon')}</Label>
                <Input
                    name="icon"
                    className="form-control"
                    placeholder={t('enter_icon')}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.icon || ""}
                />
            </div>
            <Button className='btn btn-success d-flex gap-1 align-items-center' type='submit' disabled={loader}>
                {loader && (
                    <Spinner size="sm" className="me-2">
                        {t('loading')}...
                    </Spinner>
                )}
                <FeatherIcon icon="plus" size={12}/>
                {t('submit')}
            </Button>
        </Form>
    )
}

export default withTranslation()(CourseForm);