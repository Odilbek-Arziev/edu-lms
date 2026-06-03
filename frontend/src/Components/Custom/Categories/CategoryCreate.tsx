import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {CreateProps} from '../../../types/crud'
import CategoryForm from "./CategoryForm";
import {categoriesThunk} from "../../../slices/categories/reducer";


export default function CategoryCreate({onCancel, onSuccess}: CreateProps) {

    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(categoriesThunk.create(data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <CategoryForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action="add"
        />
    )
}