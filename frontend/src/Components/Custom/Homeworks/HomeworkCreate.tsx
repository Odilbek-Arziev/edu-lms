import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {CreateProps} from '../../../types/crud'
import {homeworksThunk} from "../../../slices/homeworks/reducer";
import HomeworkForm from "./HomeworkForm";
import {formatDate} from "../../../utils/date";


export default function HomeworkCreate({onCancel, onSuccess}: CreateProps) {

    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        const d = data.deadline ? new Date(data.deadline) : null;
        const payload = {
            ...data,
            deadline: d && !isNaN(d.getTime()) ? formatDate(d) : null,
            criteria: (data.criteria || [])
                .map((c: string) => c.trim())
                .filter(Boolean)
                .map((text: string) => ({text})),
        };

        await handleRequest(
            () => dispatch(homeworksThunk.create(payload)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <HomeworkForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action="add"
        />
    )
}