import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, {useEffect, useMemo, useState} from "react";
import {
    Button,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Table,
    UncontrolledDropdown
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import {useDispatch, useSelector} from "react-redux";
import {editUser, fetchUsers, getRegisterTypes, getUser} from "../../../slices/users/thunk";
import {roleTypeColors} from "../../../utils/rolesMap";
import {closeLoading, showLoading} from "../../../utils/swal";
import {useModal} from "../../../Components/Hooks/useModal";
import UserDelete from "../../../Components/Custom/Users/UserDelete";
import UserEdit from "../../../Components/Custom/Users/UserEdit";
import {fetchRoles} from "../../../slices/roles/thunk";
import {useRecaptchaSubmit} from "../../../hooks/useRecaptchaSubmit";
import {userForgetPassword} from "../../../slices/auth/forgetpwd/thunk";
import ReCAPTCHA from "react-google-recaptcha";
import {RootState} from "../../../slices";
import SearchInput from "../../../Components/Common/SearchInput";
import CustomSelect from "../../../Components/Common/RoleSelect";
import PaginationButtons from "../../../Components/Common/PaginationButtons";
import {PER_PAGE} from "../../../constants";

type EditModalProps = {
    id: number;
    initialValues: any;
};

const Users = (props: any) => {
    const [role, setRole] = useState<any>(null);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [registerType, setRegisterType] = useState<any>(null);
    const [status, setStatus] = useState<any>(null);

    const dispatch = useDispatch<any>();
    const {items: users, loading, registerTypes, count} = useSelector((state: RootState) => state.Users);
    const roles = useSelector((state: RootState) => state.Roles.items);
    const {handleSubmit: handlePasswordReset, isLoading, recaptchaRef} = useRecaptchaSubmit({
        onSubmit: (payload) => dispatch(userForgetPassword(payload, props.history)),
        loadingTitle: "Отправка письма...",
        loadingText: "Пожалуйста, подождите",
        showLoadingModal: true
    });

    const rolesOptions = [
        ...roles.map((item: any) => ({
            value: item.id,
            label: item.name,
        }))
    ];

    const regTypesOptions = [
        ...registerTypes.map((item: any) => ({
            value: item.id,
            label: item.name,
        }))
    ];

    const statusTypes = [
        {value: 'active', label: 'active'},
        {value: 'passive', label: 'passive'}
    ]

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <UserDelete
                {...props}
                onSuccess={() => {
                    dispatch(fetchUsers());
                    hideDelete();
                }}
                onCancel={() => hideDelete()}
            />
        )
    );

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) => (
            <UserEdit
                {...props}
                onSuccess={() => {
                    dispatch(fetchUsers());
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    async function getData(id: number) {
        const response = await dispatch(getUser(id));
        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    first_name: response.first_name,
                    last_name: response.last_name,
                    email: response.email,
                    phone_number: response.phone_number,
                    telegram_link: response.telegram_link,
                    groups_ids: response.groups?.map((g: any) => g.id) || []
                }
            });
        }
    }

    const tableData = useMemo(() => {
        let data = users;

        if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter((user: any) =>
                user.first_name?.toLowerCase().includes(searchLower) ||
                user.last_name?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower) ||
                user.phone_number?.includes(searchLower)
            );
        }

        if (role) {
            data = data.filter((user: any) => {
                return user.groups?.some((r: any) => r.id === role);
            });
        }

        if (registerType) {
            data = data.filter((user: any) => {
                return user.register_type.id === registerType
            });
        }

        if (status) {
            data = data.filter((user: any) =>
                status === 'active' ? user.is_active : !user.is_active
            )
        }

        return data;

    }, [search, users, role, registerType, status]);

    async function handleStatus(id: number, isActive: boolean) {
        await dispatch(editUser(id, {is_active: !isActive}))
        dispatch(fetchUsers());
    }

    const clearFilter = () => {
        setRole(null)
        setSearch('')
        setRegisterType('')
        setStatus('')
    }

    const resetUserPassword = (email: string) => {
        handlePasswordReset({email});
    };

    useEffect(() => {
        dispatch(fetchUsers())
        dispatch(fetchRoles())
        dispatch(getRegisterTypes())
    }, [])

    useEffect(() => {
        if (loading) {
            showLoading()
        } else {
            closeLoading()
        }
    }, [loading]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Users" pageTitle="Dashboards"/>
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
                        <CustomSelect
                            placeholder="Select register type..."
                            value={registerType}
                            options={regTypesOptions}
                            onChange={setRegisterType}
                        />
                        <CustomSelect
                            placeholder="Select status..."
                            value={status}
                            options={statusTypes}
                            onChange={setStatus}
                        />
                        <Button className='btn btn-secondary d-flex gap-1 align-items-center' onClick={clearFilter}>
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
                            <th>Register type</th>
                            <th>Roles</th>
                            <th>Status</th>
                            <th>Phone</th>
                            <th>Telegram Link</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData ? tableData.map((user: any, idx: number) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{user.first_name.length ? user.first_name : '-'}</td>
                                <td>{user.last_name.length ? user.last_name : '-'}</td>
                                <td>{user.email}</td>
                                <td>via {user.register_type.name}</td>
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
                                <td>{user.phone_number ? user.phone_number : '-'}</td>
                                <td>
                                    {user.telegram_link ? (
                                        <a
                                            href={`https://t.me/${user.telegram_link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            https://t.me/{user.telegram_link}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
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
                                            <DropdownItem
                                                className="d-flex align-items-center gap-2 text-warning"
                                                onClick={() => getData(user.id)}
                                            >
                                                <FeatherIcon icon="edit" size={14}/>
                                                Редактировать
                                            </DropdownItem>

                                            <DropdownItem onClick={() => handleStatus(user.id, user.is_active)}>
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
                                                className="text-danger d-flex align-items-center gap-2"
                                                onClick={() => showDelete({id: user.id})}
                                            >
                                                <FeatherIcon icon="trash-2" size={14}/>
                                                Удалить
                                            </DropdownItem>
                                            <DropdownItem
                                                className="text-secondary d-flex align-items-center gap-2"
                                                onClick={() => resetUserPassword(user.email)}
                                            >
                                                <FeatherIcon icon="lock" size={14}/>
                                                Сбросить пароль
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </td>
                            </tr>
                        )) : null}
                        </tbody>
                    </Table>
                </Container>
                <PaginationButtons
                    count={count}
                    currentPage={page}
                    perPageData={PER_PAGE}
                    setCurrentPage={(p) => {
                        setPage(p);
                        dispatch(fetchUsers({page: p}));
                    }}
                />
            </div>
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!}
                size="invisible"
            />
        </React.Fragment>
    )
}
export default Users;