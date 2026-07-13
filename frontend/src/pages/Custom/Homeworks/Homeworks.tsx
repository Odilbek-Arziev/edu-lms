import React, {useEffect, useMemo, useState} from "react";
import {Badge, Button, Card, CardBody, Container} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SearchInput from "../../../Components/Common/SearchInput";
import {withTranslation} from "react-i18next";
import {useFetchData} from "../../../hooks/useFetchData";
import {closeLoading, showLoading} from "../../../utils/swal";
import {getUserRoles} from "../../../helpers/getUserRoles";
import {homeworksThunk} from "../../../slices/homeworks";
import HomeworkCreate from "../../../Components/Custom/Homeworks/HomeworkCreate";
import {useCascadeSelect} from "../../../hooks/useCascadeSelect";
import CascadeSelect from "../../../Components/Custom/Homeworks/CascadeSelect";
import HomeworkDelete from "../../../Components/Custom/Homeworks/HomeworkDelete";
import HomeworkEdit from "../../../Components/Custom/Homeworks/HomeworkEdit";
import {toLocalInput} from "../../../utils/date";
import {useDispatch} from "react-redux";
import {useCrudModals} from "../../../hooks/useCrudModals";
import HomeworkRow from "../../../Components/Custom/Homeworks/HomeworkRow";

const Homeworks = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const cascade = useCascadeSelect();
    const dispatch = useDispatch<any>();

    const {localData: homeworks, isSearching, fetchData} = useFetchData(
        homeworksThunk.fetch, 'homeworks',
        () => ({
            ...(search && {search}),
            ...(cascade.courseId && {course: cascade.courseId}),
            ...(cascade.lessonId && {lesson: cascade.lessonId}),
        })
    );

    const {showCreate, showEdit, showDelete} = useCrudModals(
        {create: HomeworkCreate, edit: HomeworkEdit, remove: HomeworkDelete},
        {onChange: fetchData}
    );

    async function getData(id: number) {
        const response = await dispatch(homeworksThunk.getById(id));

        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    title: response.title,
                    description: response.description,
                    deadline: toLocalInput(response.deadline),
                    max_attempts: response.max_attempts,
                    lesson_id: response.lesson.id,
                    module_id: response.lesson.module,
                    course_id: response.lesson.course,
                    criteria: (response.criteria || []).map((c: any) => c.text),
                }
            });
        }
    }

    const clearFilters = () => {
        setSearch('');
        cascade.reset();
    };

    const roles = getUserRoles();
    const canManage = roles.includes('teacher');

    const groups = useMemo(() => {
        const now = new Date();
        const soonThreshold = 1000 * 60 * 60 * 24 * 3;
        const overdue: any[] = [];
        const soon: any[] = [];
        const active: any[] = [];
        const noDeadline: any[] = [];

        (homeworks || []).forEach((hw: any) => {
            if (!hw.deadline) {
                noDeadline.push(hw);
                return;
            }
            const d = new Date(hw.deadline);
            const diff = d.getTime() - now.getTime();
            if (diff < 0) overdue.push(hw);
            else if (diff <= soonThreshold) soon.push(hw);
            else active.push(hw);
        });

        const sortByDeadline = (a: any, b: any) =>
            +new Date(a.deadline) - +new Date(b.deadline);
        overdue.sort(sortByDeadline);
        soon.sort(sortByDeadline);
        active.sort(sortByDeadline);

        return [
            {key: 'overdue', label: props.t('overdue'), color: 'danger', icon: 'alert-triangle', items: overdue},
            {key: 'soon', label: props.t('due_soon'), color: 'warning', icon: 'clock', items: soon},
            {key: 'active', label: props.t('active'), color: 'success', icon: 'check-circle', items: active},
            {
                key: 'no_deadline',
                label: props.t('no_deadline'),
                color: 'secondary',
                icon: 'minus-circle',
                items: noDeadline
            },
        ].filter(g => g.items.length > 0);
    }, [homeworks]);

    useEffect(() => {
        fetchData();
    }, [search, cascade.courseId, cascade.lessonId]);

    useEffect(() => {
        if (isSearching) showLoading(props.t('loading'), props.t('wait'));
        else closeLoading();
    }, [isSearching]);

    document.title = props.t('homeworks_page');

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('homeworks')} pageTitle={props.t('main')}/>

                    <Card className="mb-3">
                        <CardBody>
                            <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
                                <div className="d-flex flex-wrap gap-3 align-items-end">
                                    <div><SearchInput value={search} onSearch={setSearch}/></div>

                                    <CascadeSelect cascade={cascade}/>

                                    <Button className="btn btn-secondary d-flex gap-1 align-items-center"
                                            onClick={clearFilters}>
                                        <FeatherIcon color="white" size={12} icon="x"/>
                                        {props.t('clear')}
                                    </Button>
                                </div>

                                {canManage && (
                                    <Button className="btn btn-success d-flex gap-1 align-items-center"
                                            onClick={showCreate}
                                    >
                                        <FeatherIcon color="white" size={12} icon="plus-circle"/>
                                        {props.t('create', {item: props.t('homework')})}
                                    </Button>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {groups.length === 0 && (
                        <div className="text-center text-muted py-5">
                            <FeatherIcon icon="clipboard" size={36} className="mb-2"/>
                            <div>{props.t('no_data')}</div>
                        </div>
                    )}

                    {groups.map(group => (
                        <div key={group.key} className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span
                                    className={`avatar-title bg-${group.color}-subtle text-${group.color} rounded d-flex align-items-center justify-content-center`}
                                    style={{width: 32, height: 32}}>
                                    <FeatherIcon size={16} icon={group.icon}/>
                                </span>
                                <h5 className="mb-0">{group.label}</h5>
                                <Badge color={group.color} className={`bg-${group.color}-subtle text-${group.color}`}>
                                    {group.items.length}
                                </Badge>
                            </div>
                            {group.items.map((hw: any) => (
                                <HomeworkRow
                                    key={hw.id}
                                    hw={hw}
                                    color={group.color}
                                    canManage={canManage}
                                    onEdit={getData}
                                    onDelete={(id) => showDelete({id})}
                                />
                            ))}
                        </div>
                    ))}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Homeworks);