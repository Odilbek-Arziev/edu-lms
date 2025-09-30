import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Card, CardBody, Col, Container, Row, Button} from 'reactstrap';

//import images
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import {maskEmail} from "../../helpers/maskEmail";
import {resendCode, verifyUser} from "../../slices/auth/register/thunk";
import {useDispatch} from "react-redux";

const Swal = require("sweetalert2");

const VerifyEmail = () => {
    let verifyEmail = localStorage.getItem('verifyEmail')

    const initialTime = 90
    const [resend, setResend] = useState(false)
    const [seconds, setSeconds] = useState(initialTime)

    const navigate = useNavigate();
    const dispatch = useDispatch<any>();

    useEffect(() => {
        if (seconds === 0) return

        const timer = setInterval(() => {
            setSeconds((prev: number) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setResend(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [resend])

    const handleSubmit = async () => {
        try {
            Swal.fire({
                title: 'Загрузка...',
                html: 'Пожалуйста, подождите',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const otp =
                getInputElement(1).value +
                getInputElement(2).value +
                getInputElement(3).value +
                getInputElement(4).value;

            const result: any = await dispatch(verifyUser({code: otp, email: verifyEmail}));
            Swal.close()

            if (result?.msg === 'Email confirmed') {
                await Swal.fire({
                    title: "Аккаунт подтвержден",
                    text: `Ваш аккаунт был успешно подтвержден!`,
                    icon: "success",
                    confirmButtonText: "Ок",
                });
                localStorage.removeItem("verifyEmail");
                navigate('/login')
            }
            if (result?.non_field_errors) {
                await Swal.fire({
                    title: "Ошибка",
                    text: result.non_field_errors[0],
                    icon: "error",
                });
                clearInputs();
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
            clearInputs();
        }
    };

    const handleResend = async () => {
        try {
            Swal.fire({
                title: 'Отправка кода...',
                html: 'Пожалуйста, подождите',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            let email = localStorage.getItem('verifyEmail') ?? '';

            const result: any = await dispatch(resendCode(email));

            if (result?.msg === 'Code sent successfully') {
                await Swal.fire({
                    title: "Код отправлен повторно",
                    text: `На почту ${email} отправлен код для подтверждения аккаунта`,
                    icon: "success",
                    confirmButtonText: "Ок",
                });

                setResend(false);
                setSeconds(initialTime);
            }
        } catch (e: any) {
            Swal.close();
            const result = e.response.data

            const fieldErrors = Object.keys(result || {}).map(key => {
                if (Array.isArray(result[key])) {
                    return `${key}: ${result[key].join(", ")}`;
                }
                return null;
            }).filter(Boolean);


            if (fieldErrors.length > 0) {
                await Swal.fire({
                    title: "Ошибка",
                    text: fieldErrors.join("\n"),
                    icon: "error",
                });
                return;
            }
        } finally {
             Swal.close();
        }
    };

    const getInputElement = (index: number): HTMLInputElement => {
        return document.getElementById('digit' + index + '-input') as HTMLInputElement;
    };

    const clearInputs = () => {
        for (let i = 1; i <= 4; i++) {
            const input = document.getElementById(`digit${i}-input`) as HTMLInputElement;
            if (input) input.value = "";
        }
        getInputElement(1).focus();
    };

    const moveToNext = (index: any) => {
        let value = getInputElement(index).value

        if (value.length === 1) {
            if (index !== 4) {
                getInputElement(index + 1).focus();
            } else {
                getInputElement(index).blur();
                handleSubmit()
            }
        }
    }

    const formatTime = (seconds: number) => {
        let minRemain = Math.floor(seconds / 60)
        let secondsRemain = seconds % 60
        return `${minRemain}:${String(secondsRemain).padStart(2, '0')}`
    }

    document.title = "Two Step Verification | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="auth-page-wrapper">
                <ParticlesAuth>
                    <div className="auth-page-content">
                        <Container>
                            <Row>
                                <Col lg={12}>
                                    <div className="text-center mt-sm-5 mb-4 text-white-50">
                                        <div>
                                            <Link to="/dashboard" className="d-inline-block auth-logo">
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
                                            <div className="mb-4">
                                                <div className="avatar-lg mx-auto">
                                                    <div
                                                        className="avatar-title bg-light text-primary display-5 rounded-circle">
                                                        <i className="ri-mail-line"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2 mt-4">
                                                <div className="text-muted text-center mb-4 mx-lg-3">
                                                    <h4>Verify Your Email</h4>
                                                    <p>Please enter the 4 digit code sent to <span
                                                        className="fw-semibold">
                                                        {verifyEmail ? maskEmail(verifyEmail) : ""}
                                                    </span></p>
                                                </div>

                                                <form autoComplete='off'>
                                                    <Row>
                                                        <Col className="col-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="digit1-input"
                                                                       className="visually-hidden">Digit 1</label>
                                                                <input type="text"
                                                                       className="form-control form-control-lg bg-light border-light text-center"
                                                                       maxLength={1}
                                                                       id="digit1-input" onKeyUp={() => moveToNext(1)}/>
                                                            </div>
                                                        </Col>

                                                        <Col className="col-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="digit2-input"
                                                                       className="visually-hidden">Digit 2</label>
                                                                <input type="text"
                                                                       className="form-control form-control-lg bg-light border-light text-center"
                                                                       maxLength={1}
                                                                       id="digit2-input" onKeyUp={() => moveToNext(2)}/>
                                                            </div>
                                                        </Col>

                                                        <Col className="col-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="digit3-input"
                                                                       className="visually-hidden">Digit 3</label>
                                                                <input type="text"
                                                                       className="form-control form-control-lg bg-light border-light text-center"
                                                                       maxLength={1}
                                                                       id="digit3-input" onKeyUp={() => moveToNext(3)}/>
                                                            </div>
                                                        </Col>

                                                        <Col className="col-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="digit4-input"
                                                                       className="visually-hidden">Digit 4</label>
                                                                <input type="text"
                                                                       className="form-control form-control-lg bg-light border-light text-center"
                                                                       maxLength={1}
                                                                       id="digit4-input" onKeyUp={() => moveToNext(4)}/>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </form>
                                                <div className="mt-3">
                                                    <Button color="success" className="w-100">Confirm</Button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <div className="mt-4 text-center">
                                        {
                                            resend ? (
                                                <p className="mb-0">Didn't receive a code ?
                                                    &nbsp;
                                                    <Link to="#"
                                                          onClick={handleResend}
                                                          className="fw-semibold text-primary text-decoration-underline">
                                                        Resend
                                                    </Link>
                                                </p>

                                            ) : (
                                                <p className="mb-0">
                                                    <span>Didn't receive a code ?</span> &nbsp;
                                                    <span
                                                        className='text-secondary'>Available in {formatTime(seconds)}</span>
                                                </p>
                                            )
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </ParticlesAuth>

            </div>
        </React.Fragment>
    );
};

export default VerifyEmail;