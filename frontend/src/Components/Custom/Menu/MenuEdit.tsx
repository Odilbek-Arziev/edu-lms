import React, {useState} from 'react'
import MenuForm from "./MenuForm";
import {useDispatch} from "react-redux";
import {editMenu} from "../../../slices/menu/thunk";
import {useApiHandler} from "../../../hooks/useApiHandler";

interface MenuEditProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number,
    initialValues: any
}


export default function MenuEdit({onCancel, onSuccess, id, initialValues}: MenuEditProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(editMenu(id, data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <div>
            <b>Отредактировать меню</b><br/><br/>

            <MenuForm
                initialValues={initialValues}
                loader={loader}
                onSubmit={onSubmit}
                onCancel={onCancel}/>
        </div>
    )
}