import React, {useState} from 'react'
import MenuForm from "./MenuForm";
import {useDispatch} from "react-redux";
import {createMenu} from "../../../slices/menu/thunk";
import {useApiHandler} from "../../../hooks/useApiHandler";

interface MenuCreateProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export default function MenuCreate({onCancel, onSuccess}: MenuCreateProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(createMenu(data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <MenuForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            title='Добавить новое меню'/>
    )
}