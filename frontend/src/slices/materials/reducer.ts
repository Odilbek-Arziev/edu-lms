import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";
import {Material} from "../../types/Material";

const materialsSlice = createCrudSlice<Material>('materials', {simplifiedResponse: true});

export const materialsReducer = materialsSlice.reducer;

const {request, success, error} = materialsSlice.actions;

export const materialsActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const materialsThunk = createCrudThunks('/materials/', materialsActions);