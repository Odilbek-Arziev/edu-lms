import {Card, CardBody, Col, Row, Spinner} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useNavigate} from "react-router-dom";
import {OVERDUE_HOURS, untilText} from "../../../../utils/dashboard";
import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {LiveSession} from "../../../../types/LiveSession";
import {KPICardsProps} from "../../../../types/KPICardsProps";
import {HomeworkSubmission} from "../../../../types/HomeworkSubmission";

export default function KPICards(
    {
        loading,
        submissions,
        liveSessions,
        studentsCount,
        newStudentsWeek,
        coursesActive,
        coursesTotal,
        submissionsCount,
    }: KPICardsProps
) {
    const navigate = useNavigate();
    const {t} = useTranslation();

    const overdueCount = useMemo(
        () => submissions.filter((s: HomeworkSubmission) =>
            s.submitted_at && Date.now() - new Date(s.submitted_at).getTime() > OVERDUE_HOURS * 36e5
        ).length,
        [submissions]
    );

    const todaySessionsCount = useMemo(
        () => liveSessions.filter((s: LiveSession) =>
            new Date(s.scheduled_at).toDateString() === new Date().toDateString()
        ).length,
        [liveSessions]
    );

    const nextSessionIn = liveSessions.length ? untilText(new Date(liveSessions[0].scheduled_at), t) : null;

    const kpiCards = [
        {
            label: t("students"),
            value: studentsCount,
            icon: "users",
            color: "primary",
            to: "/users?role=student",
            meta: newStudentsWeek !== null
                ? t("new_students_week", {count: newStudentsWeek})
                : null,
        },
        {
            label: t("active_courses"),
            value: coursesActive,
            icon: "book-open",
            color: "success",
            to: "/courses",
            meta: t("out_of_total", {count: coursesTotal}),
        },
        {
            label: t("unchecked_submissions"),
            value: submissionsCount,
            icon: "edit-3",
            color: "danger",
            to: "/submissions?status=open",
            meta: overdueCount
                ? <span className="text-danger fw-semibold">
                        <>
                            {overdueCount} {t("waiting", {count: overdueCount})} &gt; {OVERDUE_HOURS} {t("hours_short")}
                        </>
                    </span>
                : t("everything_normal"),
        },
        {
            label: t("live_sessions"),
            value: liveSessions.length,
            icon: "video",
            color: "info",
            to: "/live-sessions",
            meta: todaySessionsCount ? (
                nextSessionIn ? (
                    <>{t("today_with_next_session", {
                        count: todaySessionsCount,
                        time: nextSessionIn,
                    })}</>
                ) : (
                    <>{t("today_sessions_only", {
                        count: todaySessionsCount,
                    })}</>
                )
            ) : (
                nextSessionIn ? (
                    <>{t("next_session", {time: nextSessionIn})}</>
                ) : (
                    <>{t("no_sessions_planned")}</>
                )
            )
        },
    ];

    return (
        <Row>
            {kpiCards.map((k, i) => (
                <Col xl={3} md={6} key={i}>
                    <Card
                        className="card-animate"
                        role="button"
                        onClick={() => navigate(k.to)}
                    >
                        <CardBody>
                            <div className="d-flex align-items-start justify-content-between">
                                <p className="text-uppercase fw-semibold text-muted mb-0 fs-12">
                                    {k.label}
                                </p>
                                <div className="avatar-sm flex-shrink-0">
                                            <span
                                                className={`avatar-title bg-${k.color}-subtle text-${k.color} rounded fs-3 d-flex align-items-center justify-content-center`}>
                                                <FeatherIcon icon={k.icon} size={20}/>
                                            </span>
                                </div>
                            </div>
                            <h2 className="mb-1 mt-2 ff-secondary fw-bold">
                                {loading ? <Spinner size="sm"/> : k.value}
                            </h2>
                            <p className="text-muted mb-0 fs-13">{k.meta}</p>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}