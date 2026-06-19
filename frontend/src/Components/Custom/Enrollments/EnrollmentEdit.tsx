import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {useApiHandler} from "../../../hooks/useApiHandler";
import {EditProps} from "../../../types/crud";
import {enrollmentsThunk} from "../../../slices/enrollments/reducer";
import EnrollmentForm from "./EnrollmentForm";


export default function EnrollmentEdit({onCancel, onSuccess, id, initialValues}: EditProps) {
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch<any>();
    const {handleRequest} = useApiHandler(setLoader);

    async function onSubmit(data: any, actions: any) {
         console.log('SUBMIT FIRED', data);
        await handleRequest(
            () => dispatch(enrollmentsThunk.update(id, {
                student_id: data.student_id,
                course_id: data.course_id,
                status: data.status,
                progress: Number(data.progress) || 0,
                final_grade: Number(data.final_grade) || 0,
            })),
            {
                onSuccess,
                onResetForm: () => actions.resetForm()
            }
        )
    }

    return (
        <EnrollmentForm
            initialValues={initialValues}
            loader={loader}
            onSubmit={onSubmit}
            onCancel={onCancel}
            action='update'
        />
    )
}