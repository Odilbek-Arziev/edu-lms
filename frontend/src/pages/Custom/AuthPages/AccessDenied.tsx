import React from "react";
import {Link} from "react-router-dom";
import {Container, Row, Col, Button} from "reactstrap";
import {withTranslation} from "react-i18next";
import FeatherIcon from "feather-icons-react";

const AccessDenied = (props: any) => {
    document.title = props.t("access_denied");

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="auth-page-content">
                    <Container>
                        <Row className="justify-content-center">
                            <Col xl={6}>
                                <div className="text-center pt-4">

                                    {/* Большой 403 с градиентным шейпом, как в Velzon error-pages */}
                                    <div className="error-403-title position-relative">
                                        <h1
                                            className="display-1 fw-semibold mb-0 lh-1"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, var(--vz-danger), var(--vz-warning))",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                                fontSize: "clamp(6rem, 18vw, 10rem)",
                                            }}
                                        >
                                            403
                                        </h1>

                                        {/* Иконка-замок в кружке поверх цифр */}
                                        <div
                                            className="position-absolute top-50 start-50 translate-middle"
                                            style={{opacity: 0.08}}
                                        >
                                            <FeatherIcon
                                                icon="lock"
                                                style={{width: 200, height: 200}}
                                                className="text-danger"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="mb-3">
                                            <span className="avatar-lg mx-auto d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle">
                                                <FeatherIcon
                                                    icon="shield-off"
                                                    className="text-danger"
                                                    style={{width: 36, height: 36}}
                                                />
                                            </span>
                                        </div>

                                        <h3 className="text-uppercase fw-semibold mb-2">
                                            {props.t("access_denied")}
                                        </h3>

                                        <p className="text-muted mb-4 fs-15">
                                            {props.t("access_denied_text")}
                                        </p>

                                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                                            <Link to="/" className="btn btn-success">
                                                <FeatherIcon
                                                    icon="home"
                                                    size={15}
                                                    className="me-1 align-middle"
                                                />
                                                {props.t("back_to_home")}
                                            </Link>

                                            <Button
                                                color="light"
                                                onClick={() => window.history.back()}
                                            >
                                                <FeatherIcon
                                                    icon="arrow-left"
                                                    size={15}
                                                    className="me-1 align-middle"
                                                />
                                                {props.t("go_back")}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(AccessDenied);