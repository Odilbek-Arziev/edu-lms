import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {CreateProps} from '../../../types/crud'
import {modulesThunks} from "../../../slices/modules";
import ModuleForm from "./ModuleForm";

interface ModuleCreateProps extends CreateProps {
    course: number;
}

export default function ModuleCreate({onCancel, onSuccess, course}: ModuleCreateProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(modulesThunks.create({...data, course})),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <ModuleForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action='add'/>
    )
}