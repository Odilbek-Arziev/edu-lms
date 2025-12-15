import React, {useState} from 'react'
import MenuForm from "./MenuForm";
import {useDispatch} from "react-redux";
import {editMenu} from "../../slices/menu/thunk";

interface MenuEditProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number,
    initialValues: any
}

const Swal = require("sweetalert2");

export default function MenuEdit({onCancel, onSuccess, id, initialValues}: MenuEditProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();

    async function onSubmit(data: any, actions: any) {
        try {
            setLoader(true);
            const result: any = await dispatch(editMenu(id, data));

            if (result?.non_field_errors) {
                await Swal.fire({
                    title: "Ошибка",
                    text: result.non_field_errors[0],
                    icon: "error",
                });
                return;
            }

            actions.resetForm()
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
            <b>Отредактировать меню</b><br/><br/>

            <MenuForm
                initialValues={initialValues}
                loader={loader}
                onSubmit={onSubmit}
                onCancel={onCancel}/>
        </div>
    )
}