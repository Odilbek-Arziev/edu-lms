import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, {useEffect, useState} from "react";
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
import {roleTypeColors} from "../../../utils/rolesMap";
import {closeLoading, showLoading} from "../../../utils/swal";
import {useModal} from "../../../Components/Hooks/useModal";
import UserDelete from "../../../Components/Custom/Users/UserDelete";
import UserEdit from "../../../Components/Custom/Users/UserEdit";
import {useRecaptchaSubmit} from "../../../hooks/useRecaptchaSubmit";
import {userForgetPassword} from "../../../slices/auth/forgetpwd/thunk";
import ReCAPTCHA from "react-google-recaptcha";
import {RootState} from "../../../slices";
import SearchInput from "../../../Components/Common/SearchInput";
import CustomSelect from "../../../Components/Common/CustomSelect";
import PaginationButtons from "../../../Components/Common/PaginationButtons";
import {rolesThunks} from "../../../slices/roles";
import {usersThunks} from "../../../slices/users";
import {withTranslation} from "react-i18next";
import {EditModalProps} from "../../../types/editModal";
import {useFetchData} from "../../../hooks/useFetchData";


const Users = (props: any) => {
    const [role, setRole] = useState<any>(null);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [registerType, setRegisterType] = useState<any>(null);
    const [status, setStatus] = useState<any>(null);
    const [perPage] = useState<number>(10);

    const dispatch = useDispatch<any>();

    const {loading, registerTypes = [], count} = useSelector((state: RootState) => state.Users);
    const {items: roles} = useSelector((state: RootState) => state.Roles);

    const {localData, isSearching, fetchData} = useFetchData(
        usersThunks.fetch,
        'users',
        () => ({
            page,
            perPage,
            ...(search && {search}),
            ...(registerType && {register_type: registerType}),
            ...(role && {role}),
            ...(status && {status})
        })
    );

    const {handleSubmit: handlePasswordReset, isLoading, recaptchaRef} = useRecaptchaSubmit({
        onSubmit: (payload) => dispatch(userForgetPassword(payload, props.history)),
        loadingTitle: `${props.t('message_sending')}...`,
        loadingText: props.t('wait'),
        showLoadingModal: true
    });

    const rolesOptions = roles?.map((item: any) => ({
        value: item.id,
        label: item.name,
    })) || [];

    const regTypesOptions = registerTypes?.map((item: any) => ({
        value: item.id,
        label: item.name,
    })) || [];

    const statusTypes = [
        {value: 'active', label: 'active'},
        {value: 'passive', label: 'passive'}
    ];

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <UserDelete
                {...props}
                onSuccess={() => {
                    fetchData()
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
                    fetchData()
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    async function getData(id: number) {
        const response = await dispatch(usersThunks.getById(id));

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

    async function handleStatus(id: number, isActive: boolean) {
        await dispatch(usersThunks.update(id, {is_active: !isActive}))
        fetchData()
    }

    const clearFilter = () => {
        setRole(null)
        setSearch('')
        setRegisterType(null)
        setStatus(null)
        setPage(1);
    }

    const resetUserPassword = (email: string) => {
        handlePasswordReset({email});
    };

    useEffect(() => {
        fetchData()
    }, [role, registerType, status, search, page])

    useEffect(() => {
        dispatch(usersThunks.getRegisterTypes());
        dispatch(rolesThunks.fetch());
    }, []);

    useEffect(() => {
        if (loading || isSearching) {
            showLoading()
        } else {
            closeLoading()
        }
    }, [loading, isSearching]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('users')} pageTitle={props.t('main')}/>
                    <div className='d-flex gap-1'>
                        <SearchInput
                            value={search}
                            onSearch={setSearch}
                        />
                        <CustomSelect
                            placeholder={props.t('select_role')}
                            value={role}
                            options={rolesOptions}
                            onChange={setRole}
                        />
                        <CustomSelect
                            placeholder={props.t('select_register_type')}
                            value={registerType}
                            options={regTypesOptions}
                            onChange={setRegisterType}
                        />
                        <CustomSelect
                            placeholder={props.t('select_status')}
                            value={status}
                            options={statusTypes}
                            onChange={setStatus}
                        />
                        <Button className='btn btn-secondary d-flex gap-1 align-items-center' onClick={clearFilter}>
                            <FeatherIcon color="white" size={12} icon="trash"/>
                            {props.t('clear')}
                        </Button>
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mt-2 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>{props.t('first_name')}</th>
                            <th>{props.t('last_name')}</th>
                            <th>{props.t('email')}</th>
                            <th>{props.t('register_type')}</th>
                            <th>{props.t('roles')}</th>
                            <th>{props.t('status')}</th>
                            <th>{props.t('phone')}</th>
                            <th>{props.t('tg_link')}</th>
                            <th>{props.t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="text-center">{props.t('loading')}...</td>
                            </tr>
                        ) : localData && localData.length > 0 ? (
                            localData.map((user: any, idx: number) => (
                                <tr key={user.id || idx}>
                                    <td>{idx + 1}</td>
                                    <td>{user.first_name?.length ? user.first_name : '-'}</td>
                                    <td>{user.last_name?.length ? user.last_name : '-'}</td>
                                    <td>{user.email}</td>
                                    <td>via {user.register_type?.name || '-'}</td>
                                    <td>
                                        {user.groups && user.groups.length > 0 ? user.groups.map((item: any) => (
                                            <span
                                                key={item.id}
                                                className={`badge ${roleTypeColors[item.name] ?? 'bg-secondary'} me-1`}
                                            >
                                                {props.t(item.name)}
                                            </span>
                                        )) : '-'}
                                    </td>
                                    <td>{user.is_active
                                        ? <span className='badge bg-success'>{props.t('active')}</span>
                                        : <span className='badge bg-danger'>{props.t('passive')}</span>}
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
                                                aria-label={props.t('actions')}
                                            >
                                                <FeatherIcon icon="more-vertical" size={16}/>
                                            </DropdownToggle>

                                            <DropdownMenu end className="dropdown-menu-end">
                                                <DropdownItem
                                                    className="d-flex align-items-center gap-2 text-warning"
                                                    onClick={() => getData(user.id)}
                                                >
                                                    <FeatherIcon icon="edit" size={14}/>
                                                    {props.t('edit')}
                                                </DropdownItem>

                                                <DropdownItem onClick={() => handleStatus(user.id, user.is_active)}>
                                                    {user.is_active ?
                                                        (
                                                            <span className="d-flex align-items-center gap-2 text-info">
                                                                <FeatherIcon icon="x" size={14}/>
                                                                {props.t('deactivate')}
                                                            </span>
                                                        ) :
                                                        (
                                                            <span className="d-flex align-items-center gap-2 text-info">
                                                                <FeatherIcon icon="check" size={14}/>
                                                                {props.t('activate')}
                                                            </span>
                                                        )}
                                                </DropdownItem>

                                                <DropdownItem
                                                    className="text-danger d-flex align-items-center gap-2"
                                                    onClick={() => showDelete({id: user.id})}
                                                >
                                                    <FeatherIcon icon="trash-2" size={14}/>
                                                    {props.t('delete')}
                                                </DropdownItem>
                                                <DropdownItem
                                                    className="text-secondary d-flex align-items-center gap-2"
                                                    onClick={() => resetUserPassword(user.email)}
                                                >
                                                    <FeatherIcon icon="lock" size={14}/>
                                                    {props.t('reset_password')}
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center">{props.t('no_data_found')}</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Container>
                <PaginationButtons
                    count={count}
                    currentPage={page}
                    perPageData={perPage}
                    setCurrentPage={(p) => {
                        setPage(p);
                        dispatch(usersThunks.fetch({page: 1}));
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
export default withTranslation()(Users);