import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {CreateProps} from '../../../types/crud'
import MaterialForm from "./MaterialForm";
import {materialsThunk} from "../../../slices/materials/reducer";


export default function MaterialCreate({onCancel, onSuccess}: CreateProps) {

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
            () => dispatch(materialsThunk.create(formData)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <MaterialForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action="add"
        />
    )
}