import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {editLanguageLine} from "../../../slices/languageLines/thunk";
import LanguageLinesForm from "./LanguageLinesForm";

interface editProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number,
    initialValues: any
}

export default function LanguageLineEdit({onCancel, onSuccess, id, initialValues}: editProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(editLanguageLine(id, data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <LanguageLinesForm
            initialValues={initialValues}
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            title='Отредактировать перевод'
        />
    )
}