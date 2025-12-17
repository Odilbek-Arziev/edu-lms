import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";


interface RoleFormProps {
    onSubmit: (data: any, actions: any) => Promise<void>
    onCancel: () => void,
    loader: boolean,
    initialValues?: any,
    title: string
}

export default function RoleForm({onSubmit, onCancel, loader, initialValues, title}: RoleFormProps) {
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            name: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Please Enter Name"),
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{title}</p>
            <div className="mb-3">
                <Label htmlFor="name" className="form-label">Name</Label>
                <Input
                    name="name"
                    className="form-control"
                    placeholder="Enter title"
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
                        Loading...
                    </Spinner>
                )}
                <FeatherIcon icon="plus" size={12}/>
                Submit
            </Button>
        </Form>
    )
}
