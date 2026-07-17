import {Badge, Button, Card, CardBody} from "reactstrap";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import {dayLabel, fmtTime, untilText} from "../../../../utils/dashboard";
import {UpcomingLiveSessionsProps} from "../../../../types/UpcomingLiveSessionsProps";

export default function UpcomingLiveSessions({loading, liveSessions}: UpcomingLiveSessionsProps) {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <Card>
            <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                    {t("upcoming_live_sessions")}
                    <Badge color="info" className="bg-info-subtle text-info">
                        {liveSessions.length}
                    </Badge>
                </h5>
                <Button
                    color="link"
                    size="sm"
                    className="p-0"
                    onClick={() => navigate("/live-sessions")}
                >
                    {t("calendar")} →
                </Button>
            </div>
            <CardBody className="p-0">
                {liveSessions.length === 0 && !loading && (
                    <div className="text-center text-muted py-5">
                        <FeatherIcon icon="video-off" size={28} className="mb-2 opacity-50"/>
                        <p className="mb-0">{t("no_upcoming_sessions")}</p>
                    </div>
                )}
                <ul className="list-group list-group-flush">
                    {liveSessions.slice(0, 5).map((s: any) => {
                        const d = new Date(s.scheduled_at);
                        const day = dayLabel(d, t);
                        const isToday = day === t("today");
                        const minTo = (d.getTime() - Date.now()) / 6e4;
                        const isSoon = minTo >= 0 && minTo <= 60;
                        const until = untilText(d, t);

                        return (
                            <li key={s.id}
                                className="list-group-item d-flex align-items-center gap-3 py-3">
                                <div
                                    className={`text-center rounded px-2 py-1 flex-shrink-0 ${isToday ? "bg-success-subtle" : "bg-light"}`}
                                    style={{minWidth: 58}}>
                                    <div
                                        className={`fs-11 text-uppercase fw-bold ${isToday ? "text-success" : "text-muted"}`}>
                                        {day}
                                    </div>
                                    <div className="fw-bold">{fmtTime(d)}</div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h6 className="mb-0 text-truncate">{s.title}</h6>
                                    <p className="text-muted mb-0 fs-13 text-truncate">
                                        {s.course?.title}
                                        {s.teacher && ` · ${s.teacher.first_name ?? ""} ${s.teacher.last_name ?? ""}`.trimEnd()}
                                    </p>
                                </div>
                                <div className="d-flex flex-column align-items-end gap-1 flex-shrink-0">
                                    {isSoon ? (
                                        <Badge color="danger" className="bg-danger-subtle text-danger">
                                            ● {until}
                                        </Badge>
                                    ) : until ? (
                                        <Badge color="warning"
                                               className="bg-warning-subtle text-warning">
                                            {until}
                                        </Badge>
                                    ) : (
                                        <Badge color="light" className="bg-light text-muted">
                                            {s.duration_minutes} мин
                                        </Badge>
                                    )}
                                    {isSoon && s.link && (
                                        <a href={s.link} target="_blank" rel="noreferrer"
                                           className="btn btn-success btn-sm">
                                            {t("join")}
                                        </a>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </CardBody>
        </Card>
    )
}