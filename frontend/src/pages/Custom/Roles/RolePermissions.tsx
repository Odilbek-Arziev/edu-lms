import React, {useEffect, useState} from 'react'
import {Container, Input, Label, Spinner} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {Link, useParams} from "react-router-dom";
import {getRoleItem} from "../../../slices/roles/thunk";
import {useDispatch, useSelector} from "react-redux";

const RolePermissions = () => {
    const [loader, setLoader] = useState(false);
    const {id} = useParams();
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

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Permissions" pageTitle="Dashboards"/>

                    <div className="mt-4">
                        <div className="row g-4">
                            {Object.entries(currentRole.permissions).map(([groupKey, permissions]) => {
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
                                                            checked={currentRole.role_permissions.includes(perm.id)}
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
                            })}
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-4 mb-2">
                        <button
                            type="button"
                            className="btn w-md btn-success"
                            id="delete-record"
                            // onClick={onPermissionsUpdate}
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