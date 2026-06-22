import React, {useEffect, useState} from "react";
import {Button, Container, Input, Label, Table} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SearchInput from "../../../Components/Common/SearchInput";
import {withTranslation} from "react-i18next";
import {useFetchData} from "../../../hooks/useFetchData";
import {closeLoading, showLoading} from "../../../utils/swal";
import {useModal} from "../../../Components/Hooks/useModal";
import {EditModalProps} from "../../../types/editModal";
import {useDispatch} from "react-redux";
import {liveSessionsThunk} from "../../../slices/liveSessions/reducer";
import LiveSessionDelete from "../../../Components/Custom/LiveSessions/LiveSessionDelete";
import LiveSessionCreate from "../../../Components/Custom/LiveSessions/LiveSessionCreate";
import LiveSessionEdit from "../../../Components/Custom/LiveSessions/LiveSessionEdit";
import {toApiDate, toLocalInput} from "../../../utils/date";
import CustomSelect from "../../../Components/Common/CustomSelect";
import {usersThunks} from "../../../slices/users/reducer";
import {coursesThunks} from "../../../slices/courses/reducer";
import Flatpickr from "react-flatpickr";
import {CourseSimplified} from "../../../types/Course";
import {User} from "../../../types/User";
import {getUserRoles} from "../../../helpers/getUserRoles";


