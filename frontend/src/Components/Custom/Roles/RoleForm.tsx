import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";
import {withTranslation} from "react-i18next";
import {FormProps} from "../../../types/crud";


function RoleForm({onSubmit, onCancel, loader, initialValues, action, t}: FormProps) {
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            name: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t('enter_name')),
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('role_item')})}</p>
            <div className="mb-3">
                <Label htmlFor="name" className="form-label">{t('name')}</Label>
                <Input
                    name="name"
                    className="form-control"
                    placeholder={t('enter_title')}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={!!(validation.touched.name && validation.errors.name)}
                />
                {validation.touched.name && validation.errors.name ? (
                    <FormFeedback
                        type="invalid">{validation.errors.name}</FormFeedback>
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

export default withTranslation()(RoleForm);