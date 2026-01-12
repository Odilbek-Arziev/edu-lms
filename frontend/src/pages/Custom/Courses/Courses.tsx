import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {withTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../slices";
import {coursesThunks} from "../../../slices/courses";
import SearchInput from "../../../Components/Common/SearchInput";
import CustomSelect from "../../../Components/Common/CustomSelect";
import FeatherIcon from "feather-icons-react";
import {closeLoading, showLoading} from "../../../utils/swal";
import {useModal} from "../../../Components/Hooks/useModal";
import CourseCreate from "../../../Components/Custom/Courses/CourseCreate";
import {useFetchData} from "../../../hooks/useFetchData";
import {EditModalProps} from "../../../types/editModal";
import CourseEdit from "../../../Components/Custom/Courses/CourseEdit";
import UserDelete from "../../../Components/Custom/Users/UserDelete";
import CourseDelete from "../../../Components/Custom/Courses/CourseDelete";


const Courses = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const [isActive, setIsActive] = useState<any>(null);
    const [selectedLang, setSelectedLang] = useState<number | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [openActionsId, setOpenActionsId] = useState<number | null>(null);

    const {localData, isSearching, fetchData} = useFetchData(
        coursesThunks.fetch,
        'courses',
        () => ({
            ...(search && {search}),
            ...(selectedLang && {language: selectedLang}),
            ...(selectedLevel && {level: selectedLevel}),
            ...(selectedCategory && {category: selectedCategory}),
            ...(isActive && {is_active: isActive}),
        })
    );

    const dispatch = useDispatch<any>();
    const {loading, languages, levels, categories} = useSelector((state: RootState) => state.Courses);

    const [showCreate, hideCreate] = useModal(
        <CourseCreate onSuccess={() => {
            fetchData();
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) => (
            <CourseEdit
                {...props}
                onSuccess={() => {
                    fetchData()
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <CourseDelete
                {...props}
                onSuccess={() => {
                    fetchData()
                    hideDelete();
                }}
                onCancel={() => hideDelete()}
            />
        )
    );

    async function getData(id: number) {
        const response = await dispatch(coursesThunks.getById(id));

        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    title: response.title,
                    description: response.description,
                    duration: response.duration,
                    language: response.language,
                    price: response.price,
                    category: response.category_detail.id,
                    level: response.level,
                    icon: response.icon
                }
            });
        }
    }

    const clearFilter = () => {
        setSearch('')
        setSelectedCategory(null)
        setSelectedLevel(null)
        setSelectedLang(null)
        setIsActive(null)
    }

    const toggleActions = (id: number) => {
        setOpenActionsId(prev => prev === id ? null : id);
    };

    async function handleStatus(id: number, isActive: boolean) {
        await dispatch(coursesThunks.update(id, {is_active: !isActive}))
        fetchData()
    }

    const statusTypes = [
        {value: 'True', label: 'active'},
        {value: 'False', label: 'passive'}
    ];

    useEffect(() => {
        dispatch(coursesThunks.getCategories())
        dispatch(coursesThunks.getLanguages())
        dispatch(coursesThunks.getLevels())
    }, [])

    useEffect(() => {
        fetchData()
    }, [search, selectedLang, selectedCategory, selectedLevel, isActive])

    useEffect(() => {
        if (isSearching || loading) {
            showLoading()
        } else {
            closeLoading()
        }
    }, [loading, isSearching]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('courses')} pageTitle={props.t('main')}/>
                    <div className="d-flex justify-content-between my-2">
                        <div className='d-flex gap-1'>
                            <SearchInput
                                value={search}
                                onSearch={setSearch}
                            />
                            <CustomSelect
                                placeholder={`${props.t('select_lang')}...`}
                                value={selectedLang}
                                options={languages || []}
                                onChange={setSelectedLang}
                            />
                            <CustomSelect
                                placeholder={`${props.t('select_level')}...`}
                                value={selectedLevel}
                                options={levels || []}
                                onChange={setSelectedLevel}
                            />
                            <CustomSelect
                                placeholder={`${props.t('select_category')}...`}
                                value={selectedCategory}
                                options={categories || []}
                                onChange={setSelectedCategory}
                            />
                            <CustomSelect
                                placeholder={props.t('select_status')}
                                value={isActive}
                                options={statusTypes}
                                onChange={setIsActive}
                                width='10vw'
                            />
                            <Button className='btn btn-secondary d-flex gap-1 align-items-center' onClick={clearFilter}>
                                <FeatherIcon color="white" size={12} icon="trash"/>
                                {props.t('clear')}
                            </Button>
                        </div>
                        <Button className='btn btn-success d-flex gap-1 align-items-center' onClick={showCreate}>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            {props.t('create', {item: props.t('course')})}
                        </Button>
                    </div>
                    <Row>
                        {localData ? localData.map((item: any, key: number) => (
                            <Col xl={3} md={6} key={key}>
                                <Card className="card-animate">
                                    <CardBody>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 overflow-hidden">
                                                <div className="d-flex align-items-center gap-2 mb-0">
                                                  <span className="badge bg-light text-dark">
                                                    {props.t(item.category_detail?.title)}
                                                  </span>
                                                    <span className="badge bg-light text-dark">
                                                        {props.t(item.level)}
                                                  </span>
                                                    <span
                                                        className={`badge ${item.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                    {item.is_active ? `● ${props.t('active')}` : `● ${props.t('passive')}`}
                                                  </span>
                                                </div>
                                            </div>
                                            <Dropdown
                                                isOpen={openActionsId === item.id}
                                                toggle={() => toggleActions(item.id)}
                                                direction="down"
                                            >
                                                <DropdownToggle
                                                    tag="button"
                                                    className="btn btn-sm btn-light"
                                                >
                                                    <FeatherIcon icon="more-vertical" size={16}/>
                                                </DropdownToggle>

                                                <DropdownMenu end>
                                                    <DropdownItem
                                                        onClick={() => getData(item.id)}
                                                        className="d-flex align-items-center gap-2"
                                                    >
                                                        <FeatherIcon size={14} icon="edit"/>
                                                        {props.t('edit')}
                                                    </DropdownItem>

                                                    <DropdownItem
                                                        onClick={() => handleStatus(item.id, item.is_active)}
                                                        className="d-flex align-items-center gap-2"
                                                    >
                                                        {item.is_active ? (
                                                            <>
                                                                <FeatherIcon size={14} icon="slash"/>
                                                                {props.t('deactivate')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FeatherIcon size={14} icon="check-circle"/>
                                                                {props.t('activate')}
                                                            </>
                                                        )}
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => showDelete({id: item.id})}
                                                        className="d-flex align-items-center gap-2 text-danger"
                                                    >
                                                        <FeatherIcon size={14} icon="trash"/>
                                                        {props.t('delete')}
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                        <div className="d-flex align-items-end justify-content-between mt-4">
                                            <div>
                                                <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                                    {item.title}
                                                </h4>
                                                <Link to={`/course/${item.id}`}
                                                      className="text-decoration-underline link-secondary">
                                                    {props.t('view_course')}
                                                </Link>
                                            </div>
                                            <div className="avatar-sm flex-shrink-0">
                                                <span className="avatar-title rounded fs-3">
                                                    <i className={"fa-brands fa-" + item.icon}/>
                                                </span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>)) : null}
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default withTranslation()(Courses);