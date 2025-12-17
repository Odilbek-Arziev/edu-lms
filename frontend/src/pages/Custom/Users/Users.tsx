import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, {useEffect} from "react";
import {
    Button,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    Table,
    UncontrolledDropdown
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useDispatch, useSelector} from "react-redux";
import {fetchUsers} from "../../../slices/users/thunk";
import {roleTypeColors} from "../../../utils/rolesMap";

const Swal = require("sweetalert2");

const Users = () => {
    const dispatch = useDispatch<any>();

    const {users, loading} = useSelector((state: any) => state.Users);

    useEffect(() => {
        dispatch(fetchUsers())
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
    console.log(users)
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Users" pageTitle="Dashboards"/>
                    <div className='d-flex gap-1'>
                        <div className="search-box">
                            <Input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                            />
                            <i className="ri-search-line search-icon"/>
                        </div>
                        <Button className='btn btn-secondary d-flex gap-1 align-items-center'>
                            <FeatherIcon color="white" size={12} icon="trash"/>
                            Clear
                        </Button>
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mt-2 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users ? users.map((user: any, idx: number) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{user.first_name.length ? user.first_name : '-'}</td>
                                <td>{user.last_name.length ? user.last_name : '-'}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.groups && user.groups.length > 0 ? user.groups.map((item: any) => (
                                        <span
                                            key={item.id}
                                            className={`badge ${roleTypeColors[item.name] ?? 'bg-secondary'} me-1`}
                                        >
                                            {item.name}
                                        </span>
                                    )) : '-'}
                                </td>
                                <td>{user.is_active
                                    ? <span className='badge bg-success'>active</span>
                                    : <span className='badge bg-danger'>passive</span>}
                                </td>
                                <td className="text-center">
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            tag="button"
                                            className="btn btn-light btn-icon btn-sm"
                                            aria-label="Действия"
                                        >
                                            <FeatherIcon icon="more-vertical" size={16}/>
                                        </DropdownToggle>

                                        <DropdownMenu end className="dropdown-menu-end">
                                            <DropdownItem>
                                                {user.is_active ?
                                                    (
                                                        <span className="d-flex align-items-center gap-2 text-info">
                                                            <FeatherIcon icon="x" size={14}/>
                                                            Деактивировать
                                                        </span>
                                                    ) :
                                                    (
                                                        <span className="d-flex align-items-center gap-2 text-info">
                                                            <FeatherIcon icon="check" size={14}/>
                                                            Активировать
                                                        </span>
                                                    )}
                                            </DropdownItem>
                                            <DropdownItem
                                                className="d-flex align-items-center gap-2 text-warning"
                                            >
                                                <FeatherIcon icon="edit" size={14}/>
                                                Редактировать
                                            </DropdownItem>

                                            <DropdownItem
                                                className="text-danger d-flex align-items-center gap-2"
                                            >
                                                <FeatherIcon icon="trash-2" size={14}/>
                                                Удалить
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </td>
                            </tr>
                        )) : null}
                        </tbody>
                    </Table>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default Users;