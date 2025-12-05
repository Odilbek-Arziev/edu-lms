import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form} from "reactstrap";

//redux
import {useSelector, useDispatch} from "react-redux";

import {Link} from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import {useFormik} from "formik";

// action
import {userForgetPassword} from "../../slices/thunks";

// import images
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import {createSelector} from "reselect";
import {resetForgetPassword} from "../../slices/auth/forgetpwd/reducer";
import ReCAPTCHA from "react-google-recaptcha";
import {emailLinkLogin} from "../../slices/auth/email_login/thunk";


const Swal = require("sweetalert2");

const ForgetPasswordPage = (props: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<any>();
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)

    const onCaptchaChange = (token: string | null) => {
        setCaptchaToken(token)
    }

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Введите корректный email")
                .required("Пожалуйста, введите ваш email"),
        }),
        onSubmit: async (values) => {
            if (!captchaToken) {
                Swal.fire('Ошибка', 'Подтвердите, что вы не робот', 'error');
                return;
            }

            setIsLoading(true);

            try {
                const payload = {
                    ...values,
                    captcha: captchaToken,
                };
                await dispatch(userForgetPassword(payload, props.history));
            } finally {
                setIsLoading(false);
            }
        },
    });

    const selectLayoutProperties = createSelector(
        (state: any) => state.ForgetPassword,
        (state) => ({
            forgetError: state.forgetError,
            forgetSuccessMsg: state.forgetSuccessMsg,
        })
    );

    const {forgetError, forgetSuccessMsg} = useSelector(selectLayoutProperties);

    // Очищаем состояние при размонтировании компонента
    useEffect(() => {
        return () => {
            dispatch(resetForgetPassword());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isLoading) {
            Swal.fire({
                title: "Отправка письма...",
                text: "Пожалуйста, подождите",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        } else {
            Swal.close();
            // Сбрасываем форму только при успешной отправке
            if (forgetSuccessMsg) {
                validation.resetForm();
            }
        }
    }, [isLoading, forgetSuccessMsg]);

    document.title = "Сброс пароля | Velzon";

    return (
        <ParticlesAuth>
            <div className="auth-page-content">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-4 text-white-50">
                                <div>
                                    <Link to="/" className="d-inline-block auth-logo">
                                        <img src={logoLight} alt="" height="20"/>
                                    </Link>
                                </div>
                                <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                            </div>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="mt-4">
                                <CardBody className="p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">Забыли пароль?</h5>
                                        <p className="text-muted">Сбросить пароль</p>
                                        <i className="ri-mail-send-line display-5 text-success mb-3"/>
                                    </div>

                                    {(!forgetSuccessMsg && !forgetError) && (
                                        <Alert className="border-0 alert-warning text-center mb-2 mx-2" role="alert">
                                            Введите ваш email и инструкции будут отправлены вам!
                                        </Alert>
                                    )}

                                    <div className="p-2">
                                        {forgetError && (
                                            <Alert color="danger" style={{marginTop: "13px"}}>
                                                {forgetError}
                                            </Alert>
                                        )}
                                        {forgetSuccessMsg && (
                                            <Alert color="success" style={{marginTop: "13px"}}>
                                                {forgetSuccessMsg}
                                            </Alert>
                                        )}

                                        <Form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                            }}
                                        >
                                            <div className="mb-4">
                                                <Label className="form-label">Email</Label>
                                                <Input
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Введите email"
                                                    type="email"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.email || ""}
                                                    invalid={
                                                        !!(validation.touched.email && validation.errors.email)
                                                    }
                                                />
                                                {validation.touched.email && validation.errors.email && (
                                                    <FormFeedback type="invalid">
                                                        <div>{validation.errors.email}</div>
                                                    </FormFeedback>
                                                )}
                                            </div>

                                            <div className="text-center mt-4">
                                                <button
                                                    className="btn btn-success w-100"
                                                    type="submit"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "Отправка..." : "Отправить ссылку для сброса"}
                                                </button>
                                            </div>
                                            <div className="mt-4 d-flex justify-content-center">
                                                <ReCAPTCHA
                                                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!}
                                                    onChange={onCaptchaChange}
                                                />
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-4 text-center">
                                <p className="mb-0">
                                    Постойте, я помню свой пароль...{" "}
                                    <Link to="/login" className="fw-semibold text-primary text-decoration-underline">
                                        Нажмите здесь
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

ForgetPasswordPage.propTypes = {
    history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);