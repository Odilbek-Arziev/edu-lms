import React from 'react'
import {Button, Form, FormFeedback, Input, Label} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useSelector} from "react-redux";
import {flattenMenu} from "../../utils/flatten";
import FeatherIcon from "feather-icons-react";
import Select from "react-select"


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
        initialValues: {
            title: '',
            parent: null,
            urlPath: '',
            icon: null,
            roles: []
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Please Enter Title"),
            parent: Yup.number().optional(),
            urlPath: Yup.string().optional(),
            icon: Yup.string().required("Please select icon"),
            roles: Yup.array()
                .of(Yup.number())
                .min(1, "Please select at least 1 role")
        }),
        onSubmit: onSubmit
    });

    const iconOptions = icons.map((item: any) => ({
        value: item.name,
        label: (
            <div className="d-flex align-items-center gap-2">
                <FeatherIcon icon={item.name} size={14}/>
                <span>{item.name}</span>
            </div>
        )
    }))

    const parentOptions = menuItems.map((item: any) => ({
        value: item.id,
        label: item.title,
    }))

    const rolesOptions = roles.map((item: any) => ({
        value: item.id,
        label: item.name,
    }))

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
                <Select
                    options={parentOptions}
                    onChange={(opt: any) =>
                        validation.setFieldValue('parent', opt?.value)
                    }
                />
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
                <Select
                    options={iconOptions}
                    onChange={(opt: any) =>
                        validation.setFieldValue('icon', opt?.value)
                    }
                />
                {validation.touched.icon && validation.errors.icon && (
                    <FormFeedback>{validation.errors.icon}</FormFeedback>
                )}
            </div>

            <div className="mb-3">
                <Label htmlFor="roles" className="form-label">Roles</Label>
                <Select
                    isMulti
                    options={rolesOptions}
                    value={rolesOptions.filter((opt: any) =>
                        validation.values.roles.includes(opt.value)
                    )}
                    onChange={(selected: any) =>
                        validation.setFieldValue(
                            'roles',
                            selected ? selected.map((opt: any) => opt.value) : []
                        )
                    }
                    onBlur={() => validation.setFieldTouched('roles', true)}
                />
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
