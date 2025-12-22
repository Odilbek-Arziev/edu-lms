import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {Spinner} from "reactstrap";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {deleteLanguageLine} from "../../../slices/languageLines/thunk";

interface deleteProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number;
}


export default function LanguageLineDelete({onCancel, onSuccess, id}: deleteProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onDelete() {
        await handleRequest(
            () => dispatch(deleteLanguageLine(id)),
            {onSuccess}
        )
    }

    return (
        <div>
            <div className="mt-2 text-center">
                <i className="ri-delete-bin-line display-5 text-danger"/>
                <p className="fw-bold fs-5">
                    Вы уверены что хотите удалить этот пункт перевода?
                </p>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                <button
                    type="button"
                    className="btn w-sm btn-light"
                    data-bs-dismiss="modal"
                    onClick={onCancel}
                >
                    Закрыть
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
                    Да, удалить.
                </button>
            </div>
        </div>
    )
}