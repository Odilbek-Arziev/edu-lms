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

import {Link} from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
// Formik validation
import * as Yup from "yup";
import {useFormik} from "formik";

// actions
import {loginUser, socialLogin, resetLoginFlag} from "../../slices/thunks";

import logoLight from "../../assets/images/logo-light.png";
import {createSelector} from 'reselect';

const Swal = require("sweetalert2");

const Login = (props: any) => {
    const dispatch = useDispatch<any>();
    const selectLayoutState = (state: any) => state;
    const loginpageData = createSelector(
        selectLayoutState,
        (state) => ({
            user: state.Account.user,
            error: state.Login.error,
            errorMsg: state.Login.errorMsg,
        })
    );
    // Inside your component
    const {
        user, error, errorMsg
    } = useSelector(loginpageData);

    const [userLogin, setUserLogin] = useState<any>([]);
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);

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

    const login = async (data: any) => {
        setLoader(true);
        try {
            const result: any = await dispatch(loginUser(data, props.router.navigate));
            if (result?.non_field_errors) {
                await Swal.fire({
                    title: "Ошибка",
                    text: result.non_field_errors[0],
                    icon: "error",
                });
                return;
            }
        } catch (e: any) {
            console.log(e);

            const errorMessage = e.response?.data?.non_field_errors?.[0] || "Ошибка. Попробуйте снова";

            await Swal.fire({
                title: "Ошибка",
                text: errorMessage,
                icon: "error",
            });
        } finally {
            setLoader(false);
        }
    };

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            login: userLogin.email,
            password: userLogin.password,
        },
        validationSchema: Yup.object({
            login: Yup.string().required("Please Enter Your Email or Username"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: (values) => {
            login(values);
        }
    });

    const signIn = (type: any) => {
        dispatch(socialLogin(type, props.router.navigate));
    };

    //handleTwitterLoginResponse
    // const twitterResponse = e => {}

    //for facebook and google authentication
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

    document.title = "Basic SignIn | Velzon - React Admin & Dashboard Template";
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
                                            <h5 className="text-primary">Welcome Back !</h5>
                                            <p className="text-muted">Sign in to continue to Velzon.</p>
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
                                                    <Label htmlFor="login" className="form-label">Email or
                                                        Username</Label>
                                                    <Input
                                                        name="login"
                                                        className="form-control"
                                                        placeholder="Enter email or username"
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
                                                        <Link to="/forgot-password" className="text-muted">Forgot
                                                            password?</Link>
                                                    </div>
                                                    <Label className="form-label"
                                                           htmlFor="password-input">Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="password"
                                                            value={validation.values.password || ""}
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Enter Password"
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
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Remember
                                                        me</Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success"
                                                            disabled={loader && true}
                                                            className="btn btn-success w-100" type="submit">
                                                        {loader &&
                                                        <Spinner size="sm" className='me-2'> Loading... </Spinner>}
                                                        Sign In
                                                    </Button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title">Sign In with</h5>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            to="#"
                                                            className="btn btn-danger btn-icon me-1"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                socialResponse("google");
                                                            }}
                                                        >
                                                            <i className="ri-google-fill fs-16"/>
                                                        </Link>
                                                        <Link
                                                            to="#"
                                                            className="btn btn-dark btn-icon me-1"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                socialResponse("github");
                                                            }}
                                                        >
                                                            <i
                                                            className="ri-github-fill fs-16"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account ? <Link to="/register"
                                                                                      className="fw-semibold text-primary text-decoration-underline"> Signup </Link>
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

export default withRouter(Login);