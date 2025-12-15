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
import {fetchMenu} from "../../slices/menu/thunk";


const Menu = () => {
    const menu = useSelector((state: any) => state.Menu.items);
    const dispatch = useDispatch<any>();

    const [showCreate, hideCreate] = useModal(
        <MenuCreate onSuccess={() => {
            dispatch(fetchMenu())
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )
    const tableData = flattenMenu(menu)

    useEffect(() => {
        dispatch(fetchRoles())
        dispatch(fetchIcons())
    }, [dispatch])

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
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData ? tableData.map((row, idx) => (
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{row.title}</td>
                                <td>{row.parent ?? '-'}</td>
                                <td>{row.url_path}</td>
                                <td>{row.status
                                    ? <span className='badge bg-success'>active</span>
                                    : <span className='badge bg-danger'>passive</span>}
                                </td>
                                <td className='d-flex gap-1'>
                                    <Button className='btn btn-info btn-sm editBtn'>
                                        <FeatherIcon color="white" size={12} icon="edit"/>
                                    </Button>
                                    <Button className='btn btn-danger btn-sm editBtn'>
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
