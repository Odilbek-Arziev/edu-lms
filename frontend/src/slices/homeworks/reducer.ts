import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";
import {Material} from "../../types/Material";

const homeworksSlice = createCrudSlice<Material>('homeworks', {simplifiedResponse: true});

export const homeworksReducer = homeworksSlice.reducer;

const {request, success, error} = homeworksSlice.actions;

export const homeworksActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const homeworksThunk = createCrudThunks('/homeworks/', homeworksActions);