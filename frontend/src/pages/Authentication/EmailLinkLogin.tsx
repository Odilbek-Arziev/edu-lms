import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import {Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form} from "reactstrap";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import * as Yup from "yup";
import {useFormik} from "formik";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import {createSelector} from "reselect";
import {emailLinkLogin} from "../../slices/auth/email_login/thunk";

const Swal = require("sweetalert2");

const EmailLinkLoginPage = (props: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<any>();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {email: ""},
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                await dispatch(emailLinkLogin(values, props.history));
            } finally {
                setIsLoading(false);
            }
        },
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
            validation.resetForm();
        }
    }, [isLoading]);

    document.title = "Reset Password | Velzon - React Admin & Dashboard Template";

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
                                        <h5 className="text-primary">Instant Login via Email</h5>
                                        <i className="ri-mail-send-line display-5 text-success mb-3"></i>
                                    </div>
                                    {!loginSuccessMsg && (
                                        <Alert className="border-0 alert-warning text-center mb-2 mx-2" role="alert">
                                            Enter your email and link will be sent to you!
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
                                                    placeholder="Enter email"
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

                                            <div className="text-center mt-4">
                                                <button className="btn btn-success w-100" type="submit">
                                                    Send Reset Link
                                                </button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-4 text-center">
                                <p className="mb-0">
                                    Wait, I remember my password...{" "}
                                    <Link
                                        to="/login"
                                        className="fw-semibold text-primary text-decoration-underline"
                                    >
                                        Click here
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
