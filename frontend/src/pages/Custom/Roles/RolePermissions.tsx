import React, {useEffect, useState} from 'react'
import {Container, Input, Label, Spinner} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {closeLoading, showError, showLoading, showSuccess} from "../../../utils/swal";
import {RootState} from "../../../slices";
import {rolesThunks} from "../../../slices/roles";
import {withTranslation} from "react-i18next";


const RolePermissions = (props: any) => {
    const [loader, setLoader] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const {id} = useParams();
    let navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const {currentRole, loading, error} = useSelector((state: RootState) => state.Roles);

    useEffect(() => {
        const roleId = Number(id);

        if (id && !isNaN(roleId)) {
            dispatch(rolesThunks.getById(roleId));
        } else {
            console.error(`${props.t('invalid_role_id')}:`, id);
        }
    }, [id]);

    useEffect(() => {
        if (currentRole?.role_permissions) {
            setSelectedPermissions(currentRole.role_permissions);
        }
    }, [currentRole]);

    const handlePermissionToggle = (permissionId: number) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    const onPermissionsUpdate = async () => {
        setLoader(true);

        try {
            const roleId = Number(id);

            await dispatch(rolesThunks.editRole(
                roleId,
                {permissions: selectedPermissions},
                true)
            );

            showSuccess(`${props.t('success')}!`, props.t('permissions_updated'))
                .then(() => navigate('/roles'))

        } catch (err) {
            await showError(`${props.t('error')}!`, props.t('error_updating_permissions'))
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (loading) {
            showLoading()
        } else {
            closeLoading()
        }
    }, [loading]);

    document.title = props.t('permissions_page')

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('permissions_page')} pageTitle={props.t('main')}/>

                    <div className="mt-4">
                        <div className="row g-4">
                            {currentRole ? Object.entries(currentRole.permissions).map(([groupKey, permissions]) => {
                                const groupTitle = groupKey.charAt(0).toUpperCase() + groupKey.slice(1);

                                return (
                                    <div key={groupKey} className="mb-5">
                                        <h5 className="fw-bold text-primary mb-3">{groupTitle}</h5>

                                        <div className="row g-4">
                                            {(permissions as any[]).map((perm: any) => (
                                                <div className="col-12 col-md-3" key={perm.id}>
                                                    <div className="form-check form-switch">
                                                        <Input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            role="switch"
                                                            id={`perm-${perm.id}`}
                                                            checked={selectedPermissions.includes(perm.id)}
                                                            onChange={() => handlePermissionToggle(perm.id)}
                                                        />
                                                        <Label className="form-check-label" htmlFor={`perm-${perm.id}`}>
                                                            {perm.name}
                                                        </Label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }) : null}
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-4 mb-2">
                        <button
                            type="button"
                            className="btn w-md btn-success"
                            id="delete-record"
                            onClick={onPermissionsUpdate}
                            disabled={loader}
                        >
                            {loader && (
                                <Spinner size="sm" className="me-2">
                                    {props.t('loading')}...
                                </Spinner>
                            )}
                            {props.t('save')}
                        </button>
                        <Link
                            className="btn w-sm btn-light"
                            data-bs-dismiss="modal"
                            to='/roles'>
                            {props.t('close')}
                        </Link>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default withTranslation()(RolePermissions);