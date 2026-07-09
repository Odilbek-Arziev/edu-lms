import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";

const homeworkSubmissionsSlice =
    createCrudSlice<any>('homeworkSubmissions', {simplifiedResponse: true});

export const homeworkSubmissionsReducer = homeworkSubmissionsSlice.reducer;

const {request, success, error} = homeworkSubmissionsSlice.actions;

export const homeworkSubmissionsActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const homeworkSubmissionsThunk =
    createCrudThunks('/homework_submissions/', homeworkSubmissionsActions);