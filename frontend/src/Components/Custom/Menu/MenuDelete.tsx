import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {Spinner} from "reactstrap";
import {deleteMenu} from "../../../slices/menu/thunk";

interface MenuDeleteProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number;
}

const Swal = require("sweetalert2");

export default function MenuDelete({onCancel, onSuccess, id}: MenuDeleteProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();

    async function onDelete() {
        try {
            setLoader(true);
            const result: any = await dispatch(deleteMenu(id));

            if (result?.non_field_errors) {
                await Swal.fire({
                    title: "Ошибка",
                    text: result.non_field_errors[0],
                    icon: "error",
                });
                return;
            }

            onSuccess()
        } catch (e: any) {
            const result = e.response.data

            const fieldErrors = Object.keys(result || {}).map(key => {
                if (Array.isArray(result[key])) {
                    return `${key}: ${result[key].join(", ")}`;
                }
                return null;
            }).filter(Boolean);

            if (fieldErrors.length > 0) {
                await Swal.fire({
                    title: "Ошибка",
                    text: fieldErrors.join("\n"),
                    icon: "error",
                });
                return;
            }
        } finally {
            setLoader(false);
        }
    }

    return (
        <div>
            <div className="mt-2 text-center">
                <i className="ri-delete-bin-line display-5 text-danger"/>
                <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                    <p className="text-muted mx-4 mb-0">
                        Вы уверены что хотите удалить этот пункт меню?
                    </p>
                </div>
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