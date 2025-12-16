import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {editRole} from "../../../slices/roles/thunk";
import RoleForm from "./RoleForm";

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
            () => dispatch(editRole(id, data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <div>
            <b>Отредактировать роль</b><br/><br/>

            <RoleForm
                initialValues={initialValues}
                loader={loader}
                onSubmit={onSubmit}
                onCancel={onCancel}/>
        </div>
    )
}