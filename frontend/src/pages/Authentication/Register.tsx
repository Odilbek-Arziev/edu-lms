import React, {useState} from "react";
import {
    Row,
    Col,
    CardBody,
    Card,
    Container,
    Input,
    Label,
    Form,
    FormFeedback,
    Button,
    Spinner,
} from "reactstrap";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {registerUser} from "../../slices/thunks";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import ReCAPTCHA from "react-google-recaptcha";
import {useRecaptcha} from "../../hooks/useRecaptcha";
import {useApiHandler} from "../../hooks/useApiHandler";

const Swal = require("sweetalert2");

const Register = () => {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const {recaptchaRef, executeRecaptcha} = useRecaptcha();
    const {handleRequest} = useApiHandler(setLoader);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            username: Yup.string().required("Please Enter Your Username"),
            password: Yup.string().required("Please enter your password"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords do not match")
                .required("Please confirm your password"),
        }),
        onSubmit: async (values) => {
            const token = await executeRecaptcha();

            if (!token) return;

            const payload = {
                ...values,
                captcha: token,
            };

            await handleRequest(
                () => dispatch(registerUser(payload)),
                {
                    onSuccess: async (result: any) => {
                        if (result?.msg === 'created') {
                            await Swal.fire({
                                title: "Подтвердите аккаунт",
                                text: `На почту ${result.user.email} отправлен код для подтвердения аккаунта`,
                                icon: "success",
                                confirmButtonText: "Ок",
                            });

                            localStorage.setItem("verifyEmail", result.user.email);
                            navigate("/verify-email");
                        }
                    }
                }
            );
        }
    });

    document.title = "Basic SignUp | Velzon - React Admin & Dashboard Template";

    return (
        <ParticlesAuth>
            <div className="auth-page-content">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-4 text-white-50">
                                <Link to="/" className="d-inline-block auth-logo">
                                    <img src={logoLight} alt="" height="20"/>
                                </Link>
                                <p className="mt-3 fs-15 fw-medium">
                                    Premium Admin & Dashboard Template
                                </p>
                            </div>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="mt-4">
                                <CardBody className="p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">Create New Account</h5>
                                        <p className="text-muted">
                                            Get your free velzon account now
                                        </p>
                                    </div>

                                    <div className="p-2 mt-4">
                                        <Form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                            }}
                                            className="needs-validation"
                                        >
                                            <div className="mb-3">
                                                <Label>Email <span className="text-danger">*</span></Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter email address"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.email}
                                                    invalid={
                                                        !!(validation.touched.email && validation.errors.email)
                                                    }
                                                />
                                                <FormFeedback>
                                                    {validation.errors.email}
                                                </FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label>Username <span className="text-danger">*</span></Label>
                                                <Input
                                                    name="username"
                                                    type="text"
                                                    placeholder="Enter username"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.username}
                                                    invalid={
                                                        !!(validation.touched.username && validation.errors.username)
                                                    }
                                                />
                                                <FormFeedback>
                                                    {validation.errors.username}
                                                </FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label>Password <span className="text-danger">*</span></Label>
                                                <Input
                                                    name="password"
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.password}
                                                    invalid={
                                                        !!(validation.touched.password && validation.errors.password)
                                                    }
                                                />
                                                <FormFeedback>
                                                    {validation.errors.password}
                                                </FormFeedback>
                                            </div>

                                            <div className="mb-3">
                                                <Label>Confirm Password <span className="text-danger">*</span></Label>
                                                <Input
                                                    name="confirm_password"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.confirm_password}
                                                    invalid={
                                                        !!(
                                                            validation.touched.confirm_password &&
                                                            validation.errors.confirm_password
                                                        )
                                                    }
                                                />
                                                <FormFeedback>
                                                    {validation.errors.confirm_password}
                                                </FormFeedback>
                                            </div>

                                            <div className="mt-4">
                                                <Button
                                                    color="success"
                                                    className="w-100"
                                                    type="submit"
                                                    disabled={loader}
                                                >
                                                    {loader && (
                                                        <Spinner size="sm" className="me-2">
                                                            Loading...
                                                        </Spinner>
                                                    )}
                                                    Sign Up
                                                </Button>
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
                                    Already have an account ?{" "}
                                    <Link
                                        to="/login"
                                        className="fw-semibold text-primary text-decoration-underline"
                                    >
                                        Signin
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

export default Register;