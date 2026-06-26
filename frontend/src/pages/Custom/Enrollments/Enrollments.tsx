import React, {useEffect, useMemo, useState} from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    Container, DropdownItem, DropdownMenu, DropdownToggle, Progress,
    Row, Table, UncontrolledDropdown,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {withTranslation} from "react-i18next";
import {enrollmentsTiles} from "../../../common/data/widgets";
import CountUp from "react-countup";
import SearchInput from "../../../Components/Common/SearchInput";
import FeatherIcon from "feather-icons-react";
import {coursesThunks} from "../../../slices/courses/reducer";
import {useDispatch, useSelector} from "react-redux";
import CustomSelect from "../../../Components/Common/CustomSelect";
import {Course} from "../../../types/Course";
import {enrollmentsThunk} from "../../../slices/enrollments/reducer";
import {closeLoading, showLoading} from "../../../utils/swal";
import PaginationButtons from "../../../Components/Common/PaginationButtons";
import {PER_PAGE} from "../../../constants";
import {RootState} from "../../../slices";
import {useModal} from "../../../Components/Hooks/useModal";
import EnrollmentCreate from "../../../Components/Custom/Enrollments/EnrollmentCreate";
import {useFetchData} from "../../../hooks/useFetchData";
import {EditModalProps} from "../../../types/editModal";
import EnrollmentEdit from "../../../Components/Custom/Enrollments/EnrollmentEdit";
import EnrollmentDelete from "../../../Components/Custom/Enrollments/EnrollmentDelete";

