import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, Col, Container, Row} from "reactstrap";
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


const Courses = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [localData, setLocalData] = useState<any[]>([]);
    const [selectedLang, setSelectedLang] = useState<number | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const dispatch = useDispatch<any>();
    const {items, loading, count, languages, levels, categories} = useSelector((state: RootState) => state.Courses);

    const categoriesOptions = categories?.map((item: any) => ({
        value: item.id,
        label: item.title,
    })) || [];

    const fetchData = async () => {
        setIsSearching(true);

        try {
            const params: any = {
                skipReduxUpdate: true
            };

            if (search) {
                params.search = search;
            }

            if (selectedLang) {
                params.language = selectedLang;
            }

            if (selectedCategory) {
                params.category = selectedCategory;
            }

            if (selectedLevel) {
                params.level = selectedLevel;
            }

            const response = await dispatch(coursesThunks.fetch(params));

            if (response) {
                const data = response.results || response.data || response;
                setLocalData(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error(`${props.t('error_fetching_data', {type: 'courses'})}:`, error);
        } finally {
            setIsSearching(false);
        }
    };

    const clearFilter = () => {
        setSearch('')
    }

    useEffect(() => {
        dispatch(coursesThunks.getCategories())
        dispatch(coursesThunks.getLanguages())
        dispatch(coursesThunks.getLevels())
    }, [])

    useEffect(() => {
        fetchData()
    }, [search, selectedLang, selectedCategory, selectedLevel])

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
                                options={categoriesOptions || []}
                                onChange={setSelectedCategory}
                            />
                            <Button className='btn btn-secondary d-flex gap-1 align-items-center' onClick={clearFilter}>
                                <FeatherIcon color="white" size={12} icon="trash"/>
                                {props.t('clear')}
                            </Button>
                        </div>
                        <Button className='btn btn-success d-flex gap-1 align-items-center'>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            {props.t('create')}
                        </Button>
                    </div>
                    <Row>
                        {localData ? localData.map((item: any, key: number) => (
                            <Col xl={3} md={6} key={key}>
                                <Card className="card-animate">
                                    <CardBody>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 overflow-hidden">
                                                <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                                    {item.category.title}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h5 className="fs-14 mb-0">
                                                    {item.level}
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-end justify-content-between mt-4">
                                            <div>
                                                <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                                    {item.title}
                                                </h4>
                                                <Link to="#"
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