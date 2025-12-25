import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import UserForm from "./UserForm";
import {usersThunks} from "../../../slices/users";

interface UserEditProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number,
    initialValues: any
}

export default function UserEdit({onCancel, onSuccess, id, initialValues}: UserEditProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(usersThunks.update(id, data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <UserForm
            initialValues={initialValues}
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            title='Отредактировать пользователя'
        />
    )
}