import PropTypes from "prop-types";
import React, {useEffect} from "react";
import {Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form} from "reactstrap";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import * as Yup from "yup";
import {useFormik} from "formik";
import logoLight from "../../assets/images/svg/logo.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import {createSelector} from "reselect";
import {emailLinkLogin} from "../../slices/auth/email_login/thunk";
import {resetEmailLogin} from "../../slices/auth/email_login/reducer";
import ReCAPTCHA from "react-google-recaptcha";
import {useRecaptchaSubmit} from "../../hooks/useRecaptchaSubmit";


const EmailLinkLoginPage = (props: any) => {
    const dispatch = useDispatch<any>();

    const {handleSubmit, isLoading, recaptchaRef} = useRecaptchaSubmit({
        onSubmit: (payload) => dispatch(emailLinkLogin(payload, props.history)),
        onResetForm: () => validation.resetForm(),
        loadingTitle: "Отправка письма...",
        loadingText: "Пожалуйста, подождите",
        showLoadingModal: true
    });

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {email: ""},
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Введите корректный email")
                .required("Пожалуйста, введите ваш email"),
        }),
        onSubmit: handleSubmit
    });

    const selectEmailLoginState = createSelector(
        (state: any) => state.EmailLinkLogin,
        (state) => ({
            loginError: state.loginError,
            loginSuccessMsg: state.loginSuccessMsg,
        })
    );

    const {loginError, loginSuccessMsg} = useSelector(selectEmailLoginState);

    useEffect(() => {
        return () => {
            dispatch(resetEmailLogin());
        };
    }, [dispatch]);

    document.title = "Вход через Email | Velzon";

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
                                <p className="mt-3 fs-15 fw-medium">Online courses for programmers</p>
                            </div>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="mt-4">
                                <CardBody className="p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">Быстрый вход через Email</h5>
                                        <p className="text-muted">Войдите без пароля</p>
                                        <i className="ri-mail-send-line display-5 text-success mb-3"></i>
                                    </div>

                                    {(!loginSuccessMsg && !loginError) && (
                                        <Alert className="border-0 alert-warning text-center mb-2 mx-2" role="alert">
                                            Введите ваш email и ссылка для входа будет отправлена вам!
                                        </Alert>
                                    )}

                                    <div className="p-2">
                                        {loginError && (
                                            <Alert color="danger" style={{marginTop: "13px"}}>
                                                {loginError}
                                            </Alert>
                                        )}
                                        {loginSuccessMsg && (
                                            <Alert color="success" style={{marginTop: "13px"}}>
                                                {loginSuccessMsg}
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
                                                    invalid={!!(validation.touched.email && validation.errors.email)}
                                                />
                                                {validation.touched.email && validation.errors.email && (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.email}
                                                    </FormFeedback>
                                                )}
                                            </div>

                                            <div className="text-center mt-4">
                                                <button
                                                    className="btn btn-success w-100"
                                                    type="submit"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "Отправка..." : "Отправить ссылку для входа"}
                                                </button>
                                            </div>
                                            <div className="mt-4 d-flex justify-content-center">
                                                <ReCAPTCHA
                                                    ref={recaptchaRef}
                                                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!}
                                                    size="invisible"
                                                />
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-4 text-center">
                                <p className="mb-0">
                                    Постойте, я помню свой пароль...{" "}
                                    <Link
                                        to="/login"
                                        className="fw-semibold text-primary text-decoration-underline"
                                    >
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

EmailLinkLoginPage.propTypes = {
    history: PropTypes.object,
};

export default withRouter(EmailLinkLoginPage);