import React from "react";
import {Card, CardBody, Col, Container, Row} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {withTranslation} from "react-i18next";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PaginationButtons from "../../../Components/Common/PaginationButtons";
import {PER_PAGE} from "../../../constants";
import {useSubmissionsList} from "../../../hooks/useSubmissionsList";
import SubmissionsFilterPanel from "../../../Components/Custom/Submissions/SubmissionsFilterPanel";
import SubmissionsTable from "../../../Components/Custom/Submissions/SubmissionsTable";

const Submissions = (props: any) => {
    const navigate = useNavigate();
    const list = useSubmissionsList();

    document.title = props.t('submissions_page');

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('submissions')} pageTitle={props.t('main')}/>

                    <Row>
                        <Col xl={3} lg={4}>
                            <SubmissionsFilterPanel
                                filters={list.filters}
                                updateFilter={list.updateFilter}
                                resetFilters={list.resetFilters}
                                activeCount={list.activeCount}
                                cascade={list.cascade}
                            />
                        </Col>

                        <Col xl={9} lg={8}>
                            <Card>
                                <CardBody className="px-0 pt-0">
                                    <SubmissionsTable
                                        submissions={list.submissions}
                                        onOpen={(id) => navigate(`/submissions/${id}`)}
                                    />

                                    <div className="px-3">
                                        <PaginationButtons
                                            count={list.totalCount}
                                            currentPage={list.page}
                                            perPageData={PER_PAGE}
                                            setCurrentPage={list.setPage}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Submissions);