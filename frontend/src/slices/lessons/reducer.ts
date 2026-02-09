import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";
import {Lesson} from "../../types/Lesson";

const lessonsSlice = createCrudSlice<Lesson>('lessons');

export const lessonsReducer = lessonsSlice.reducer;

const {request, success, error} = lessonsSlice.actions;

export const lessonsActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const lessonsThunks = createCrudThunks('/lessons/', lessonsActions);