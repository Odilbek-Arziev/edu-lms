import React, {useEffect, useState} from "react";
import {Badge, Button, Card, CardBody, Col, Container, Row} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SearchInput from "../../../Components/Common/SearchInput";
import CustomSelect from "../../../Components/Common/CustomSelect";
import {withTranslation} from "react-i18next";
import {useFetchData} from "../../../hooks/useFetchData";
import {closeLoading, showLoading} from "../../../utils/swal";
import {useDispatch} from "react-redux";
import {materialsThunk} from "../../../slices/materials/reducer";
import MaterialCreate from "../../../Components/Custom/Materials/MaterialCreate";
import MaterialEdit from "../../../Components/Custom/Materials/MaterialEdit";
import MaterialDelete from "../../../Components/Custom/Materials/MaterialDelete";
import {getUserRoles} from "../../../helpers/getUserRoles";
import {useCascadeSelect} from "../../../hooks/useCascadeSelect";
import {useCrudModals} from "../../../hooks/useCrudModals";

const Materials = (props: any) => {
    const dispatch = useDispatch<any>();
    const [search, setSearch] = useState<string>('');

    const {
        courseId, moduleId, lessonId,
        setCourseId, setModuleId, setLessonId,
        coursesOptions, modulesOptions, lessonsOptions,
        reset,
    } = useCascadeSelect();

    const {localData: materials, isSearching, fetchData} = useFetchData(
        materialsThunk.fetch,
        'materials',
        () => ({
            ...(search && {search}),
            ...(courseId && {course: courseId}),
            ...(lessonId && {lesson: lessonId}),
        })
    );

    const roles = getUserRoles();
    const canManage = roles.includes('manager');

    const {showCreate, showEdit, showDelete} = useCrudModals(
        {create: MaterialCreate, edit: MaterialEdit, remove: MaterialDelete},
        {onChange: fetchData}
    );

    async function getData(id: number) {
        const response = await dispatch(materialsThunk.getById(id));
        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    title: response.title,
                    description: response.description,
                    lesson_id: response.lesson.id,
                    url: response.url,
                    file: response.file,
                }
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, [search, courseId, lessonId]);

    useEffect(() => {
        if (isSearching) showLoading(props.t('loading'), props.t('wait'));
        else closeLoading();
    }, [isSearching]);

    document.title = props.t('materials_page');

    const clearFilters = () => {
        setSearch('');
        reset();
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('materials')} pageTitle={props.t('main')}/>

                    <Card className="mb-3">
                        <CardBody>
                            <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
                                <div className="d-flex flex-wrap gap-3 align-items-end">
                                    <div><SearchInput value={search} onSearch={setSearch}/></div>

                                    <div style={{minWidth: 200}}>
                                        <CustomSelect
                                            placeholder={props.t('select_course')}
                                            value={courseId}
                                            options={coursesOptions}
                                            onChange={setCourseId}
                                            isClearable
                                        />
                                    </div>

                                    <div style={{minWidth: 200}}>
                                        <CustomSelect
                                            placeholder={props.t('select_module')}
                                            value={moduleId}
                                            options={modulesOptions}
                                            onChange={setModuleId}
                                            isClearable
                                            isDisabled={!courseId}
                                        />
                                    </div>

                                    <div style={{minWidth: 200}}>
                                        <CustomSelect
                                            placeholder={props.t('select_lesson')}
                                            value={lessonId}
                                            options={lessonsOptions}
                                            onChange={setLessonId}
                                            isClearable
                                            isDisabled={!moduleId}
                                        />
                                    </div>

                                    <Button className="btn btn-secondary d-flex gap-1 align-items-center"
                                            onClick={clearFilters}>
                                        <FeatherIcon color="white" size={12} icon="x"/>
                                        {props.t('clear')}
                                    </Button>
                                </div>

                                {canManage && (
                                    <Button className="btn btn-success d-flex gap-1 align-items-center"
                                            onClick={showCreate}>
                                        <FeatherIcon color="white" size={12} icon="plus-circle"/>
                                        {props.t('create', {item: props.t('category')})}
                                    </Button>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {(!materials || materials.length === 0) && (
                        <div className="text-center text-muted py-5">
                            <FeatherIcon icon="folder" size={36} className="mb-2"/>
                            <div>{props.t('no_data')}</div>
                        </div>
                    )}

                    <Row>
                        {materials?.map((row: any) => {
                            const isLink = Boolean(row.url);
                            return (
                                <Col xxl={3} xl={4} md={6} key={row.id}>
                                    <Card className="card-animate h-100">
                                        <CardBody className="d-flex flex-column">
                                            <div className="d-flex align-items-start justify-content-between mb-3">
                                                <span
                                                    className={`avatar-title bg-${isLink ? 'primary' : 'success'}-subtle text-${isLink ? 'primary' : 'success'} rounded fs-3 d-flex align-items-center justify-content-center`}
                                                    style={{width: 48, height: 48}}>
                                                    <FeatherIcon size={22} icon={isLink ? 'link' : 'file-text'}/>
                                                </span>
                                                <Badge color={isLink ? 'primary' : 'success'}
                                                       className={`bg-${isLink ? 'primary' : 'success'}-subtle text-${isLink ? 'primary' : 'success'}`}>
                                                    {isLink ? props.t('url') : props.t('file')}
                                                </Badge>
                                            </div>

                                            <h5 className="fs-15 mb-1 text-truncate" title={row.title}>
                                                {row.title}
                                            </h5>
                                            <p className="text-muted small mb-2 d-flex align-items-center gap-1">
                                                <FeatherIcon size={12} icon="book-open"/>
                                                {row.lesson?.title}
                                            </p>

                                            {row.description && (
                                                <p className="text-muted small mb-3"
                                                   style={{
                                                       display: '-webkit-box',
                                                       WebkitLineClamp: 2,
                                                       WebkitBoxOrient: 'vertical',
                                                       overflow: 'hidden',
                                                   }}>
                                                    {row.description}
                                                </p>
                                            )}

                                            <div className="mt-auto d-flex gap-1 align-items-center">
                                                {isLink ? (
                                                    <a className="btn btn-primary btn-sm flex-grow-1 d-flex gap-1 align-items-center justify-content-center"
                                                       href={row.url} target="_blank" rel="noopener noreferrer">
                                                        <FeatherIcon size={12} icon="external-link"/>
                                                        {props.t('open')}
                                                    </a>
                                                ) : (
                                                    <a className="btn btn-success btn-sm flex-grow-1 d-flex gap-1 align-items-center justify-content-center"
                                                       href={row.file} target="_blank" download>
                                                        <FeatherIcon size={12} icon="download"/>
                                                        {props.t('download')}
                                                    </a>
                                                )}
                                                {canManage && (
                                                    <>
                                                        <Button className="btn btn-info btn-sm"
                                                                onClick={() => getData(row.id)}>
                                                            <FeatherIcon color="white" size={12} icon="edit"/>
                                                        </Button>
                                                        <Button className="btn btn-danger btn-sm"
                                                                onClick={() => showDelete({id: row.id})}>
                                                            <FeatherIcon color="white" size={12} icon="trash"/>
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Materials);