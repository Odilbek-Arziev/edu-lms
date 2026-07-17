import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row, Spinner} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useDispatch} from "react-redux";
import {withTranslation} from "react-i18next";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {usersThunks} from "../../../slices/users";
import {coursesThunks} from "../../../slices/courses";
import {homeworkSubmissionsThunk} from "../../../slices/HomeworkSubmissions";
import {liveSessionsThunk} from "../../../slices/liveSessions";
import {HomeworkSubmission} from "../../../types/HomeworkSubmission";
import {extract, fmtTime} from "../../../utils/dashboard";
import KPICards from "../../../Components/Custom/Dashboards/Teacher/KPICards";
import UpcomingLiveSessions from "../../../Components/Custom/Dashboards/Teacher/UpcomingLiveSessions";
import OpenHomeworks from "../../../Components/Custom/Dashboards/Teacher/OpenHomeworks";


const TeacherDashboard = (props: any) => {
    const dispatch: any = useDispatch();

    const [loading, setLoading] = useState(true);
    const [studentsCount, setStudentsCount] = useState(0);
    const [newStudentsWeek, setNewStudentsWeek] = useState<number | null>(null);
    const [coursesActive, setCoursesActive] = useState(0);
    const [coursesTotal, setCoursesTotal] = useState(0);
    const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
    const [submissionsCount, setSubmissionsCount] = useState(0);
    const [liveSessions, setLiveSessions] = useState<any[]>([]);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

    const fetchAll = async () => {
        setLoading(true);

        try {
            const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);

            const [students, newStudents, courses, allCourses, subs, sessions] = await Promise.all([
                dispatch(usersThunks.fetch({skipReduxUpdate: true, role: "student", page_size: 1})),
                dispatch(usersThunks.fetch({
                    skipReduxUpdate: true,
                    role: "student",
                    page_size: 1,
                    date_joined_after: weekAgo
                })),

                dispatch(coursesThunks.fetch({skipReduxUpdate: true, is_public: true, page_size: 1})),
                dispatch(coursesThunks.fetch({skipReduxUpdate: true, page_size: 1})),

                dispatch(homeworkSubmissionsThunk.fetch({
                    skipReduxUpdate: true,
                    status: "open",
                    ordering: "submitted_at"
                })),
                dispatch(liveSessionsThunk.fetch({skipReduxUpdate: true})),
            ]);

            setStudentsCount(extract(students).count);
            setNewStudentsWeek(newStudents ? extract(newStudents).count : null);
            setCoursesActive(extract(courses).count);
            setCoursesTotal(extract(allCourses).count);

            const {list: subsList, count: subsCount} = extract(subs);

            setSubmissions(subsList);
            setSubmissionsCount(subsCount);

            const now = Date.now();
            const upcoming = extract(sessions).list
                .filter((s: any) => new Date(s.scheduled_at).getTime() >= now)
                .sort((a: any, b: any) =>
                    new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

            setLiveSessions(upcoming);
            setUpdatedAt(new Date());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    document.title = props.t("dashboard");

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title={props.t("dashboard")} pageTitle={props.t("main")}/>

                <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
                    {updatedAt && (
                        <span className="text-muted fs-13">
                            обновлено в {fmtTime(updatedAt)}
                        </span>
                    )}
                    <Button color="light" size="sm" onClick={fetchAll} disabled={loading}>
                        {loading
                            ? <Spinner size="sm"/>
                            : <FeatherIcon icon="refresh-cw" size={14} className="me-1"/>}
                        {" "}{props.t("refresh")}
                    </Button>
                </div>

                <KPICards
                    loading={loading}
                    submissions={submissions}
                    liveSessions={liveSessions}
                    studentsCount={studentsCount}
                    newStudentsWeek={newStudentsWeek}
                    coursesActive={coursesActive}
                    coursesTotal={coursesTotal}
                    submissionsCount={submissionsCount}
                />

                <Row>
                    <Col lg={6}>
                        <UpcomingLiveSessions
                            loading={loading}
                            liveSessions={liveSessions}
                        />
                    </Col>

                    <Col lg={6}>
                        <OpenHomeworks
                            loading={loading}
                            submissions={submissions}
                            submissionsCount={submissionsCount}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default withTranslation()(TeacherDashboard);