import React, {useEffect, useState} from 'react';
import {
    Card,
    CardBody,
    Col,
    Container,
    Input,
    Label,
    Row,
    Button,
    Form,
    FormFeedback,
    Alert,
    Spinner
} from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import {useSelector, useDispatch} from "react-redux";

import {Link, useNavigate} from "react-router-dom";
// Formik validation
import * as Yup from "yup";
import {useFormik} from "formik";

// actions
import {loginUser, resetLoginFlag} from "../../slices/thunks";

import logoLight from "../../assets/images/svg/logo.png";
import {createSelector} from 'reselect';
import {HOST_API_URL} from "../../helpers/url_helper";
import {setLoggedinUser} from "../../helpers/api_helper";
import ReCAPTCHA from "react-google-recaptcha";
import {useRecaptcha} from "../../hooks/useRecaptcha";
import {useApiHandler} from "../../hooks/useApiHandler";
import {RootState} from "../../slices";
import withRouter from "../../Components/Common/withRouter";
import {withTranslation} from "react-i18next";

const Login = (props: any) => {
    const {recaptchaRef, executeRecaptcha} = useRecaptcha();
    const [userLogin, setUserLogin] = useState<any>([]);
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const {handleRequest} = useApiHandler(setLoader);
    const navigate = useNavigate()
    const dispatch = useDispatch<any>();

    const selectLayoutState = (state: RootState) => state;
    const loginpageData = createSelector(
        selectLayoutState,
        (state) => ({
            user: state.Account.user,
            error: state.Login.error,
            errorMsg: state.Login.errorMsg,
        })
    );

    const {user, error, errorMsg} = useSelector(loginpageData);

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            login: userLogin.email,
            password: userLogin.password,
        },
        validationSchema: Yup.object({
            login: Yup.string().required(props.t('enter_email_or_username')),
            password: Yup.string().required(props.t('enter_password')),
        }),
        onSubmit: async (values) => {
            const token = await executeRecaptcha();
            if (!token) return;

            const payload = {...values, captcha: token};

            await handleRequest(() => dispatch(loginUser(payload, navigate)));
        }
    });

    const signIn = (type: any) => {
        const width = 600, height = 700;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;
        const authUrl = `${HOST_API_URL}users/social/${type}/`;

        (window as any).socialPopup = window.open(
            authUrl,
            `${type}-auth`,
            `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,location=no,resizable=yes,scrollbars=yes`
        );
    };

    const socialResponse = (type: any) => {
        signIn(type);
    };

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                dispatch(resetLoginFlag());
                setLoader(false)
            }, 3000);
        }
    }, [dispatch, errorMsg]);

    useEffect(() => {
        const channel = new BroadcastChannel("social_auth");

        channel.onmessage = (event: MessageEvent) => {
            const {access, refresh} = event.data || {};

            if (access && refresh) {
                const saved = setLoggedinUser(event.data);

                if (saved) {
                    setTimeout(() => {
                        navigate("/dashboard", {replace: true});
                    }, 300);
                } else {
                    console.error(`❌ ${props.t('error_saving_data')}`);
                }
            }
        };

    }, []);

    useEffect(() => {
        if (user && user) {
            const updatedUserData = process.env.REACT_APP_DEFAULTAUTH === "firebase" ? user.multiFactor.user.email : user.email;
            const updatedUserPassword = process.env.REACT_APP_DEFAULTAUTH === "firebase" ? "" : user.confirm_password;
            setUserLogin({
                email: updatedUserData,
                password: updatedUserPassword
            });
        }
    }, [user]);

    document.title = props.t('login_page')
    return (
        <React.Fragment>
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
                                            <h5 className="text-primary">{props.t('welcome_back')}!</h5>
                                            <p className="text-muted">{props.t('login_to_continue')}.</p>
                                        </div>
                                        {error && error ? (<Alert color="danger"> {error} </Alert>) : null}
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#">

                                                <div className="mb-3">
                                                    <Label htmlFor="login" className="form-label">
                                                        {props.t('email_or_username')}
                                                    </Label>
                                                    <Input
                                                        name="login"
                                                        className="form-control"
                                                        placeholder={props.t('enter_email_or_username')}
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.login || ""}
                                                        invalid={validation.touched.login && validation.errors.login ? true : false}
                                                    />
                                                    {validation.touched.login && validation.errors.login ? (
                                                        <FormFeedback
                                                            type="invalid">{validation.errors.login}</FormFeedback>
                                                    ) : null}
                                                </div>


                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        <Link to="/forgot-password" className="text-muted">
                                                            {props.t('forgot_password')}?
                                                        </Link>
                                                    </div>
                                                    <Label className="form-label"
                                                           htmlFor="password-input">{props.t('password')}</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="password"
                                                            value={validation.values.password || ""}
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder={props.t('enter_password')}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                validation.touched.password && validation.errors.password ? true : false
                                                            }
                                                        />
                                                        {validation.touched.password && validation.errors.password ? (
                                                            <FormFeedback
                                                                type="invalid">{validation.errors.password}</FormFeedback>
                                                        ) : null}
                                                        <button
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                            onClick={() => setPasswordShow(!passwordShow)} type="button"
                                                            id="password-addon"><i
                                                            className="ri-eye-fill align-middle"></i></button>
                                                    </div>
                                                </div>

                                                <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" value=""
                                                           id="auth-remember-check"/>
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">
                                                        {props.t('remember_me')}
                                                    </Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success"
                                                            disabled={loader && true}
                                                            className="btn btn-success w-100" type="submit">
                                                        {loader &&
                                                        <Spinner size="sm"
                                                                 className='me-2'> {props.t('loading')}... </Spinner>}
                                                        {props.t('sign_in')}
                                                    </Button>
                                                </div>
                                                <div className="mt-4 d-flex justify-content-center">
                                                    <ReCAPTCHA
                                                        ref={recaptchaRef}
                                                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!}
                                                        size="invisible"
                                                    />
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title">
                                                            {props.t('sign_in_with')}
                                                        </h5>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            to=""
                                                            className="btn btn-danger btn-icon me-1"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                socialResponse("google");
                                                            }}
                                                        >
                                                            <i className="ri-google-fill fs-16"/>
                                                        </Link>
                                                        <Link
                                                            to=""
                                                            className="btn btn-dark btn-icon me-1"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                socialResponse("github");
                                                            }}
                                                        >
                                                            <i
                                                                className="ri-github-fill fs-16"></i>
                                                        </Link>
                                                        <Link
                                                            to="/email-auth"
                                                            className="btn btn-primary btn-icon me-1"
                                                        >
                                                            <i className="ri-mail-line  fs-16"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">{props.t('no_account')}
                                        ? <Link to="/register"
                                                className="fw-semibold text-primary text-decoration-underline">
                                            {props.t('sign_up')}
                                        </Link>
                                    </p>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default withRouter(withTranslation()(Login));