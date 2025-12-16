import React, {useEffect, useState} from "react";
import {Button, Container, Input, Table} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {useDispatch, useSelector} from "react-redux";
import {fetchRoles} from "../../slices/roles/thunk";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../../Components/Hooks/useModal";
import MenuCreate from "../../Components/Custom/Menu/MenuCreate";
import {fetchMenu} from "../../slices/menu/thunk";
import RoleCreate from "../../Components/Custom/Roles/RoleCreate";


const Home = () => {
    const [search, setSearch] = useState<string>('');
    const dispatch = useDispatch<any>();

    const roles = useSelector((state: any) => state.Roles.items);

    const [showCreate, hideCreate] = useModal(
        <RoleCreate onSuccess={() => {
            dispatch(fetchRoles())
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    useEffect(() => {
        dispatch(fetchRoles())
    }, [])

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
                            <Button className='btn btn-secondary d-flex gap-1 align-items-center'>
                                <FeatherIcon color="white" size={12} icon="trash"/>
                                Clear
                            </Button>
                        </div>
                        <Button className='btn btn-success d-flex gap-1 align-items-center' onClick={showCreate}>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            Create
                        </Button>
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {roles ? roles.map((row: any, idx: number) => (
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{row.name}</td>
                                <td className='d-flex gap-1'>
                                    <Button className='btn btn-info btn-sm editBtn'>
                                        <FeatherIcon color="white" size={12} icon="edit"/>
                                    </Button>
                                    <Button className='btn btn-danger btn-sm editBtn'>
                                        <FeatherIcon color="white" size={12} icon="trash"/>
                                    </Button>
                                    <Button
                                        className='btn btn-success btn-sm permissionsBtn d-flex gap-1 align-items-center'>
                                        <FeatherIcon color="white" size={12} icon="list"/>
                                        Permissions
                                    </Button>
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
