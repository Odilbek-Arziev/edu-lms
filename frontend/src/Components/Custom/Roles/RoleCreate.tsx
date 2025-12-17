import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {createRole} from "../../../slices/roles/thunk";
import RoleForm from "./RoleForm";
import {useApiHandler} from "../../../hooks/useApiHandler";

interface RoleCreateProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export default function RoleCreate({onCancel, onSuccess}: RoleCreateProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(createRole(data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (

        <RoleForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            title="Добавить новую роль"/>
    )
}