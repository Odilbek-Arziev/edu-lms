import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";
import {withTranslation} from "react-i18next";
import {FormProps} from "../../../types/crud";
import {useTranslation} from "react-i18next";


function CategoryForm({onSubmit, onCancel, loader, initialValues, action}: FormProps) {
    const {t} = useTranslation();
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            title: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t('enter_title')),
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('category_item')})}</p>
            <div className="mb-3">
                <Label htmlFor="name" className="form-label">{t('name')}</Label>
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

export default withTranslation()(CategoryForm);