import React, {useEffect, useMemo, useState} from "react";
import {Badge, Button, Card, CardBody, Container, Progress} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SearchInput from "../../../Components/Common/SearchInput";
import {withTranslation} from "react-i18next";
import {useFetchData} from "../../../hooks/useFetchData";
import {closeLoading, showLoading} from "../../../utils/swal";
import {getUserRoles} from "../../../helpers/getUserRoles";
import {homeworksThunk} from "../../../slices/homeworks/reducer";
import {useModal} from "../../../Components/Hooks/useModal";
import HomeworkCreate from "../../../Components/Custom/Homeworks/HomeworkCreate";
import {useCascadeSelect} from "../../../hooks/useHomeworkCascadeSelect";
import CascadeSelect from "../../../Components/Custom/Homeworks/CascadeSelect";

const Homeworks = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const cascade = useCascadeSelect();

    const {localData: homeworks, isSearching, fetchData} = useFetchData(
        homeworksThunk.fetch, 'homeworks',
        () => ({
            ...(search && {search}),
            ...(cascade.courseId && {course: cascade.courseId}),
            ...(cascade.lessonId && {lesson: cascade.lessonId}),
        })
    );

    const [showCreate, hideCreate] = useModal(
        <HomeworkCreate onSuccess={() => {
            fetchData();
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const roles = getUserRoles();
    const canManage = roles.includes('teacher');

    useEffect(() => {
        fetchData();
    }, [search, cascade.courseId, cascade.lessonId]);

    useEffect(() => {
        if (isSearching) showLoading(props.t('loading'), props.t('wait'));
        else closeLoading();
    }, [isSearching]);

    document.title = props.t('homeworks_page');

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

    const clearFilters = () => {
        setSearch('');
        cascade.reset();
    };

    const formatDeadline = (deadline: string) => {
        if (!deadline) return props.t('no_deadline');
        return new Date(deadline).toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const HomeworkRow = ({hw, color}: { hw: any; color: string }) => (
        <Card className="mb-2 overflow-hidden">
            <div className="d-flex">
                <div style={{width: 4, background: `var(--vz-${color})`}}/>
                <CardBody className="py-3">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div className="flex-grow-1" style={{minWidth: 0}}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h5 className="fs-15 mb-0 text-truncate" title={hw.title}>{hw.title}</h5>
                                <Badge color={color} className={`bg-${color}-subtle text-${color}`}>
                                    <FeatherIcon size={11} icon="calendar" className="me-1"/>
                                    {formatDeadline(hw.deadline)}
                                </Badge>
                            </div>

                            <div className="text-muted small d-flex align-items-center gap-3 flex-wrap">
                            <span className="d-flex align-items-center gap-1">
                                <FeatherIcon size={12} icon="book-open"/>
                                {hw.lesson?.title}
                            </span>
                                <span className="d-flex align-items-center gap-1">
                                <FeatherIcon size={12} icon="repeat"/>
                                    {props.t('max_attempts')}: {hw.max_attempts}
                            </span>
                                {hw.criteria?.length > 0 && (
                                    <span className="d-flex align-items-center gap-1">
                                    <FeatherIcon size={12} icon="check-square"/>
                                        {props.t('criteria')}: {hw.criteria.length}
                                </span>
                                )}
                            </div>

                            {hw.description && (
                                <p className="text-muted small mb-0 mt-1"
                                   style={{
                                       display: '-webkit-box',
                                       WebkitLineClamp: 2,
                                       WebkitBoxOrient: 'vertical',
                                       overflow: 'hidden',
                                   }}>
                                    {hw.description}
                                </p>
                            )}

                            {hw.criteria?.length > 0 && (
                                <div className="d-flex flex-wrap gap-1 mt-2">
                                    {hw.criteria.map((c: any) => (
                                        <Badge key={c.id} color="light"
                                               className="bg-light text-body border d-flex align-items-center gap-1"
                                               style={{fontWeight: 400, fontSize: 12}}>
                                            <FeatherIcon size={10} icon="check"/>
                                            {c.text}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {canManage && (
                            <div className="d-flex gap-1 flex-shrink-0">
                                <Button className="btn btn-info btn-sm">
                                    <FeatherIcon color="white" size={12} icon="edit"/>
                                </Button>
                                <Button className="btn btn-danger btn-sm">
                                    <FeatherIcon color="white" size={12} icon="trash"/>
                                </Button>
                            </div>
                        )}
                    </div>
                </CardBody>
            </div>
        </Card>
    );

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
                                <HomeworkRow key={hw.id} hw={hw} color={group.color}/>
                            ))}
                        </div>
                    ))}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Homeworks);