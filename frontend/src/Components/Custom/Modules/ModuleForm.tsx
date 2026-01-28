import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";
import {withTranslation} from "react-i18next";
import {FormProps} from "../../../types/crud";


function ModuleForm({onSubmit, onCancel, loader, initialValues, action, t}: FormProps) {
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            title: '',
            description: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t('enter_title')),
            description: Yup.string().required(t('enter_description')),
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('module')})}</p>
            <div className="mb-3">
                <Label htmlFor="title" className="form-label">{t('title')}</Label>
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
                    invalid={!!(validation.touched.description && validation.errors.description)}
                />
                {validation.touched.description && validation.errors.description ? (
                    <FormFeedback
                        type="invalid">{validation.errors.description}</FormFeedback>
                ) : null}
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

export default withTranslation()(ModuleForm);