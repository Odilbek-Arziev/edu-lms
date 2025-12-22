import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";


interface LanguageLinesProps {
    onSubmit: (data: any, actions: any) => Promise<void>
    onCancel: () => void,
    loader: boolean,
    initialValues?: any,
    title: string
}

export default function LanguageLinesForm({onSubmit, onCancel, loader, initialValues, title}: LanguageLinesProps) {
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
            key: Yup.string().required("Please enter key"),
            value: Yup.object({
                en: Yup.string().required("English translation is required"),
                ru: Yup.string().required("Russian translation is required"),
                uz: Yup.string().required("Uzbek translation is required"),
            })
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{title}</p>
            <div className="mb-3">
                <Label htmlFor="key" className="form-label">Key</Label>
                <Input
                    name="key"
                    className="form-control"
                    placeholder="Enter key"
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
                <Label htmlFor="value.en" className="form-label">English</Label>
                <Input
                   name="value.en"
                    className="form-control"
                    placeholder="Enter English translation"
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
                <Label htmlFor="value.ru" className="form-label">Russian</Label>
                <Input
                    name="value.ru"
                    className="form-control"
                    placeholder="Enter Russian translation"
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
                <Label htmlFor="value.uz" className="form-label">Uzbek</Label>
                <Input
                    name="value.uz"
                    className="form-control"
                    placeholder="Enter Uzbek translation"
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
                        Loading...
                    </Spinner>
                )}
                <FeatherIcon icon="plus" size={12}/>
                Submit
            </Button>
        </Form>
    )
}
