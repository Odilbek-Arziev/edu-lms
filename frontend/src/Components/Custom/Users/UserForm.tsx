import React from 'react'
import {Button, Form, FormFeedback, Input, Label, Spinner} from "reactstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import {useSelector} from "react-redux";
import {RootState} from "../../../slices";
import {FormProps} from "../../../types/crud";
import {withTranslation} from "react-i18next";


function UserForm({onSubmit, onCancel, loader, initialValues, action, t}: FormProps) {
    const roles = useSelector((state: RootState) => state.Roles.items);
    const rolesOptions = roles.map((item: any) => ({
        value: item.id,
        label: item.name,
    }))

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues ?? {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: null,
            telegram_link: null,
            groups_ids: []
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required(t('enter_first_name')),
            last_name: Yup.string().optional(),
            email: Yup.string().required(t('enter_email')),
            phone_number: Yup.string().nullable().notRequired(),
            telegram_link: Yup.string().nullable().notRequired(),
            groups_ids: Yup.array()
                .of(Yup.number())
                .nullable()
                .notRequired()
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <p className="fw-bold fs-5">{t(action, {item: t('user')})}</p>
            <div className="mb-3">
                <Label htmlFor="first_name" className="form-label">{t('first_name')}</Label>
                <Input
                    name="first_name"
                    className="form-control"
                    placeholder={t('enter_first_name')}
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
                <Label htmlFor="last_name" className="form-label">{t('last_name')}</Label>
                <Input
                    name="last_name"
                    className="form-control"
                    placeholder={t('enter_last_name')}
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
                <Label htmlFor="email" className="form-label">{t('email')}</Label>
                <Input
                    name="email"
                    className="form-control"
                    placeholder={t('enter_email')}
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
            <div className="mb-3">
                <Label htmlFor="phone_number" className="form-label">{t('phone')}</Label>
                <Input
                    name="phone_number"
                    className="form-control"
                    placeholder={t('enter_phone_number')}
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

            <div className="mb-3">
                <Label htmlFor="groups_ids" className="form-label">{t('select_role')}</Label>
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

export default withTranslation()(UserForm);