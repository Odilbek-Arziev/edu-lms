import React, {useEffect} from 'react';
import {Button, Container, Row, Table} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {withTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {coursesThunks} from "../../../slices/courses";
import FeatherIcon from "feather-icons-react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../slices";


const Course = (props: any) => {
    const {id} = useParams<{ id: string }>();
    const courseId = id ? Number(id) : 0;

    const dispatch = useDispatch<any>();
    const {lessons} = useSelector((state: RootState) => state.Courses);

    useEffect(() => {
        dispatch(coursesThunks.getLessons(courseId))
    }, [])

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

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('course_page')} pageTitle={props.t('courses')} link='/courses'/>
                    <div className="d-flex justify-content-end my-2">
                        <Button className='btn btn-success d-flex gap-1 align-items-center'>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            {props.t('create', {item: props.t('lesson')})}
                        </Button>
                    </div>
                    <Row>
                        <Table
                            className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center'>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>{props.t('title')}</th>
                                <th>{props.t('module')}</th>
                                <th>{props.t('actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {lessons && lessons.length > 0 ? lessons.map((row: any, idx: string) => (
                                <tr key={row.id || idx}>
                                    <td>{idx + 1}</td>
                                    <td>{row.title}</td>
                                    <td>{row.module.title}</td>

                                    <td className='d-flex gap-1 justify-content-center'>
                                        <Button className='btn btn-info btn-sm editBtn'>
                                            <FeatherIcon color="white" size={12} icon="edit"/>
                                        </Button>
                                        <Button className='btn btn-danger btn-sm editBtn'>
                                            <FeatherIcon color="white" size={12} icon="trash"/>
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center">No data found</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default withTranslation()(Course);