import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useSelector} from "react-redux";
import {flattenMenu} from "../../utils/flatten";
import FeatherIcon from "feather-icons-react";
import Select from "react-select"


interface MenuFormProps {
    onSubmit: (data: any, actions: any) => Promise<void>
    onCancel: () => void,
    loader: boolean,
    initialValues?: any
}

export default function MenuForm({onSubmit, onCancel, loader, initialValues}: MenuFormProps) {
    const menu = useSelector((state: any) => state.Menu.items);
    const roles = useSelector((state: any) => state.Roles.items);
    const icons = useSelector((state: any) => state.Icons.items);
    const menuItems = flattenMenu(menu)

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            title: '',
            parent: null,
            url_path: '',
            icon: null,
            groups: []
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Please Enter Title"),
            parent: Yup.number().optional(),
            url_path: Yup.string().optional(),
            icon: Yup.string().required("Please select icon"),
            groups: Yup.array()
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
        <Form onSubmit={validation.handleSubmit}>
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
                    value={
                        parentOptions.find(
                            (opt: any) => opt.value === validation.values.parent
                        ) || null
                    }
                    onChange={(opt: any) =>
                        validation.setFieldValue('parent', opt?.value)
                    }
                />
                {validation.touched.parent && validation.errors.parent && (
                    <FormFeedback>{validation.errors.parent}</FormFeedback>
                )}
            </div>

            <div className="mb-3">
                <Label htmlFor="url_path" className="form-label">Url path</Label>
                <Input
                    name="url_path"
                    className="form-control"
                    placeholder="Enter path"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.url_path || ""}
                    invalid={!!(validation.touched.url_path && validation.errors.url_path)}
                />
                {validation.touched.url_path && validation.errors.url_path ? (
                    <FormFeedback
                        type="invalid">{validation.errors.url_path}</FormFeedback>
                ) : null}
            </div>

            <div className="mb-3">
                <Label htmlFor="icon" className="form-label">Icon</Label>
                <Select
                    options={iconOptions}
                    value={
                        iconOptions.find(
                            (opt: any) => opt.value === validation.values.icon
                        ) || null
                    }
                    onChange={(opt: any) =>
                        validation.setFieldValue('icon', opt ? opt.value : null)
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
                        validation.values.groups.includes(opt.value)
                    )}
                    onChange={(selected: any) =>
                        validation.setFieldValue(
                            'groups',
                            selected ? selected.map((opt: any) => opt.value) : []
                        )
                    }
                    onBlur={() => validation.setFieldTouched('groups', true)}
                />
                {validation.touched.groups && validation.errors.groups && (
                    <FormFeedback>{validation.errors.groups}</FormFeedback>
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
