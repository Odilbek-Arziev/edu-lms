import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import RoleForm from "./RoleForm";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {rolesThunks} from "../../../slices/roles";

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
            () => dispatch(rolesThunks.create(data)),
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