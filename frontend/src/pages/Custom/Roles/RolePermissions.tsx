import React, {useEffect, useState} from 'react'
import {Container, Input, Label, Spinner} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {Link, useNavigate, useParams} from "react-router-dom";
import {editRole, getRoleItem} from "../../../slices/roles/thunk";
import {useDispatch, useSelector} from "react-redux";

const Swal = require("sweetalert2");

const RolePermissions = () => {
    const [loader, setLoader] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const {id} = useParams();
    let navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const {currentRole, loading, error} = useSelector((state: any) => state.Roles);

    useEffect(() => {
        const roleId = Number(id);

        if (id && !isNaN(roleId)) {
            dispatch(getRoleItem(roleId));
        } else {
            console.error("Неверный ID роли:", id);
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

            await dispatch(editRole(
                roleId,
                {permissions: selectedPermissions},
                true
            ));

            Swal.fire({
                icon: 'success',
                title: 'Успешно!',
                text: 'Права роли обновлены',
            }).then(() => navigate('/roles'))

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка!',
                text: 'Не удалось обновить права',
            });
        } finally {
            setLoader(false);
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Permissions" pageTitle="Dashboards"/>

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
                                    Loading...
                                </Spinner>
                            )}
                            Сохранить
                        </button>
                        <Link
                            className="btn w-sm btn-light"
                            data-bs-dismiss="modal"
                            to='/roles'>
                            Закрыть
                        </Link>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default RolePermissions;