import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import CourseForm from "./CourseForm";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {CreateProps} from '../../../types/crud'
import {coursesThunks} from "../../../slices/courses";


export default function CourseCreate({onCancel, onSuccess}: CreateProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(coursesThunks.create(data)),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <CourseForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action="add"/>
    )
}