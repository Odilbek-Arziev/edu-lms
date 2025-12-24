import React, {useEffect, useState, useMemo} from "react";
import {Button, Container, Input, Table} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../../../Components/Hooks/useModal";
import MenuCreate from "../../../Components/Custom/Menu/MenuCreate";
import {fetchMenu, getMenuItem} from "../../../slices/menu/thunk";
import MenuDelete from "../../../Components/Custom/Menu/MenuDelete";
import MenuEdit from "../../../Components/Custom/Menu/MenuEdit";
import {flattenMenu} from "../../../utils/flatten";
import {fetchRoles} from "../../../slices/roles/thunk";
import {fetchIcons} from "../../../slices/icons/thunk";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {roleTypeColors} from "../../../utils/rolesMap";
import {closeLoading, showLoading} from "../../../utils/swal";
import {RootState} from "../../../slices";
import SearchInput from "../../../Components/Common/SearchInput";
import CustomSelect from "../../../Components/Common/RoleSelect";
import PaginationButtons from "../../../Components/Common/PaginationButtons";
import {fetchLanguageLines} from "../../../slices/languageLines/thunk";
import {PER_PAGE} from "../../../constants";


type EditModalProps = {
    id: number;
    initialValues: any;
};

const Menu = () => {
    const [search, setSearch] = useState<string>('');
    const [role, setRole] = useState<any>(null);
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(0);
    const [perPage] = useState<number>(10);

    const dispatch = useDispatch<any>();
    const {items: menu, loading} = useSelector((state: RootState) => state.Menu);
    const roles = useSelector((state: any) => state.Roles.items);

    const rolesOptions = roles.map((item: any) => ({
        value: item.id,
        label: item.name,
    }))

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

    const tableData = useMemo(() => {
        if (!menu) return [];

        let flattened = flattenMenu(menu);

        if (search) {
            const searchLower = search.toLowerCase();
            flattened = flattened.filter((item: any) =>
                item.title?.toLowerCase().includes(searchLower) ||
                item.url_path?.toLowerCase().includes(searchLower)
            );
        }

        if (role) {
            flattened = flattened.filter((item: any) => {
                return item.roles?.some((r: any) => r.id === role);
            });
        }

        return flattened;

    }, [menu, search, role]);

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

    function clearFilter() {
        setRole(null)
        setSearch('')
    }

    useEffect(() => {
        dispatch(fetchMenu());
        dispatch(fetchRoles())
        dispatch(fetchIcons())
    }, [dispatch])

    useEffect(() => {
        if (loading) {
            showLoading('Загрузка меню', 'Пожалуйста, подождите...');
        } else {
            closeLoading()
        }
    }, [loading]);

    useEffect(() => {
        setCount(tableData.length);
    }, [tableData]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * perPage;
        return tableData.slice(start, start + perPage);
    }, [tableData, page]);

    document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Menu" pageTitle="Dashboards"/>
                    <div className="d-flex justify-content-between my-2">
                        <div className='d-flex gap-1'>
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                            />
                            <CustomSelect
                                placeholder='Select role...'
                                value={role}
                                options={rolesOptions}
                                onChange={setRole}
                            />
                            <Button className='btn btn-secondary d-flex gap-1 align-items-center' onClick={clearFilter}>
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
                            <th>Title</th>
                            <th>Parent</th>
                            <th>Path</th>
                            <th>Status</th>
                            <th>Roles</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData && paginatedData.length > 0 ? paginatedData.map((row, idx) => (
                            <tr key={row.id || idx}>
                                <td>{idx + 1}</td>
                                <td>{row.title}</td>
                                <td>{row.parent ?? '-'}</td>
                                <td>{row.url_path}</td>
                                <td>{row.status
                                    ? <span className='badge bg-success'>active</span>
                                    : <span className='badge bg-danger'>passive</span>}
                                </td>
                                <td>
                                    {row.roles && row.roles.length > 0 ? row.roles.map((item: any) => (
                                        <span
                                            key={item.id}
                                            className={`badge ${roleTypeColors[item.name] ?? 'bg-secondary'} me-1`}
                                        >
                                            {item.name}
                                        </span>
                                    )) : '-'}
                                </td>
                                <td className='d-flex gap-1 justify-content-center'>
                                    <Button className='btn btn-info btn-sm editBtn' onClick={() => getData(row.id)}>
                                        <FeatherIcon color="white" size={12} icon="edit"/>
                                    </Button>
                                    <Button className='btn btn-danger btn-sm editBtn'
                                            onClick={() => showDelete({id: row.id})}>
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
                </Container>
                <PaginationButtons
                    count={count}
                    currentPage={page}
                    perPageData={PER_PAGE}
                    setCurrentPage={(p) => {
                        setPage(p);
                        dispatch(fetchMenu({page: p}));
                    }}
                />
            </div>
        </React.Fragment>
    );
};

export default Menu;