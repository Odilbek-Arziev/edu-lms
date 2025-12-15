import React, {useEffect} from "react";
import {Button, Container, Table} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {useDispatch, useSelector} from "react-redux";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../../Components/Hooks/useModal";
import MenuCreate from "../../Components/Custom/MenuCreate";
import {flattenMenu} from "../../utils/flatten";
import {fetchIcons} from "../../slices/icons/thunk";
import {fetchRoles} from "../../slices/roles/thunk";
import {fetchMenu, getMenuItem} from "../../slices/menu/thunk";
import MenuDelete from "../../Components/Custom/MenuDelete";
import MenuEdit from "../../Components/Custom/MenuEdit";
import {roleTypeColors} from "../../utils/rolesMap";


const Swal = require("sweetalert2");

const Menu = () => {
    const {items: menu, loading} = useSelector((state: any) => state.Menu);
    const dispatch = useDispatch<any>();

    type EditModalProps = {
        id: number;
        initialValues: any;
    };

    const [showCreate, hideCreate] = useModal(
        <MenuCreate onSuccess={() => {
            dispatch(fetchMenu())
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <MenuDelete
                {...props}
                onSuccess={() => {
                    dispatch(fetchMenu());
                    hideDelete();
                }}
                onCancel={() => hideDelete()}
            />
        )
    );

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) => (
            <MenuEdit
                {...props}
                onSuccess={() => {
                    dispatch(fetchMenu());
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    const tableData = flattenMenu(menu)

    useEffect(() => {
        dispatch(fetchRoles())
        dispatch(fetchIcons())
    }, [dispatch])

    async function getData(id: number) {
        const response = await dispatch(getMenuItem(id));
        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    ...response,
                    groups_ids: response.groups?.map((g: any) => g.id) || []
                }
            });
        }
    }

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
                    <BreadCrumb title="Menu" pageTitle="Dashboards"/>
                    <div className="d-flex justify-content-end my-2">
                        <Button className='btn btn-success d-flex gap-1 align-items-center' onClick={showCreate}>
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            Create
                        </Button>
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Title</th>
                            <th>Parent</th>
                            <th>Path</th>
                            <th>Status</th>
                            <th>Roles</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData ? tableData.map((row, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{row.title}</td>
                                <td>{row.parent ?? '-'}</td>
                                <td>{row.url_path}</td>
                                <td>{row.status
                                    ? <span className='badge bg-success'>active</span>
                                    : <span className='badge bg-danger'>passive</span>}
                                </td>
                                <td>
                                    {row.roles.map((item: any) => (
                                        <span
                                            key={item.id}
                                            className={`badge ${roleTypeColors[item.name] ?? 'bg-secondary'} me-1`}
                                        >
                                            {item.name}
                                        </span>
                                    ))}
                                </td>
                                <td className='d-flex gap-1'>
                                    <Button className='btn btn-info btn-sm editBtn' onClick={() => getData(row.id)}>
                                        <FeatherIcon color="white" size={12} icon="edit"/>
                                    </Button>
                                    <Button className='btn btn-danger btn-sm editBtn'
                                            onClick={() => showDelete({id: row.id})}>
                                        <FeatherIcon color="white" size={12} icon="trash"/>
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

export default Menu;
