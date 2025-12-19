import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";


interface UserFormProps {
    onSubmit: (data: any, actions: any) => Promise<void>
    onCancel: () => void,
    loader: boolean,
    initialValues?: any,
    title: string
}

export default function UserForm({onSubmit, onCancel, loader, initialValues, title}: UserFormProps) {
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            first_name: '',
            last_name: '',
            email: '',
            is_staff: '',
            phone_number: '',
            telegram_link: '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required("Please enter first name"),
            last_name: Yup.string().required("Please enter last name"),
            email: Yup.string().required("Please enter email address"),
            is_staff: Yup.boolean(),
            phone_number: Yup.string().optional(),
            telegram_link: Yup.string().optional()
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{title}</p>
            <div className="mb-3">
                <Label htmlFor="first_name" className="form-label">First Name</Label>
                <Input
                    name="first_name"
                    className="form-control"
                    placeholder="Enter First Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.first_name || ""}
                    invalid={!!(validation.touched.first_name && validation.errors.first_name)}
                />
                {validation.touched.first_name && validation.errors.first_name ? (
                    <FormFeedback
                        type="invalid">{validation.errors.first_name}</FormFeedback>
                ) : null}
            </div>
            <div className="mb-3">
                <Label htmlFor="last_name" className="form-label">Last Name</Label>
                <Input
                    name="last_name"
                    className="form-control"
                    placeholder="Enter Last Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.last_name || ""}
                    invalid={!!(validation.touched.last_name && validation.errors.last_name)}
                />
                {validation.touched.last_name && validation.errors.last_name ? (
                    <FormFeedback
                        type="invalid">{validation.errors.last_name}</FormFeedback>
                ) : null}
            </div>
            <div className="mb-3">
                <Label htmlFor="email" className="form-label">Email</Label>
                <Input
                    name="email"
                    className="form-control"
                    placeholder="Enter Email"
                    type="email"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email || ""}
                    invalid={!!(validation.touched.email && validation.errors.email)}
                />
                {validation.touched.email && validation.errors.email ? (
                    <FormFeedback
                        type="invalid">{validation.errors.email}</FormFeedback>
                ) : null}
            </div>
            <div className="form-check mb-3">
                <Input
                    type="checkbox"
                    name="is_staff"
                    id="is_staff"
                    className="form-check-input"
                    checked={!!validation.values.is_staff}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                />
                <Label htmlFor="is_staff" className="form-check-label">
                    Is Staff
                </Label>
            </div>
            <div className="mb-3">
                <Label htmlFor="phone_number" className="form-label">Phone number</Label>
                <Input
                    name="phone_number"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.phone_number || ""}
                    invalid={!!(validation.touched.phone_number && validation.errors.phone_number)}
                />
                {validation.touched.phone_number && validation.errors.phone_number ? (
                    <FormFeedback
                        type="invalid">{validation.errors.phone_number}</FormFeedback>
                ) : null}
            </div>
            <div className="mb-3">
                <Label htmlFor="telegram_link" className="form-label">
                    Telegram
                </Label>

                <div className="input-group">
                    <span className="input-group-text">
                        https://t.me/
                    </span>

                    <Input
                        name="telegram_link"
                        type="text"
                        placeholder="username"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.telegram_link || ""}
                        invalid={!!(validation.touched.telegram_link && validation.errors.telegram_link)}
                    />
                </div>

                {validation.touched.telegram_link && validation.errors.telegram_link ? (
                    <FormFeedback type="invalid" className="d-block">
                        {validation.errors.telegram_link}
                    </FormFeedback>
                ) : null}
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
