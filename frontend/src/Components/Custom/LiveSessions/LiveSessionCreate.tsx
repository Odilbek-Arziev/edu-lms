import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {CreateProps} from '../../../types/crud'
import LiveSessionForm from "./LiveSessionForm";
import {liveSessionsThunk} from "../../../slices/liveSessions/reducer";


export default function LiveSessionCreate({onCancel, onSuccess}: CreateProps) {

    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        const payload = {
            ...data,
            scheduled_at: new Date(data.scheduled_at).toISOString(),
        };

        await handleRequest(
            () => dispatch(liveSessionsThunk.create({...payload})),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <LiveSessionForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action="add"
        />
    )
}