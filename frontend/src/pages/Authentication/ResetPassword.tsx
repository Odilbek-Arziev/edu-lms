import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Button, Card, CardBody, Col, Container, Row, Form, Input, Label, FormFeedback} from 'reactstrap';
import logoLight from "../../assets/images/svg/logo.png";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import {useDispatch} from "react-redux";
import {resetPassword} from "../../slices/auth/reset/thunk";
import {useApiHandler} from "../../hooks/useApiHandler";
import {showSuccess} from "../../utils/swal";
import {withTranslation} from "react-i18next";

const ResetPasswordPage = (props: any) => {
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [confrimPasswordShow, setConfrimPasswordShow] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const {handleRequest} = useApiHandler(setLoader);
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch<any>();
    let token = location.state?.token

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, props.t('8_characters'))
                .matches(RegExp('(.*[a-z].*)'), props.t('lowercase_letter'))
                .matches(RegExp('(.*[A-Z].*)'), props.t('uppercase_letter'))
                .matches(RegExp('(.*[0-9].*)'), props.t('one_number'))
                .required(props.t('field_required')),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password'), ""],)
                .required(props.t('confirm_password'))
        }),
        onSubmit: async (values) => {
            const payload = {...values, token};

            await handleRequest(
                () => dispatch(resetPassword(payload, navigate)),
                {
                    onSuccess: async (result: any) => {
                        if (result?.status === "ok") {
                            await showSuccess(
                                props.t('success'),
                                props.t('password_changed')
                            )
                            navigate("/login");
                        }
                    }
                }
            );
        }
    });

    document.title = props.t('set_password_page')

    return (
        <ParticlesAuth>
            <div className="auth-page-content">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-4 text-white-50">
                                <div>
                                    <Link to="/" className="d-inline-block auth-logo">
                                        <img src={logoLight} alt="" width="150"/>
                                    </Link>
                                </div>
                                <p className="mt-3 fs-15 fw-medium">{props.t('slogan')}</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="mt-4">

                                <CardBody className="p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">
                                            {props.t('create_password')}
                                        </h5>
                                        <p className="text-muted">
                                            {props.t('passwords_must_different')}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <Form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                            }}
                                        >
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="password-input">
                                                    {props.t('password')}
                                                </Label>
                                                <div className="position-relative auth-pass-inputgroup">
                                                    <Input
                                                        type={passwordShow ? "text" : "password"}
                                                        className="form-control pe-5 password-input"
                                                        placeholder={props.t('enter_password')}
                                                        id="password-input"
                                                        name="password"
                                                        value={validation.values.password}
                                                        onBlur={validation.handleBlur}
                                                        onChange={validation.handleChange}
                                                        invalid={validation.errors.password && validation.touched.password ? true : false}
                                                        disabled={loader}
                                                    />
                                                    {validation.errors.password && validation.touched.password ? (
                                                        <FormFeedback
                                                            type="invalid">{validation.errors.password}</FormFeedback>
                                                    ) : null}
                                                    <Button color="link" onClick={() => setPasswordShow(!passwordShow)}
                                                            className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                                            type="button"
                                                            id="password-addon"><i
                                                        className="ri-eye-fill align-middle"></i></Button>
                                                </div>
                                                <div id="passwordInput" className="form-text">
                                                    {props.t('8_characters')}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="confirm-password-input">
                                                    {props.t('confirm_password')}
                                                </Label>
                                                <div className="position-relative auth-pass-inputgroup mb-3">
                                                    <Input
                                                        type={confrimPasswordShow ? "text" : "password"}
                                                        className="form-control pe-5 password-input"
                                                        placeholder={props.t('confirm_password')}
                                                        id="confirm-password-input"
                                                        name="confirm_password"
                                                        value={validation.values.confirm_password}
                                                        onBlur={validation.handleBlur}
                                                        onChange={validation.handleChange}
                                                        invalid={validation.errors.confirm_password && validation.touched.confirm_password ? true : false}
                                                        disabled={loader}
                                                    />
                                                    {validation.errors.confirm_password && validation.touched.confirm_password ? (
                                                        <FormFeedback
                                                            type="invalid">{validation.errors.confirm_password}</FormFeedback>
                                                    ) : null}
                                                    <Button color="link"
                                                            onClick={() => setConfrimPasswordShow(!confrimPasswordShow)}
                                                            className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                                            type="button">
                                                        <i className="ri-eye-fill align-middle"></i></Button>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <Button
                                                    color="success"
                                                    className="w-100"
                                                    type="submit"
                                                    disabled={loader}
                                                >
                                                    {loader ? `${props.t('resetting')}...` : props.t('reset_password')}
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                            <div className="mt-4 text-center">
                                <p className="mb-0">{props.t('remember_password')}...
                                    <Link to="/login"
                                          className="fw-semibold text-primary text-decoration-underline"
                                    > {' '}
                                        {props.t('click_here')}
                                    </Link>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ParticlesAuth>
    );
};

export default withTranslation()(ResetPasswordPage);