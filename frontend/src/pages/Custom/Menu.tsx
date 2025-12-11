import React, {useEffect} from "react";
import {Button, Container, Table} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {useSelector} from "react-redux";
import FeatherIcon from "feather-icons-react";


const Menu = () => {
    const menu = useSelector((state: any) => state.Menu.items);

    const flattenMenu = (items: any[], parent: string | null = null): any[] => {
        let result: any[] = [];

        items.forEach((item) => {
            result.push({
                title: item.title,
                url_path: item.url_path,
                status: item.status,
                parent: parent
            })

            if (item?.children && item.children?.length > 0) {
                result = result.concat(flattenMenu(item.children, item.title))
            }
        })

        return result
    }

    const tableData = flattenMenu(menu)

    document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Menu" pageTitle="Dashboards"/>
                    <div className="d-flex justify-content-end my-2">
                        <Button className='btn btn-success d-flex gap-1 align-items-center'>
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
