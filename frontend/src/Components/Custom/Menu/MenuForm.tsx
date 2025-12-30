import React, {useEffect} from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import FeatherIcon from "feather-icons-react";
import Select from "react-select"
import {flattenMenu} from "../../../utils/flatten";
import {RootState} from "../../../slices";
import {menuThunks} from "../../../slices/menu";
import {rolesThunks} from "../../../slices/roles";
import {iconsThunks} from "../../../slices/icons";
import {withTranslation} from "react-i18next";


interface MenuFormProps {
    onSubmit: (data: any, actions: any) => Promise<void>
    onCancel: () => void,
    loader: boolean,
    initialValues?: any,
    title: string,
    t: (key: string) => string;
}

function MenuForm({onSubmit, onCancel, loader, initialValues, title, t}: MenuFormProps) {
    const dispatch = useDispatch<any>();
    const menu = useSelector((state: RootState) => state.Menu.items);
    const roles = useSelector((state: RootState) => state.Roles.items);
    const icons = useSelector((state: RootState) => state.Icons.items);
    const menuItems = flattenMenu(menu)

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            title: '',
            parent: null,
            url_path: '',
            icon: null,
            groups_ids: []
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t('enter_title')),
            parent: Yup.number().nullable(),
            url_path: Yup.string().optional(),
            icon: Yup.string().required(t('select_icon')),
            groups_ids: Yup.array()
                .of(Yup.number())
                .nullable()
                .notRequired()
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

    useEffect(() => {
        if (!menu?.length) dispatch(menuThunks.fetch());
        if (!roles?.length) dispatch(rolesThunks.fetch({page: 1}));
        if (!icons?.length) dispatch(iconsThunks.fetch());
    }, []);

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(title)}</p>
            <div className="mb-3">
                <Label htmlFor="title" className="form-label">{t('title')} </Label>
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
                <Label htmlFor="parent" className="form-label">{t('parent')}</Label>
                <Select
                    options={parentOptions}
                    isClearable
                    value={
                        parentOptions.find(
                            (opt: any) => opt.value === validation.values.parent
                        ) || null
                    }
                    onChange={(opt: any) =>
                        validation.setFieldValue('parent', opt?.value ?? null)
                    }
                />
                {validation.touched.parent && validation.errors.parent && (
                    <FormFeedback>{validation.errors.parent}</FormFeedback>
                )}
            </div>

            <div className="mb-3">
                <Label htmlFor="url_path" className="form-label">{t('url_path')}</Label>
                <Input
                    name="url_path"
                    className="form-control"
                    placeholder={t('enter_url_path')}
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
                <Label htmlFor="icon" className="form-label">{t('icon')}</Label>
                <Select
                    options={iconOptions}
                    isClearable
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
                <Label htmlFor="roles" className="form-label">{t('roles')}</Label>
                <Select
                    isMulti
                    isClearable
                    options={rolesOptions}
                    value={rolesOptions.filter((opt: any) =>
                        (validation.values.groups_ids || []).includes(opt.value)
                    )}
                    onChange={(selected: any) =>
                        validation.setFieldValue(
                            'groups_ids',
                            selected ? selected.map((opt: any) => opt.value) : []
                        )
                    }
                    onBlur={() => validation.setFieldTouched('groups_ids', true)}
                />
                {validation.touched.groups_ids && validation.errors.groups_ids && (
                    <FormFeedback>{validation.errors.groups_ids}</FormFeedback>
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
export default withTranslation()(MenuForm);