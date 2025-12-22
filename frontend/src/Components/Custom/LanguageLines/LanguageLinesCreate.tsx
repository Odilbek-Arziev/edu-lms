import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {createLanguageLines} from "../../../slices/languageLines/thunk";
import LanguageLinesForm from "./LanguageLinesForm";

interface LanguageLinesProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export default function LanguageLinesCreate({onCancel, onSuccess}: LanguageLinesProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(createLanguageLines(data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <LanguageLinesForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            title='Добавить новый пункт перевода'/>
    )
}