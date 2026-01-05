import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import RoleForm from "./RoleForm";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {rolesThunks} from "../../../slices/roles";
import {CreateProps} from '../../../types/crud'


export default function RoleCreate({onCancel, onSuccess}: CreateProps) {
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
            action="add"/>
    )
}