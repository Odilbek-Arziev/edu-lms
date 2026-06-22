import React, {useEffect, useMemo, useRef, useState} from "react";
import {Badge, Button, Card, CardBody, Col, Container, Row} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SearchInput from "../../../Components/Common/SearchInput";
import CustomSelect from "../../../Components/Common/CustomSelect";
import {withTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useFetchData} from "../../../hooks/useFetchData";
import {closeLoading, showLoading} from "../../../utils/swal";
import {liveSessionsThunk} from "../../../slices/liveSessions/reducer";
import {usersThunks} from "../../../slices/users/reducer";
import {coursesThunks} from "../../../slices/courses/reducer";
import {CourseSimplified} from "../../../types/Course";
import {User} from "../../../types/User";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const LiveSessionsDashboard = (props: any) => {
    const dispatch = useDispatch<any>();
    const calendarRef = useRef<any>(null);

    const [search, setSearch] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [studentFilter, setStudentFilter] = useState<any>(null);
    const [courseFilter, setCourseFilter] = useState<any>(null);

    const {localData: liveSessions, isSearching, fetchData} = useFetchData(
        liveSessionsThunk.fetch,
        'live-sessions',
        () => ({
            ...(search && {search}),
            ...(studentFilter && {student: studentFilter}),
            ...(courseFilter && {course: courseFilter}),
        })
    );


    const studentsOptions = students?.map((s: User) => ({
        value: s.id,
        label: `${s.first_name} ${s.last_name}`,
    })) || [];

    const coursesOptions = courses?.map((c: CourseSimplified) => ({
        value: c.title,
        label: c.title,
    })) || [];

    const calendarEvents = useMemo(() => {
        return (liveSessions || []).map((row: any) => {
            const start = new Date(row.scheduled_at);
            const end = new Date(start.getTime() + (row.duration_minutes || 60) * 60000);
            return {
                id: String(row.id),
                title: row.title,
                start: start.toISOString(),
                end: end.toISOString(),
                extendedProps: {raw: row},
            };
        });
    }, [liveSessions]);

    const stats = useMemo(() => {
        const now = new Date();
        const todayStr = now.toDateString();
        let today = 0;
        let upcoming = 0;
        let past = 0;
        (liveSessions || []).forEach((row: any) => {
            const d = new Date(row.scheduled_at);
            if (d.toDateString() === todayStr) today += 1;
            if (d >= now) upcoming += 1;
            else past += 1;
        });
        return {total: liveSessions?.length || 0, today, upcoming, past};
    }, [liveSessions]);

    const upcomingList = useMemo(() => {
        const now = new Date();
        return (liveSessions || [])
            .filter((row: any) => new Date(row.scheduled_at) >= now)
            .sort((a: any, b: any) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at))
            .slice(0, 6);
    }, [liveSessions]);

    useEffect(() => {
        fetchData();
    }, [search, studentFilter, courseFilter]);

    useEffect(() => {
        if (isSearching) showLoading(props.t('loading'), props.t('wait'));
        else closeLoading();
    }, [isSearching]);

    useEffect(() => {
        dispatch(usersThunks.getUsers('student')).then((res: any) => setStudents(res?.results || []));
        dispatch(coursesThunks.fetch()).then((res: any) => setCourses(res?.results || []));
    }, []);

    document.title = props.t('live-sessions-page');

    const statCards = [
        {label: props.t('total'), value: stats.total, icon: 'video', color: 'primary'},
        {label: props.t('today'), value: stats.today, icon: 'calendar', color: 'success'},
        {label: props.t('upcoming'), value: stats.upcoming, icon: 'clock', color: 'info'},
        {label: props.t('past'), value: stats.past, icon: 'check-circle', color: 'secondary'},
    ];

    const handleEventClick = (info: any) => {
        const row = info.event.extendedProps.raw;
        window.open(row.link, '_blank');
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('live_sessions')} pageTitle={props.t('main')}/>

                    <Row>
                        {statCards.map((s, i) => (
                            <Col xl={3} md={6} key={i}>
                                <Card className="card-animate">
                                    <CardBody>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <p className="text-uppercase fw-medium text-muted mb-0">{s.label}</p>
                                                <h4 className="mt-2 mb-0">{s.value}</h4>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span
                                                    className={`avatar-title bg-${s.color}-subtle text-${s.color} rounded-circle fs-3 d-flex align-items-center justify-content-center`}
                                                    style={{width: 48, height: 48}}>
                                                    <FeatherIcon size={20} icon={s.icon}/>
                                                </span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* фильтры */}
                    <Card>
                        <CardBody>
                            <div className="d-flex flex-wrap gap-3 align-items-end justify-content-between">
                                <div className="d-flex flex-wrap gap-3 align-items-end">
                                    <div><SearchInput value={search} onSearch={setSearch}/></div>
                                    <div style={{minWidth: 200}}>
                                        <CustomSelect
                                            placeholder={props.t('select_user')}
                                            value={studentFilter}
                                            options={studentsOptions}
                                            onChange={setStudentFilter}
                                            isClearable
                                        />
                                    </div>
                                    <div style={{minWidth: 200}}>
                                        <CustomSelect
                                            placeholder={props.t('select_course')}
                                            value={courseFilter}
                                            options={coursesOptions}
                                            onChange={setCourseFilter}
                                            isClearable
                                        />
                                    </div>
                                    <Button color="light" className="d-flex gap-1 align-items-center"
                                            onClick={() => {
                                                setSearch('');
                                                setStudentFilter(null);
                                                setCourseFilter(null);
                                            }}>
                                        <FeatherIcon size={14} icon="x"/>
                                        {props.t('clear')}
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Row>
                        <Col xl={9}>
                            <Card>
                                <CardBody>
                                    <FullCalendar
                                        ref={calendarRef}
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                        }}
                                        locale="ru"
                                        firstDay={1}
                                        height="auto"
                                        events={calendarEvents}
                                        eventClick={handleEventClick}
                                        eventTimeFormat={{hour: '2-digit', minute: '2-digit', hour12: false}}
                                        nowIndicator
                                    />
                                </CardBody>
                            </Card>
                        </Col>

                        {/* ближайшие сессии */}
                        <Col xl={3}>
                            <Card>
                                <CardBody>
                                    <h5 className="card-title mb-3 d-flex align-items-center gap-2">
                                        <FeatherIcon size={16} icon="clock"/>
                                        {props.t('upcoming')}
                                    </h5>
                                    {upcomingList.length === 0 && (
                                        <div className="text-muted text-center py-3">{props.t('no_data')}</div>
                                    )}
                                    <div className="d-flex flex-column gap-2">
                                        {upcomingList.map((row: any) => (
                                            <div key={row.id}
                                                 className="border rounded p-2 cursor-pointer"
                                                 style={{cursor: 'pointer'}}
                                                 onClick={() => window.open(row.link, '_blank')}>
                                                <div className="fw-medium text-truncate">{row.title}</div>
                                                <div className="text-muted small d-flex align-items-center gap-1">
                                                    <FeatherIcon size={12} icon="calendar"/>
                                                    {new Date(row.scheduled_at).toLocaleString('ru-RU', {
                                                        day: '2-digit', month: '2-digit',
                                                        hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </div>
                                                <div className="mt-1 d-flex flex-wrap gap-1">
                                                    <Badge color="success" className="bg-success-subtle text-success">
                                                        {row.course?.title}
                                                    </Badge>
                                                    {row.teacher && (
                                                        <Badge color="info" className="bg-info-subtle text-info">
                                                            {row.teacher.first_name} {row.teacher.last_name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
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

export default withTranslation()(LiveSessionsDashboard);