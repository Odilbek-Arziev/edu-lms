import React, {useEffect, useState} from 'react';
import {
    Button,
    Col,
    Container,
    Row,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {withTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {coursesThunks} from "../../../slices/courses";
import FeatherIcon from "feather-icons-react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../slices";
import {closeLoading, showLoading} from "../../../utils/swal";
import '../../../assets/scss/pages/_course.scss';
import {useModal} from "../../../Components/Hooks/useModal";
import ModuleCreate from "../../../Components/Custom/Modules/ModuleCreate";

const Course = (props: any) => {
    const {id} = useParams<{ id: string }>();
    const courseId = id ? Number(id) : 0;

    const dispatch = useDispatch<any>();
    const {loading, currentCourse} = useSelector((state: RootState) => state.Courses);

    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const toggleNode = (nodeId: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    const [showCreate, hideCreate] = useModal(
        <ModuleCreate course={courseId} onSuccess={() => {
            dispatch(coursesThunks.getById(courseId));
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const isExpanded = (nodeId: string) => expandedNodes.has(nodeId);

    if (!id || isNaN(courseId)) {
        return (
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('courses')} pageTitle={props.t('main')}/>
                    <div>{props.t('invalid_course_id')}</div>
                </Container>
            </div>
        );
    }

    useEffect(() => {
        dispatch(coursesThunks.getById(courseId))
    }, [])

    useEffect(() => {
        if (loading) {
            showLoading()
        } else {
            closeLoading()
        }
    }, [loading]);

    useEffect(() => {
        if (currentCourse?.modules && currentCourse.modules.length > 0) {
            setExpandedNodes(new Set(['course', 'module-0']));
        }
    }, [currentCourse]);

    document.title = props.t('course_page')

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('course_page')} pageTitle={props.t('courses')} link='/courses'/>

                    <div className="d-flex justify-content-between align-items-center my-3">
                        <div className="d-flex gap-2">
                            <Button
                                color="light"
                                size="sm"
                                onClick={() => {
                                    const allNodes = new Set(['course']);
                                    currentCourse?.modules?.forEach((_: any, i: number) => {
                                        allNodes.add(`module-${i}`);
                                    });
                                    setExpandedNodes(allNodes);
                                }}
                            >
                                <FeatherIcon icon="chevrons-down" size={14} className="me-1"/>
                                {props.t('expand_all')}
                            </Button>
                            <Button
                                color="light"
                                size="sm"
                                onClick={() => setExpandedNodes(new Set())}
                            >
                                <FeatherIcon icon="chevrons-up" size={14} className="me-1"/>
                                {props.t('collapse_all')}
                            </Button>
                        </div>

                        <Button
                            color="success"
                            size="sm"
                            className='d-flex gap-1 align-items-center'
                            onClick={showCreate}
                        >
                            <FeatherIcon size={14} icon="plus-circle"/>
                            {props.t('create', {item: props.t('module')})}
                        </Button>
                    </div>

                    <Row>
                        <Col>
                            <div className="mt-3">
                                <div className="tree-view">
                                    <div className="tree-node">
                                        <div
                                            className="tree-node-header d-flex align-items-center p-3 bg-light rounded mb-2"
                                            style={{cursor: "pointer"}}
                                        >
                                            <div
                                                className="d-flex align-items-center flex-grow-1"
                                                onClick={() => toggleNode('course')}
                                            >
                                                <FeatherIcon
                                                    icon={isExpanded('course') ? 'chevron-down' : 'chevron-right'}
                                                    size={18}
                                                    className="me-2"
                                                />
                                                <FeatherIcon icon="book" size={18} className="me-2 text-primary"/>
                                                <strong>{currentCourse?.title || props.t('course')}</strong>
                                            </div>
                                        </div>

                                        {isExpanded('course') && (
                                            <div className="tree-children ms-4">
                                                {currentCourse?.modules && currentCourse.modules.length > 0 ? (
                                                    currentCourse.modules.map((module: any, moduleIndex: number) => (
                                                        <div key={module.id || moduleIndex} className="tree-node mb-2">
                                                            <div
                                                                className="tree-node-header d-flex align-items-center p-2 bg-white border rounded tree-hover"
                                                                style={{cursor: "pointer"}}
                                                            >
                                                                <div
                                                                    className="d-flex align-items-center flex-grow-1"
                                                                    onClick={() => toggleNode(`module-${moduleIndex}`)}
                                                                >
                                                                    <FeatherIcon
                                                                        icon={isExpanded(`module-${moduleIndex}`) ? 'chevron-down' : 'chevron-right'}
                                                                        size={16}
                                                                        className="me-2"
                                                                    />
                                                                    <FeatherIcon icon="folder" size={16}
                                                                                 className="me-2 text-warning"/>
                                                                    <span className="fw-medium">{module.title}</span>
                                                                    <span className="badge bg-secondary ms-2">
                                                                        {module.lessons?.length || 0} {props.t('lessons')}
                                                                    </span>
                                                                </div>

                                                                {/* Действия для модуля */}
                                                                <div className="d-flex gap-1 ms-auto">
                                                                    <Button
                                                                        color="light"
                                                                        size="sm"
                                                                        className="btn-icon"
                                                                        title={props.t('create', {item: props.t('lesson')})}
                                                                    >
                                                                        <FeatherIcon icon="plus" size={14}/>
                                                                    </Button>

                                                                    <UncontrolledDropdown>
                                                                        <DropdownToggle
                                                                            tag="button"
                                                                            className="btn btn-light btn-sm btn-icon"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <FeatherIcon icon="more-vertical"
                                                                                         size={14}/>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu end>
                                                                            <DropdownItem>
                                                                                <FeatherIcon icon="edit-2" size={14}
                                                                                             className="me-2"/>
                                                                                {props.t('edit')}
                                                                            </DropdownItem>
                                                                            <DropdownItem divider/>
                                                                            <DropdownItem className="text-danger">
                                                                                <FeatherIcon icon="trash-2" size={14}
                                                                                             className="me-2"/>
                                                                                {props.t('delete')}
                                                                            </DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                                </div>
                                                            </div>

                                                            {isExpanded(`module-${moduleIndex}`) && (
                                                                <div className="tree-children ms-4 mt-2">
                                                                    {module?.lessons && module.lessons.length > 0 ? (
                                                                        module.lessons.map((lesson: any, lessonIndex: number) => (
                                                                            <div
                                                                                key={lesson.id || lessonIndex}
                                                                                className="tree-node-leaf d-flex align-items-center p-2 border-start border-2 ps-3 mb-1 tree-leaf-hover"
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    transition: "all 0.2s"
                                                                                }}
                                                                            >
                                                                                <FeatherIcon
                                                                                    icon="file-text"
                                                                                    size={14}
                                                                                    className="me-2 text-info"
                                                                                />
                                                                                <span
                                                                                    className="flex-grow-1">{lesson.title}</span>
                                                                                {lesson.duration && (
                                                                                    <span
                                                                                        className="text-muted small me-2">
                                                                                        {lesson.duration} {props.t('min')}
                                                                                    </span>
                                                                                )}

                                                                                {/* Действия для урока */}
                                                                                <div
                                                                                    className="lesson-actions d-flex gap-1">
                                                                                    <Button
                                                                                        color="light"
                                                                                        size="sm"
                                                                                        className="btn-icon"
                                                                                        title={props.t('edit')}
                                                                                    >
                                                                                        <FeatherIcon icon="edit-2"
                                                                                                     size={12}/>
                                                                                    </Button>
                                                                                    <Button
                                                                                        color="light"
                                                                                        size="sm"
                                                                                        className="btn-icon text-danger"
                                                                                        title={props.t('delete')}
                                                                                    >
                                                                                        <FeatherIcon icon="trash-2"
                                                                                                     size={12}/>
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div
                                                                            className="text-muted p-2 small d-flex align-items-center justify-content-between">
                                                                            <div>
                                                                                <FeatherIcon icon="info" size={14}
                                                                                             className="me-1"/>
                                                                                {props.t('no_lessons')}
                                                                            </div>
                                                                            <Button color="success" size="sm">
                                                                                <FeatherIcon icon="plus" size={12}
                                                                                             className="me-1"/>
                                                                                {props.t('add_first_lesson')}
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-muted p-3 text-center">
                                                        <FeatherIcon icon="alert-circle" size={20} className="mb-2"/>
                                                        <div className="mb-2">{props.t('no_modules')}</div>
                                                        <Button
                                                            color="success"
                                                            size="sm"
                                                        >
                                                            <FeatherIcon icon="plus-circle" size={14} className="me-1"/>
                                                            {props.t('create_first_module')}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default withTranslation()(Course);