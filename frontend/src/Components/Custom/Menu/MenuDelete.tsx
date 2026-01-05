import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {Spinner} from "reactstrap";
import {menuThunks} from "../../../slices/menu";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {withTranslation} from "react-i18next";
import {DeleteProps} from "../../../types/crud";


function MenuDelete({onCancel, onSuccess, id, t}: DeleteProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onDelete() {
        await handleRequest(
            () => dispatch(menuThunks.delete(id)),
            {onSuccess}
        )
    }

    return (
        <div>
            <div className="mt-2 text-center">
                <i className="ri-delete-bin-line display-5 text-danger"/>
                <p className="fw-bold fs-5">
                    {t('delete_confirm', {item: t('menu_item')})}
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
                            {t('loading')}...
                        </Spinner>
                    )}
                    {t('yes_delete')}
                </button>
            </div>
        </div>
    )
}

export default withTranslation()(MenuDelete);