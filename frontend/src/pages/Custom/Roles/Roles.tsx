import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import FeatherIcon from "feather-icons-react";
import RoleCreate from "../../../Components/Custom/Roles/RoleCreate";
import RoleDelete from "../../../Components/Custom/Roles/RoleDelete";
import RoleEdit from "../../../Components/Custom/Roles/RoleEdit";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {Link} from "react-router-dom";
import {closeLoading, showLoading} from "../../../utils/swal";
import {RootState} from "../../../slices";
import PaginationButtons from "../../../Components/Common/PaginationButtons";
import {rolesThunks} from "../../../slices/roles";
import {withTranslation} from "react-i18next";
import {useFetchData} from "../../../hooks/useFetchData";
import {useCrudModals} from "../../../hooks/useCrudModals";
import FilterBar from "../../../Components/Custom/FilterBar";


const Roles = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [perPage] = useState<number>(10);

    const dispatch = useDispatch<any>();
    const {loading, count} = useSelector((state: RootState) => state.Roles);
    const {localData, isSearching, fetchData} = useFetchData(
        rolesThunks.fetch,
        'roles',
        () => ({
            page,
            perPage,
            ...(search && {search}),
        })
    );

    const {showCreate, showEdit, showDelete} = useCrudModals(
        {create: RoleCreate, edit: RoleEdit, remove: RoleDelete},
        {onChange: fetchData}
    );

    const clearFilter = () => {
        setSearch('')
        setPage(1);
    }

    async function getData(id: number) {
        const response = await dispatch(rolesThunks.getById(id));
        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    name: response.name
                }
            });
        }
    }

    useEffect(() => {
        fetchData()
    }, [search, page])

    useEffect(() => {
        if (loading || isSearching) {
            showLoading()
        } else {
            closeLoading()
        }
    }, [loading, isSearching]);

    document.title = props.t('roles_page')

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('roles_page')} pageTitle={props.t('main')}/>
                    <FilterBar
                        search={search}
                        onSearch={setSearch}
                        onClear={() => setSearch('')}
                        onCreate={showCreate}
                        createLabel={props.t('create', {item: props.t('role')})}
                    />
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>{props.t('name')}</th>
                            <th>{props.t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {localData ? localData.map((row: any, idx: number) => (
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{props.t(row.name)}</td>
                                <td className='d-flex gap-1 justify-content-center'>
                                    <Button className='btn btn-info btn-sm editBtn' onClick={() => getData(row.id)}>
                                        <FeatherIcon color="white" size={12} icon="edit"/>
                                    </Button>
                                    <Button className='btn btn-danger btn-sm editBtn'
                                            onClick={() => showDelete({id: row.id})}>
                                        <FeatherIcon color="white" size={12} icon="trash"/>
                                    </Button>
                                    <Link
                                        className='btn btn-success btn-sm permissionsBtn d-flex gap-1 align-items-center'
                                        to={`/role-permissions/${row.id}`}>
                                        <FeatherIcon color="white" size={12} icon="list"/>
                                        {props.t('permissions')}
                                    </Link>
                                </td>
                            </tr>
                        )) : null}
                        </tbody>
                    </Table>
                </Container>
                <PaginationButtons
                    count={count}
                    currentPage={page}
                    perPageData={perPage}
                    setCurrentPage={(p) => {
                        setPage(p);
                        dispatch(rolesThunks.fetch({page: 1}));
                    }}
                />
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Roles);