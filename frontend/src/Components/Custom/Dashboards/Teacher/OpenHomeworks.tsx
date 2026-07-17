import {Badge, Button, Card, CardBody} from "reactstrap";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import {OVERDUE_HOURS, waitedText} from "../../../../utils/dashboard";
import {OpenHomeworksProps} from "../../../../types/OpenHomeworksProps";


export default function OpenHomeworks({loading, submissions, submissionsCount}: OpenHomeworksProps) {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <Card>
            <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                    {t("review_queue")}
                    <Badge color="danger" className="bg-danger-subtle text-danger">
                        {submissionsCount}
                    </Badge>
                </h5>
                <Button color="link" size="sm" className="p-0"
                        onClick={() => navigate("/submissions?status=open")}>
                    {t("all_submissions")} →
                </Button>
            </div>
            <CardBody className="p-0">
                {submissions.length === 0 && !loading && (
                    <div className="text-center text-muted py-5">
                        <FeatherIcon icon="check-circle" size={28} className="mb-2 opacity-50"/>
                        <p className="mb-0">{t("all_submissions_checked")}</p>
                    </div>
                )}
                <ul className="list-group list-group-flush">
                    {submissions.slice(0, 5).map((s) => {
                        const submitted = s.submitted_at ? new Date(s.submitted_at) : null;
                        const overdue = !!submitted &&
                            Date.now() - submitted.getTime() > OVERDUE_HOURS * 36e5;
                        const initials =
                            `${s.student?.first_name?.[0] ?? ""}${s.student?.last_name?.[0] ?? ""}`.toUpperCase();
                        return (
                            <li key={s.id}
                                className="list-group-item d-flex align-items-center gap-3 py-3">
                                <div className="avatar-xs flex-shrink-0">
                                    <span
                                        className="avatar-title bg-primary-subtle text-primary rounded-circle fw-bold">
                                        {initials}
                                    </span>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h6 className="mb-0 text-truncate">
                                        {s.student?.first_name} {s.student?.last_name}
                                    </h6>
                                    <p className="text-muted mb-0 fs-13 text-truncate">
                                        {s.homework?.title}
                                        {s.homework?.lesson?.title && ` · ${s.homework.lesson.title}`}
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-3 flex-shrink-0">
                                    {submitted && (
                                        <span className={`fs-12 ${overdue ? "text-danger fw-bold" : "text-muted"}`}>
                                            {waitedText(new Date(submitted), t)}
                                        </span>
                                    )}
                                    <Button color="primary" size="sm" outline
                                            onClick={() => navigate(`/submissions/${s.id}`)}>
                                        {t("check")}
                                    </Button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </CardBody>
        </Card>
    )
}