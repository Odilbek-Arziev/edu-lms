import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {EditProps} from "../../../types/crud";
import {formatDate} from "../../../utils/date";
import {homeworksThunk} from "../../../slices/homeworks/reducer";
import HomeworkForm from "./HomeworkForm";


export default function HomeworkEdit({onCancel, onSuccess, id, initialValues}: EditProps) {
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
            () => dispatch(homeworksThunk.update(id, payload)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <HomeworkForm
            initialValues={initialValues}
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action='update'
        />
    )
}