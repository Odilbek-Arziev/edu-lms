import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {EditProps} from "../../../types/crud";
import CategoryForm from "./CategoryForm";
import {categoriesThunk} from "../../../slices/categories/reducer";


export default function CategoryEdit({onCancel, onSuccess, id, initialValues}: EditProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(categoriesThunk.update(id, data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <CategoryForm
            initialValues={initialValues}
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action='update'/>
    )
}