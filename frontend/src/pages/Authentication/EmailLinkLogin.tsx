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
import {withTranslation} from "react-i18next";


const EmailLinkLoginPage = (props: any) => {
    const dispatch = useDispatch<any>();

    const {handleSubmit, isLoading, recaptchaRef} = useRecaptchaSubmit({
        onSubmit: (payload) => dispatch(emailLinkLogin(payload, props.history)),
        onResetForm: () => validation.resetForm(),
        loadingTitle: `${props.t('message_sending')}...`,
        loadingText: props.t('wait'),
        showLoadingModal: true
    });

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {email: ""},
        validationSchema: Yup.object({
            email: Yup.string()
                .email(props.t('enter_valid_email'))
                .required(props.t('enter_email')),
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

    document.title = props.t('email_login_page');

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
                                            {props.t('email_login_page')}
                                        </h5>
                                        <p className="text-muted">
                                            {props.t('passwordless_login')}
                                        </p>
                                        <i className="ri-mail-send-line display-5 text-success mb-3"></i>
                                    </div>

                                    {(!loginSuccessMsg && !loginError) && (
                                        <Alert className="border-0 alert-warning text-center mb-2 mx-2" role="alert">
                                            {props.t('link_will_sent')}
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
                                                <Label className="form-label">{props.t('email')}</Label>
                                                <Input
                                                    name="email"
                                                    className="form-control"
                                                    placeholder={props.t('enter_email')}
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
                                                    {isLoading
                                                        ? `${props.t('message_sending')}...`
                                                        : props.t('send_link')}
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
                                    {props.t('remember_password')}...{" "}
                                    <Link
                                        to="/login"
                                        className="fw-semibold text-primary text-decoration-underline"
                                    >
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

EmailLinkLoginPage.propTypes = {
    history: PropTypes.object,
};

export default withRouter(withTranslation()(EmailLinkLoginPage));