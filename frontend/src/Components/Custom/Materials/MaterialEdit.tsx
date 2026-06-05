import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {EditProps} from "../../../types/crud";
import {materialsThunk} from "../../../slices/materials/reducer";
import MaterialForm from "./MaterialForm";


export default function MaterialEdit({onCancel, onSuccess, id, initialValues}: EditProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value as any);
            }
        });

        await handleRequest(
            () => dispatch(materialsThunk.update(formData)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <MaterialForm
            initialValues={initialValues}
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action='update'/>
    )
}