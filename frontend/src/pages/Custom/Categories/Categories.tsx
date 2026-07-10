import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SearchInput from "../../../Components/Common/SearchInput";
import {withTranslation} from "react-i18next";
import {useFetchData} from "../../../hooks/useFetchData";
import {categoriesThunk} from "../../../slices/categories/reducer";
import {closeLoading, showLoading} from "../../../utils/swal";
import {useModal} from "../../../Components/Hooks/useModal";
import CategoryCreate from "../../../Components/Custom/Categories/CategoryCreate";
import CategoryEdit from "../../../Components/Custom/Categories/CategoryEdit";
import {EditModalProps} from "../../../types/editModal";
import {useDispatch} from "react-redux";
import CategoryDelete from "../../../Components/Custom/Categories/CategoryDelete";
import {useCrudModals} from "../../../hooks/useCrudModals";
import CourseCreate from "../../../Components/Custom/Courses/CourseCreate";
import CourseEdit from "../../../Components/Custom/Courses/CourseEdit";
import CourseDelete from "../../../Components/Custom/Courses/CourseDelete";

const Categories = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const dispatch = useDispatch<any>();

    const {localData: categories, isSearching, fetchData} = useFetchData(
        categoriesThunk.fetch,
        'categories',
        () => ({
            ...(search && {search}),
        })
    );

    const {showCreate, showEdit, showDelete} = useCrudModals(
        {create: CategoryCreate, edit: CategoryEdit, remove: CategoryDelete},
        {onChange: fetchData}
    );

    async function getData(id: number) {
        const response = await dispatch(categoriesThunk.getById(id));
        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    title: response.title
                }
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, [search]);

    useEffect(() => {
        if (isSearching) {
            showLoading(props.t('loading'), props.t('wait'));
        } else {
            closeLoading();
        }
    }, [isSearching]);

    document.title = props.t('categories_page');

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('categories')} pageTitle={props.t('main')}/>
                    <div className="d-flex justify-content-between my-2">
                        <div className='d-flex gap-1'>
                            <SearchInput
                                value={search}
                                onSearch={setSearch}
                            />
                            <Button className='btn btn-secondary d-flex gap-1 align-items-center'
                                    onClick={() => setSearch('')}>
                                <FeatherIcon color="white" size={12} icon="trash"/>
                                {props.t('clear')}
                            </Button>
                        </div>
                        <Button className='btn btn-success d-flex gap-1 align-items-center' onClick={showCreate}>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            {props.t('create', {item: props.t('category')})}
                        </Button>
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>{props.t('title')}</th>
                            <th>{props.t('slug')}</th>
                            <th>{props.t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories?.map((row: any, idx: number) => (
                            <tr key={row.id}>
                                <td>{idx + 1}</td>
                                <td>{row.title}</td>
                                <td>{row.slug}</td>
                                <td className='d-flex gap-1 justify-content-center'>
                                    <Button className='btn btn-info btn-sm' onClick={() => getData(row.id)}>
                                        <FeatherIcon color="white" size={12} icon="edit"/>
                                    </Button>
                                    <Button className='btn btn-danger btn-sm' onClick={() => showDelete({id: row.id})}>
                                        <FeatherIcon color="white" size={12} icon="trash"/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Categories);