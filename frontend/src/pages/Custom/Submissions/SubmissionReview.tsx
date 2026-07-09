import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {withTranslation} from "react-i18next";
import {Badge, Button, Card, CardBody, Col, Container, Label, Row, Spinner} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SubmissionFilePreview from "../../../Components/Custom/Submissions/SubmissionFilePreview";
import {isSubmissionOverdue, useSubmissionReview} from "../../../hooks/useSubmissionReview";
import {useReviewQueue} from "../../../hooks/useReviewQueue";
import TaskInfoCard from "../../../Components/Custom/SubmissionReview/TaskInfoCard";
import StudentInfoCard from "../../../Components/Custom/SubmissionReview/StudentInfoCard";
import WorkHeaderBar from "../../../Components/Custom/SubmissionReview/WorkHeaderBar";
import ReviewActionBar from "../../../Components/Custom/SubmissionReview/ReviewActionBar";
import ChecklistCard from "../../../Components/Custom/SubmissionReview/ChecklistCard";
import QueueCard from "../../../Components/Custom/SubmissionReview/QueueCard";

const SubmissionReview = (props: any) => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const review = useSubmissionReview(Number(id));
    const queue = useReviewQueue(Number(id));

    const [focusMode, setFocusMode] = useState(false);

    const handleReview = async (isAccepted: boolean) => {
        const ok = await review.submitReview(isAccepted);
        if (!ok) return;

        if (queue.nextSubmission) {
            navigate(`/submissions/${queue.nextSubmission.id}`);
            queue.refresh();
        } else {
            navigate('/submissions');
        }
    };

    document.title = props.t('submission_review_page');

    if (review.loading) {
        return (
            <div className="page-content">
                <Container fluid className="text-center py-5">
                    <Spinner color="primary"/>
                </Container>
            </div>
        );
    }

    const {submission} = review;

    if (!submission) {
        return (
            <div className="page-content">
                <Container fluid>
                    <div className="text-center text-muted py-5">
                        <FeatherIcon icon="alert-circle" size={36} className="mb-2"/>
                        <div className="mb-3">{props.t('submission_not_found')}</div>
                        <Button className="btn btn-light btn-sm" onClick={() => navigate('/submissions')}>
                            <FeatherIcon icon="arrow-left" size={12} className="me-1"/>
                            {props.t('back_to_queue')}
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    const fullName = `${submission.student?.first_name || ''} ${submission.student?.last_name || ''}`.trim();
    const isOverdue = isSubmissionOverdue(submission);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('submission_review')} pageTitle={props.t('submissions')}/>

                    <Row>
                        {!focusMode && (
                            <Col lg={3}>
                                <TaskInfoCard submission={submission} isOverdue={isOverdue}/>
                                <StudentInfoCard submission={submission}/>
                            </Col>
                        )}

                        <Col lg={focusMode ? 12 : 6}>
                            <Card className="mb-3 overflow-hidden">
                                <WorkHeaderBar
                                    title={submission.homework?.title}
                                    currentIdx={queue.currentIdx}
                                    total={queue.queue.length}
                                    hasPrev={!!queue.prevSubmission}
                                    hasNext={!!queue.nextSubmission}
                                    onPrev={() => queue.prevSubmission && navigate(`/submissions/${queue.prevSubmission.id}`)}
                                    onNext={() => queue.nextSubmission && navigate(`/submissions/${queue.nextSubmission.id}`)}
                                    focusMode={focusMode}
                                    onToggleFocus={() => setFocusMode(v => !v)}
                                    onClose={() => navigate('/submissions')}
                                />

                                <CardBody>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                                        <h6 className="mb-0">{fullName}</h6>
                                        <div className="d-flex gap-2">
                                            {isOverdue && (
                                                <Badge className="bg-warning-subtle text-warning">
                                                    <FeatherIcon size={11} icon="alert-triangle" className="me-1"/>
                                                    {props.t('overdue')}
                                                </Badge>
                                            )}
                                            {review.isReviewed && (
                                                <Badge className={`bg-${submission.is_approved ? 'success' : 'danger'}-subtle text-${submission.is_approved ? 'success' : 'danger'}`}>
                                                    <FeatherIcon
                                                        size={11}
                                                        icon={submission.is_approved ? 'check-circle' : 'x-circle'}
                                                        className="me-1"
                                                    />
                                                    {props.t(submission.is_approved ? 'approved' : 'rejected')}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <Label className="form-label text-muted small mb-1">
                                        {props.t('attachments')}
                                    </Label>
                                    <SubmissionFilePreview fileUrl={submission.file}/>
                                </CardBody>

                                <ReviewActionBar
                                    isReviewed={review.isReviewed}
                                    generalFeedback={review.generalFeedback}
                                    onChangeFeedback={review.setGeneralFeedback}
                                    saving={review.saving}
                                    onAccept={() => handleReview(true)}
                                    onReject={() => handleReview(false)}
                                />
                            </Card>
                        </Col>

                        {!focusMode && (
                            <Col lg={3}>
                                <div className="position-sticky" style={{top: 90}}>
                                    <ChecklistCard
                                        drafts={review.drafts}
                                        isReviewed={review.isReviewed}
                                        metCount={review.metCount}
                                        allMet={review.allMet}
                                        progressPct={review.progressPct}
                                        progressColor={review.progressColor}
                                        onToggleAll={review.toggleAllCriteria}
                                        onChangeDraft={review.updateDraft}
                                    />

                                    <QueueCard
                                        queue={queue.queue}
                                        currentId={Number(id)}
                                        onSelect={(sid) => navigate(`/submissions/${sid}`)}
                                    />
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(SubmissionReview);