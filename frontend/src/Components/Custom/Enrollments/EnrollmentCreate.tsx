import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {CreateProps} from '../../../types/crud'
import {enrollmentsThunk} from "../../../slices/enrollments/reducer";
import EnrollmentForm from "./EnrollmentForm";


export default function EnrollmentCreate({onCancel, onSuccess}: CreateProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
        await handleRequest(
            () => dispatch(enrollmentsThunk.create({
                student_id: data.student_id,
                course_id: data.course_id
            })),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <EnrollmentForm
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action="add"
        />
    )
}