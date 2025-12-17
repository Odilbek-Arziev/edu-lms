import React, {useEffect, useMemo, useState} from "react";
import {Button, Container, Input, Table} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../../../Components/Hooks/useModal";
import RoleCreate from "../../../Components/Custom/Roles/RoleCreate";
import {fetchRoles, getRoleItem} from "../../../slices/roles/thunk";
import RoleDelete from "../../../Components/Custom/Roles/RoleDelete";
import RoleEdit from "../../../Components/Custom/Roles/RoleEdit";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {Link} from "react-router-dom";

type EditModalProps = {
    id: number;
    initialValues: any;
};

const Swal = require("sweetalert2");

const Home = () => {
    const [search, setSearch] = useState<string>('');
    const dispatch = useDispatch<any>();

    const {items: roles, loading} = useSelector((state: any) => state.Roles);

    const [showCreate, hideCreate] = useModal(
        <RoleCreate onSuccess={() => {
            dispatch(fetchRoles())
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <RoleDelete
                {...props}
                onSuccess={() => {
                    dispatch(fetchRoles());
                    hideDelete();
                }}
                onCancel={() => hideDelete()}
            />
        )
    );

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) => (
            <RoleEdit
                {...props}
                onSuccess={() => {
                    dispatch(fetchRoles());
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    const tableData = useMemo(() => {
        let roleItems = roles;

        if (search) {
            const searchLower = search.toLowerCase();
            roleItems = roleItems.filter((item: any) =>
                item.name?.toLowerCase().includes(searchLower)
            );
        }
        return roleItems;

    }, [search, roles]);

    async function getData(id: number) {
        const response = await dispatch(getRoleItem(id));
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
        dispatch(fetchRoles())
    }, [])

    useEffect(() => {
        if (loading) {
            Swal.fire({
                title: 'Загрузка меню',
                text: 'Пожалуйста, подождите...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        } else {
            Swal.close();
        }
    }, [loading]);

    document.title = "Dashboard | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Roles" pageTitle="Dashboards"/>
                    <div className="d-flex justify-content-between my-2">
                        <div className='d-flex gap-1'>
                            <div className="search-box">
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <i className="ri-search-line search-icon"/>
                            </div>
                            <Button className='btn btn-secondary d-flex gap-1 align-items-center'
                                    onClick={() => setSearch('')}>
                                <FeatherIcon color="white" size={12} icon="trash"/>
                                Clear
                            </Button>
                        </div>
                        <Button className='btn btn-success d-flex gap-1 align-items-center' onClick={showCreate}>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            Create
                        </Button>
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData ? tableData.map((row: any, idx: number) => (
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{row.name}</td>
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
                                        Permissions
                                    </Link>
                                </td>
                            </tr>
                        )) : null}
                        </tbody>
                    </Table>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Home;
