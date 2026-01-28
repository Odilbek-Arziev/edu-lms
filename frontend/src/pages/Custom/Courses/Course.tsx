import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Row} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {withTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {coursesThunks} from "../../../slices/courses";
import FeatherIcon from "feather-icons-react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../slices";
import {closeLoading, showLoading} from "../../../utils/swal";
import '../../../assets/scss/pages/_course.scss';

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
            setExpandedNodes(new Set([`module-0`]));
        }
    }, [currentCourse]);

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

                        <Button className='btn btn-success d-flex gap-1 align-items-center'>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            {props.t('create', {item: props.t('lesson')})}
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

                                        {isExpanded('course') && (
                                            <div className="tree-children ms-4">
                                                {currentCourse?.modules && currentCourse.modules.length > 0 ? (
                                                    currentCourse.modules.map((module: any, moduleIndex: number) => (
                                                        <div key={module.id || moduleIndex} className="tree-node mb-2">
                                                            <div
                                                                className="tree-node-header d-flex align-items-center p-2 bg-white border rounded tree-hover"
                                                                style={{cursor: "pointer"}}
                                                                onClick={() => toggleNode(`module-${moduleIndex}`)}
                                                            >
                                                                <FeatherIcon
                                                                    icon={isExpanded(`module-${moduleIndex}`) ? 'chevron-down' : 'chevron-right'}
                                                                    size={16}
                                                                    className="me-2"
                                                                />
                                                                <FeatherIcon icon="folder" size={16} className="me-2 text-warning"/>
                                                                <span className="fw-medium">{module.title}</span>
                                                                <span className="badge bg-secondary ms-auto">
                                                                    {module.lessons?.length || 0} {props.t('lessons')}
                                                                </span>
                                                            </div>

                                                            {isExpanded(`module-${moduleIndex}`) && (
                                                                <div className="tree-children ms-4 mt-2">
                                                                    {module?.lessons && module.lessons.length > 0 ? (
                                                                        module.lessons.map((lesson: any, lessonIndex: number) => (
                                                                            <div
                                                                                key={lesson.id || lessonIndex}
                                                                                className="tree-node-leaf d-flex align-items-center p-2 border-start border-2 ps-3 mb-1 tree-leaf-hover"
                                                                                style={{cursor: "pointer", transition: "all 0.2s"}}
                                                                            >
                                                                                <FeatherIcon
                                                                                    icon="file-text"
                                                                                    size={14}
                                                                                    className="me-2 text-info"
                                                                                />
                                                                                <span>{lesson.title}</span>
                                                                                {lesson.duration && (
                                                                                    <span className="text-muted ms-auto small">
                                                                                        {lesson.duration} {props.t('min')}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="text-muted p-2 small">
                                                                            <FeatherIcon icon="info" size={14} className="me-1"/>
                                                                            {props.t('no_lessons')}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-muted p-3 text-center">
                                                        <FeatherIcon icon="alert-circle" size={20} className="mb-2"/>
                                                        <div>{props.t('no_modules')}</div>
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