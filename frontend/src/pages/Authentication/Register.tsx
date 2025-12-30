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
import logoLight from "../../assets/images/svg/logo.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import ReCAPTCHA from "react-google-recaptcha";
import {useRecaptcha} from "../../hooks/useRecaptcha";
import {useApiHandler} from "../../hooks/useApiHandler";
import {showSuccess} from "../../utils/swal";
import {withTranslation} from "react-i18next";
import withRouter from "../../Components/Common/withRouter";

const Register = (props: any) => {
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
            email: Yup.string().required(props.t('enter_email')),
            username: Yup.string().required(props.t('enter_username')),
            password: Yup.string().required(props.t('enter_password')),
            confirm_password: Yup.string()
                .oneOf(
                    [Yup.ref("password")],
                    props.t("passwords_mismatch")
                )
                .required(props.t('confirm_password')),
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
                            await showSuccess(
                                props.t("confirm_account"),
                                props.t("code_sent", {email: result.user.email})
                            )

                            localStorage.setItem("verifyEmail", result.user.email);
                            navigate("/verify-email");
                        }
                    }
                }
            );
        }
    });

    document.title = props.t('register_page')

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
                                            {props.t('create_account')}
                                        </h5>
                                        <p className="text-muted">
                                            {props.t('get_account')}
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
                                                <Label>
                                                    {props.t('email')}
                                                    <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder={props.t('enter_email')}
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
                                                <Label>
                                                    {props.t('username')}
                                                    <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    name="username"
                                                    type="text"
                                                    placeholder={props.t('enter_username')}
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
                                                <Label>
                                                    {props.t('password')}
                                                    <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    name="password"
                                                    type="password"
                                                    placeholder={props.t('enter_password')}
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
                                                <Label>
                                                    {props.t('password_confirm')}
                                                    <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    name="confirm_password"
                                                    type="password"
                                                    placeholder={props.t('password_confirm')}
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
                                                            {props.t('loading')}...
                                                        </Spinner>
                                                    )}
                                                    {props.t('sign_up')}
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
                                    {props.t('have_account')}?
                                    <Link
                                        to="/login"
                                        className="fw-semibold text-primary text-decoration-underline"
                                    >
                                        {" "}
                                        {props.t('sign_in')}
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

export default withRouter(withTranslation()(Register));