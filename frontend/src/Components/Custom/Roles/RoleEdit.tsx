import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import RoleForm from "./RoleForm";
import {rolesThunks} from "../../../slices/roles";

interface RoleEditProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number,
    initialValues: any
}

export default function RoleEdit({onCancel, onSuccess, id, initialValues}: RoleEditProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(rolesThunks.update(id, data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <RoleForm
            initialValues={initialValues}
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            title='edit_role'/>
    )
}