import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";
import {withTranslation} from "react-i18next";
import {FormProps} from "../../../types/crud";


function LanguageLinesForm({onSubmit, onCancel, loader, initialValues, action, t}: FormProps) {
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            key: '',
            value: {
                en: '',
                ru: '',
                uz: '',
            },
        },
        validationSchema: Yup.object({
            key: Yup.string().required(t('enter_key')),
            value: Yup.object({
                en: Yup.string().required(t('is_required', {field: t('eng_trans')})),
                ru: Yup.string().required(t('is_required', {field: t('ru_trans')})),
                uz: Yup.string().required(t('is_required', {field: t('uz_trans')})),
            })
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
           <p className="fw-bold fs-5">{t(action, {item: t('lang_item')})}</p>
            <div className="mb-3">
                <Label htmlFor="key" className="form-label">{t('key')}</Label>
                <Input
                    name="key"
                    className="form-control"
                    placeholder={t('enter_key')}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.key || ""}
                    invalid={!!(validation.touched.key && validation.errors.key)}
                />
                {validation.touched.key && validation.errors.key ? (
                    <FormFeedback
                        type="invalid">{validation.errors.key}</FormFeedback>
                ) : null}
            </div>
            <div className="mb-3">
                <Label htmlFor="value.en" className="form-label">{t('eng')}</Label>
                <Input
                   name="value.en"
                    className="form-control"
                    placeholder={t('enter_value', {value: t('eng_trans')})}
                    type="text"
                    value={validation.values.value.en}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={!!(validation.touched.value?.en && validation.errors.value?.en)}
                />
                {validation.touched.value?.en && validation.errors.value?.en && (
                    <FormFeedback type="invalid">
                        {validation.errors.value.en}
                    </FormFeedback>
                )}
            </div>

            <div className="mb-3">
                <Label htmlFor="value.ru" className="form-label">{t('ru')}</Label>
                <Input
                    name="value.ru"
                    className="form-control"
                    placeholder={t('enter_value', {value: t('ru_trans')})}
                    type="text"
                    value={validation.values.value.ru}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={!!(validation.touched.value?.ru && validation.errors.value?.ru)}
                />
                {validation.touched.value?.ru && validation.errors.value?.ru && (
                    <FormFeedback type="invalid">
                        {validation.errors.value.ru}
                    </FormFeedback>
                )}
            </div>

            <div className="mb-3">
                <Label htmlFor="value.uz" className="form-label">{t('uz')}</Label>
                <Input
                    name="value.uz"
                    className="form-control"
                     placeholder={t('enter_value', {value: t('uz_trans')})}
                    type="text"
                    value={validation.values.value.uz}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={!!(validation.touched.value?.uz && validation.errors.value?.uz)}
                />
                {validation.touched.value?.uz && validation.errors.value?.uz && (
                    <FormFeedback type="invalid">
                        {validation.errors.value.uz}
                    </FormFeedback>
                )}
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
export default withTranslation()(LanguageLinesForm);