import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {createRole} from "../../../slices/roles/thunk";
import RoleForm from "./RoleForm";

interface RoleCreateProps {
    onCancel: () => void;
    onSuccess: () => void;
}

const Swal = require("sweetalert2");

export default function RoleCreate({onCancel, onSuccess}: RoleCreateProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();

    async function onSubmit(data: any, actions: any) {
        try {
            setLoader(true);
            const result: any = await dispatch(createRole(data));

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
            <b>Добавить новую роль</b><br/><br/>

            <RoleForm
                loader={loader}
                onSubmit={onSubmit}
                onCancel={onCancel}/>
        </div>
    )
}