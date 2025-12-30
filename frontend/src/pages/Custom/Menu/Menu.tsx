import React, {useEffect, useState} from "react";
import {Button, Container, Input, Table} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../../../Components/Hooks/useModal";
import MenuCreate from "../../../Components/Custom/Menu/MenuCreate";
import MenuDelete from "../../../Components/Custom/Menu/MenuDelete";
import MenuEdit from "../../../Components/Custom/Menu/MenuEdit";
import {flattenMenu} from "../../../utils/flatten";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {roleTypeColors} from "../../../utils/rolesMap";
import {closeLoading, showLoading} from "../../../utils/swal";
import {RootState} from "../../../slices";
import SearchInput from "../../../Components/Common/SearchInput";
import CustomSelect from "../../../Components/Common/RoleSelect";
import PaginationButtons from "../../../Components/Common/PaginationButtons";
import {menuThunks} from "../../../slices/menu";
import {rolesThunks} from "../../../slices/roles";
import {iconsThunks} from "../../../slices/icons";


type EditModalProps = {
    id: number;
    initialValues: any;
};

const Menu = () => {
    const [search, setSearch] = useState<string>('');
    const [role, setRole] = useState<any>(null);
    const [page, setPage] = useState<number>(1);
    const [perPage] = useState<number>(10);

    const [localMenuData, setLocalMenuData] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const dispatch = useDispatch<any>();
    const {items: menu, loading} = useSelector((state: RootState) => state.Menu);
    const roles = useSelector((state: any) => state.Roles.items);

    const hasActiveFilters = search || role !== null;

    const rolesOptions = roles.map((item: any) => ({
        value: item.id,
        label: item.name,
    }))

    const [showCreate, hideCreate] = useModal(
        <MenuCreate onSuccess={() => {
            if (hasActiveFilters) {
                fetchMenuData();
            } else {
                dispatch(menuThunks.fetch());
            }
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <MenuDelete
                {...props}
                onSuccess={() => {
                    if (hasActiveFilters) {
                        fetchMenuData();
                    } else {
                        dispatch(menuThunks.fetch());
                    }
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
                    if (hasActiveFilters) {
                        fetchMenuData();
                    } else {
                        dispatch(menuThunks.fetch());
                    }
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    const fetchMenuData = async () => {
        setIsSearching(true);

        try {
            const params: any = {
                page,
                perPage,
                skipReduxUpdate: true,
            };

            if (search) {
                params.search = search;
            }

            if (role) {
                params.roleId = role;
            }

            const response = await dispatch(menuThunks.fetch(params));

            if (response) {
                const data = response.results || response.data || response;
                const total = response.count || response.total || (Array.isArray(data) ? data.length : 0);

                setLocalMenuData(Array.isArray(data) ? data : []);
                setTotalCount(total);
            }
        } catch (error) {
            console.error('Error fetching menu data:', error);
        } finally {
            setIsSearching(false);
        }
    };

    async function getData(id: number) {
        const response = await dispatch(menuThunks.getById(id))
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
        setPage(1);
        setLocalMenuData([]);
        setTotalCount(0);
    }

    useEffect(() => {
        dispatch(menuThunks.fetch())
        dispatch(rolesThunks.fetch());
        dispatch(iconsThunks.fetch());
    }, [dispatch])

    useEffect(() => {
        if (hasActiveFilters) {
            fetchMenuData();
        }
    }, [search, role, page]);

    useEffect(() => {
        if (loading || isSearching) {
            showLoading('Загрузка меню', 'Пожалуйста, подождите...');
        } else {
            closeLoading()
        }
    }, [loading, isSearching]);

    const tableData = hasActiveFilters ? localMenuData : flattenMenu(menu || []);

    const paginatedData = hasActiveFilters
        ? tableData
        : tableData.slice((page - 1) * perPage, page * perPage);

    const count = hasActiveFilters ? totalCount : tableData.length;

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
                                onSearch={setSearch}
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
                                <td>{(page - 1) * perPage + idx + 1}</td>
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
                    perPageData={perPage}
                    setCurrentPage={setPage}
                />
            </div>
        </React.Fragment>
    );
};

export default Menu;