const Enrollments = (props: any) => {
    const dispatch = useDispatch<any>();
    const [search, setSearch] = useState<string>('');
    const [courses, setCourses] = useState<any[]>([]);
    const [courseFilter, setCourseFilter] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<any>(null);
    const [page, setPage] = useState<number>(1);

    const {loading, count, stats} = useSelector(
        (state: RootState) => state.Enrollments
    );

    const {localData, isSearching, fetchData} = useFetchData(
        enrollmentsThunk.fetch,
        'enrollments',
        () => ({
            page,
            perPage: PER_PAGE,
            ...(search && {search}),
            ...(courseFilter && {course: courseFilter}),
            ...(statusFilter && {status: statusFilter}),
        })
    );

    const coursesOptions = courses?.map((course: Course) => ({
        value: course.title,
        label: course.title,
    })) || [];

    const statusOptions = enrollmentsTiles?.map((status: any) => ({
        value: status.label,
        label: status.label,
    })) || [];

    const clearFilter = () => {
        setSearch('')
        setCourseFilter(null)
        setStatusFilter(null)
    }

    const tilesWithRealData = useMemo(() => {
        if (!stats) return enrollmentsTiles

        const counters: Record<string, number> = {
            active: stats.active,
            completed: stats.completed,
            dropped: stats.dropped,
            suspended: stats.suspended,
        }

        return (enrollmentsTiles || []).map((item: any) => ({
            ...item,
            counter: counters[item.label] ?? item.counter
        }))
    }, [stats])


    const [showCreate, hideCreate] = useModal(
        <EnrollmentCreate onSuccess={() => {
            fetchData();
            dispatch(enrollmentsThunk.getStats());
            hideCreate();
        }} onCancel={() => hideCreate()}/>,
    )

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) => (
            <EnrollmentEdit
                {...props}
                onSuccess={() => {
                    fetchData();
                    dispatch(enrollmentsThunk.getStats());
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <EnrollmentDelete
                {...props}
                onSuccess={() => {
                    fetchData();
                    dispatch(enrollmentsThunk.getStats());
                    hideDelete();
                }}
                onCancel={() => hideDelete()}
            />
        )
    );


    const handleStatusChange = async (id: number, status: string) => {
        await dispatch(enrollmentsThunk.update(id, {status}));
        fetchData();
        dispatch(enrollmentsThunk.getStats());
    };

    async function getData(id: number) {
        const response = await dispatch(enrollmentsThunk.getById(id));

        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    course_id: response.course.id,
                    student_id: response.student?.id,
                    status: response.status,
                    progress: response.progress,
                    final_grade: response.final_grade
                }
            });
        }
    }

    const statusColors: Record<string, string> = {
        active: "success",
        completed: "info",
        dropped: "danger",
        suspended: "warning",
    }

    useEffect(() => {
        dispatch(coursesThunks.fetch()).then((res: any) => {
            setCourses(res?.results || []);
        });
    }, []);

    useEffect(() => {
        if (loading || isSearching) {
            showLoading(props.t('loading'), props.t('wait'));
        } else {
            closeLoading()
        }
    }, [loading, isSearching]);

    useEffect(() => {
        dispatch(enrollmentsThunk.getStats());
    }, [dispatch]);

    useEffect(() => {
        fetchData()
    }, [page, search, courseFilter, statusFilter])

    document.title = props.t('enrollments_page');

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('enrollments')} pageTitle={props.t('main')}/>
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row>
                                    <React.Fragment>
                                        <Row>
                                            {(tilesWithRealData || []).map((item: any, key: number) => (
                                                <Col xl={3} md={6} key={key}>
                                                    <Card className={"card-animate " + item.bgColor}>
                                                        <CardBody>
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-grow-1">
                                                                    <p className={"text-uppercase fw-medium mb-0"}>
                                                                        {props.t(item.label)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <h5 className={"fs-14 mb-0 text-" + item.percentageClass}>
                                                                        <i className={"fs-13 align-middle " + item.percentageIcon}/> {item.percentage}
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="d-flex align-items-end justify-content-between mt-4">
                                                                <div>
                                                                    <h4 className={"fs-22 fw-semibold ff-secondary mb-4 " + item.counterClass}>
                                                                        <span className="counter-value">
                                                                            <CountUp
                                                                                start={0}
                                                                                end={Number(item.counter) || 0}
                                                                                separator=","
                                                                                duration={2}
                                                                            />
                                                                        </span>
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>))}
                                        </Row>
                                    </React.Fragment>
                                </Row>

                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-between my-2">
                        <div className='d-flex gap-1'>
                            <SearchInput
                                value={search}
                                onSearch={setSearch}
                            />
                            <div style={{minWidth: 200}}>
                                <CustomSelect
                                    placeholder={props.t('select_course')}
                                    value={courseFilter}
                                    options={coursesOptions}
                                    onChange={setCourseFilter}
                                    isClearable
                                />
                            </div>

                            <div style={{minWidth: 200}}>
                                <CustomSelect
                                    placeholder={props.t('select_status')}
                                    value={statusFilter}
                                    options={statusOptions}
                                    onChange={setStatusFilter}
                                    isClearable
                                />
                            </div>
                            <Button className='btn btn-secondary d-flex gap-1 align-items-center' onClick={clearFilter}>
                                <FeatherIcon color="white" size={12} icon="trash"/>
                                {props.t('clear')}
                            </Button>
                        </div>
                        <Button className='btn btn-success d-flex gap-1 align-items-center' onClick={showCreate}>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                           {props.t('create')}
                        </Button>
                    </div>
                    <Table
                        className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center my-4'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>{props.t('student')}</th>
                            <th>{props.t('course')}</th>
                            <th>{props.t('status')}</th>
                            <th>{props.t('progress')}</th>
                            <th>{props.t('grade')}</th>
                            <th>{props.t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {localData && localData.length > 0 ? localData?.map((row: any, idx: number) => (
                            <tr key={row.id || idx}>
                                <td>{(page - 1) * PER_PAGE + idx + 1}</td>
                                <td>{`${row.student.first_name} ${row.student.last_name}`}</td>
                                <td>{row.course.title}</td>
                                <td>
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="span" style={{cursor: "pointer"}}>
                                            <span className={`badge bg-${statusColors[row.status] ?? 'secondary'}`}>
                                                {props.t(row.status)} <FeatherIcon icon="chevron-down" size={10}/>
                                            </span>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {Object.keys(statusColors).map((st) => (
                                                <DropdownItem
                                                    key={st}
                                                    active={st === row.status}
                                                    onClick={() => handleStatusChange(row.id, st)}
                                                >
                                                    <span className={`badge bg-${statusColors[st]} me-2`}>&nbsp;</span>
                                                    {props.t(st)}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 me-2">
                                            <Progress
                                                value={row.progress}
                                                color={
                                                    row.progress >= 75 ? "success"
                                                        : row.progress >= 50 ? "info"
                                                        : row.progress >= 25 ? "warning"
                                                            : "danger"
                                                }
                                                style={{height: "6px"}}
                                            />
                                        </div>
                                        <span className="flex-shrink-0">{row.progress}%</span>
                                    </div>
                                </td>
                                <td>{row.final_grade ?? '-'}</td>
                                <td className='d-flex gap-1 justify-content-center'>
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
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="text-center">{props.t('no_data_found')}</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Container>
                <Container fluid>
                    {count > PER_PAGE ? (
                        <PaginationButtons
                            count={count}
                            currentPage={page}
                            perPageData={PER_PAGE}
                            setCurrentPage={setPage}
                        />
                    ) : null}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Enrollments);