const LiveSessions = (props: any) => {
    const dispatch = useDispatch<any>();
    const [search, setSearch] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [studentFilter, setStudentFilter] = useState<any>(null);
    const [courseFilter, setCourseFilter] = useState<any>(null);
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);

    const {localData: liveSessions, isSearching, fetchData} = useFetchData(
        liveSessionsThunk.fetch,
        'live-sessions',
        () => ({
            ...(search && {search}),
            ...(studentFilter && {student: studentFilter}),
            ...(courseFilter && {course: courseFilter}),
            ...(dateFrom && {date_from: toApiDate(dateFrom)}),
            ...(dateTo && {date_to: toApiDate(dateTo)}),
        })
    );
    const roles = getUserRoles();
    const canManage = roles.includes('manager')

    const [showCreate, hideCreate] = useModal(
        <LiveSessionCreate onSuccess={() => {
            fetchData();
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) => (
            <LiveSessionEdit
                {...props}
                onSuccess={() => {
                    fetchData();
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <LiveSessionDelete
                {...props}
                onSuccess={() => {
                    fetchData();
                    hideDelete();
                }}
                onCancel={() => hideDelete()}
            />
        )
    );

    async function getData(id: number) {
        const response = await dispatch(liveSessionsThunk.getById(id));

        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    title: response.title,
                    scheduled_at: toLocalInput(response.scheduled_at),
                    duration_minutes: response.duration_minutes,
                    link: response.link,
                    course_id: response.course.id,
                    teacher_id: response.teacher?.id,
                    student_ids: response.students.map((student: User) => student.id)
                }
            });
        }
    }

    const studentsOptions = students?.map((student: User) => ({
        value: student.id,
        label: `${student.first_name} ${student.last_name}`,
    })) || [];

    const coursesOptions = courses?.map((course: CourseSimplified) => ({
        value: course.title,
        label: course.title,
    })) || [];

    useEffect(() => {
        fetchData();
    }, [search, studentFilter, courseFilter, dateFrom, dateTo]);

    useEffect(() => {
        if (isSearching) {
            showLoading(props.t('loading'), props.t('wait'));
        } else {
            closeLoading();
        }
    }, [isSearching]);

    useEffect(() => {
        dispatch(usersThunks.getUsers('student')).then((res: any) => {
            setStudents(res?.results || []);
        });

        dispatch(coursesThunks.fetch()).then((res: any) => {
            setCourses(res?.results || []);
        });
    }, []);

    document.title = props.t('live-sessions-page');

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('live_sessions')} pageTitle={props.t('main')}/>
                    <div className="d-flex justify-content-between my-2">
                        <div className="d-flex flex-wrap gap-3 align-items-end">
                            <div>
                                <SearchInput value={search} onSearch={setSearch}/>
                            </div>

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

                            <div>
                                <Flatpickr
                                    placeholder={props.t('date_from')}
                                    className="form-control"
                                    style={{maxWidth: 170}}
                                    value={dateFrom ?? undefined}
                                    options={{dateFormat: "d.m.Y"}}
                                    onChange={(dates: Date[]) => setDateFrom(dates[0] ?? null)}
                                />
                            </div>

                            <div>
                                <Flatpickr
                                    placeholder={props.t('date_to')}
                                    className="form-control"
                                    style={{maxWidth: 170}}
                                    value={dateTo ?? undefined}
                                    options={{dateFormat: "d.m.Y"}}
                                    onChange={(dates: Date[]) => setDateTo(dates[0] ?? null)}
                                />
                            </div>

                            <Button
                                color="light"
                                className="d-flex gap-1 align-items-center"
                                onClick={() => {
                                    setSearch('');
                                    setStudentFilter(null);
                                    setCourseFilter(null);
                                    setDateFrom(null);
                                    setDateTo(null);
                                }}
                            >
                                <FeatherIcon size={14} icon="x"/>
                                {props.t('clear')}
                            </Button>
                        </div>

                        {
                            canManage
                            && <Button
                                color="success"
                                className="d-flex gap-1 align-items-center"
                                onClick={showCreate}
                            >
                                <FeatherIcon size={14} icon="plus-circle"/>
                                {props.t('create', {item: props.t('live_session')})}
                            </Button>
                        }
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>{props.t('title')}</th>
                            <th>{props.t('date')}</th>
                            <th>{props.t('time')}</th>
                            <th>{props.t('duration_minutes')}</th>
                            <th>{props.t('link')}</th>
                            <th>{props.t('teacher')}</th>
                            <th>{props.t('students')}</th>
                            <th>{props.t('course')}</th>
                            {canManage && <th>{props.t('actions')}</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {liveSessions?.map((row: any, idx: number) => (
                            <tr key={row.id}>
                                <td>{idx + 1}</td>
                                <td>{row.title}</td>
                                <td>{new Date(row.scheduled_at).toLocaleDateString('ru-RU')}</td>
                                <td>{new Date(row.scheduled_at).toLocaleTimeString('ru-RU')}</td>
                                <td>{row.duration_minutes}</td>
                                <td>{row.link}</td>
                                <td>
                                    <div className="d-flex flex-wrap gap-1 justify-content-center">
                                            <span
                                                className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1"
                                                style={{fontSize: '0.75rem', padding: '0.4em 0.6em'}}
                                            >
                                                <FeatherIcon size={12} icon="book"/>
                                                {
                                                    row?.teacher
                                                        ? `${row.teacher.first_name} ${row.teacher.last_name}`
                                                        : `преподаватель`

                                                }
                                            </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap gap-1 justify-content-center">
                                        {row.students.map((student: User) => (
                                            <span
                                                key={student.id}
                                                className="badge bg-primary-subtle text-primary d-inline-flex align-items-center gap-1"
                                                style={{fontSize: '0.75rem', padding: '0.4em 0.6em'}}
                                            >
                                                <FeatherIcon size={12} icon="user"/>
                                                {student.first_name} {student.last_name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td>{row.course.title}</td>
                                {
                                    canManage
                                    && <td className='d-flex gap-1 justify-content-center'>
                                        <Button className='btn btn-info btn-sm'
                                                onClick={() => getData(row.id)}
                                        >
                                            <FeatherIcon color="white" size={12} icon="edit"/>
                                        </Button>
                                        <Button className='btn btn-danger btn-sm'
                                                onClick={() => showDelete({id: row.id})}
                                        >
                                            <FeatherIcon color="white" size={12} icon="trash"/>
                                        </Button>
                                    </td>
                                }
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(LiveSessions);