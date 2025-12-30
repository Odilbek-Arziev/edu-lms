import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {Spinner} from "reactstrap";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {rolesThunks} from "../../../slices/roles";
import {withTranslation} from "react-i18next";

interface RoleDeleteProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number;
    t: (key: string) => string;
}

function RoleDelete({onCancel, onSuccess, id, t}: RoleDeleteProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onDelete() {
        await handleRequest(
            () => dispatch(rolesThunks.delete(id)),
            {onSuccess}
        )
    }

    return (
        <div>
            <div className="mt-2 text-center">
                <i className="ri-delete-bin-line display-5 text-danger"/>
                <p className="fw-bold fs-5">
                    {t('delete_role_confirm')}
                </p>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                <button
                    type="button"
                    className="btn w-sm btn-light"
                    data-bs-dismiss="modal"
                    onClick={onCancel}
                >
                    {t('close')}
                </button>
                <button
                    type="button"
                    className="btn w-sm btn-danger "
                    id="delete-record"
                    onClick={onDelete}
                    disabled={loader}
                >
                    {loader && (
                        <Spinner size="sm" className="me-2">
                            Loading...
                        </Spinner>
                    )}
                    {t('yes_delete')}
                </button>
            </div>
        </div>
    )
}
export default withTranslation()(RoleDelete);