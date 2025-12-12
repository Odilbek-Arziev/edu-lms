import React from 'react'
import {Button, Form, FormFeedback, Input, Label} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useSelector} from "react-redux";
import {flattenMenu} from "../../utils/flatten";
import FeatherIcon from "feather-icons-react";

interface MenuFormProps {
    onSubmit: (data: any, actions: any) => Promise<void>
    onCancel: () => void
}

export default function MenuForm({onSubmit, onCancel}: MenuFormProps) {
    const menu = useSelector((state: any) => state.Menu.items);
    const roles = useSelector((state: any) => state.Roles.items);
    const icons = useSelector((state: any) => state.Icons.items);
    const menuItems = flattenMenu(menu)

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {},
        validationSchema: Yup.object({
            title: Yup.string().required("Please Enter Title"),
            parent: Yup.number().optional(),
            urlPath: Yup.string().optional(),
            icon: Yup.string().required("Please select icon"),
            roles: Yup.number().required("Please select at least 1 role")
        }),
        onSubmit: onSubmit
    });

    return (
        <Form>
            <div className="mb-3">
                <Label htmlFor="title" className="form-label"> Title</Label>
                <Input
                    name="title"
                    className="form-control"
                    placeholder="Enter title"
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
                <Label htmlFor="parent" className="form-label">Parent</Label>
                <Input
                    type="select"
                    name="parent"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.parent || ""}
                    invalid={!!(validation.touched.parent && validation.errors.parent)}
                >
                    <option value="">Select parent</option>
                    {menuItems.map((item: any) => (
                        <option value={item.id}> {item.title}</option>
                    ))}
                </Input>
                {validation.touched.parent && validation.errors.parent && (
                    <FormFeedback>{validation.errors.parent}</FormFeedback>
                )}
            </div>

            <div className="mb-3">
                <Label htmlFor="path" className="form-label">Url path</Label>
                <Input
                    name="path"
                    className="form-control"
                    placeholder="Enter path"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.urlPath || ""}
                    invalid={!!(validation.touched.urlPath && validation.errors.urlPath)}
                />
                {validation.touched.urlPath && validation.errors.urlPath ? (
                    <FormFeedback
                        type="invalid">{validation.errors.urlPath}</FormFeedback>
                ) : null}
            </div>

            <div className="mb-3">
                <Label htmlFor="icon" className="form-label">Icon</Label>
                <Input
                    type="select"
                    name="icon"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.icon || ""}
                    invalid={!!(validation.touched.icon && validation.errors.icon)}
                >
                    <option value="">Select icon</option>
                    {icons.map((item: any) => (
                        <option value={item.name}>
                            <FeatherIcon icon={item.name} size={12}/>
                            {item.name}
                        </option>
                    ))}
                </Input>
                {validation.touched.icon && validation.errors.icon && (
                    <FormFeedback>{validation.errors.icon}</FormFeedback>
                )}
            </div>

            <div className="mb-3">
                <Label htmlFor="roles" className="form-label">Roles</Label>
                <Input
                    type="select"
                    multiple
                    name="roles"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.roles || ""}
                    invalid={!!(validation.touched.roles && validation.errors.roles)}
                >
                    <option value="">Select role</option>
                    {roles.map((item: any) => (
                        <option value={item.id}>{item.name}</option>
                    ))}
                </Input>
                {validation.touched.roles && validation.errors.roles && (
                    <FormFeedback>{validation.errors.roles}</FormFeedback>
                )}
            </div>
            <Button className='btn btn-success d-flex gap-1 align-items-center' type='submit'>
                <FeatherIcon icon="plus" size={12}/>
                Submit
            </Button>
        </Form>
    )
}
