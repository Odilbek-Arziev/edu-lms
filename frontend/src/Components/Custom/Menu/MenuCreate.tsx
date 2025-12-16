import React, {useState} from 'react'
import MenuForm from "./MenuForm";
import {useDispatch} from "react-redux";
import {createMenu} from "../../../slices/menu/thunk";

interface MenuCreateProps {
    onCancel: () => void;
    onSuccess: () => void;
}

const Swal = require("sweetalert2");

export default function MenuCreate({onCancel, onSuccess}: MenuCreateProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();

    async function onSubmit(data: any, actions: any) {
        try {
            setLoader(true);
            const result: any = await dispatch(createMenu(data));

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
            <b>Добавить новое меню</b><br/><br/>

            <MenuForm
                loader={loader}
                onSubmit={onSubmit}
                onCancel={onCancel}/>
        </div>
    )
}