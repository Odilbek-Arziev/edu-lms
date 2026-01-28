import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";
import {Module} from "../../types/Module";

const modulesSlice = createCrudSlice<Module>('modules');

export const modulesReducer = modulesSlice.reducer;

const {request, success, error} = modulesSlice.actions;

export const modulesActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const modulesThunks = createCrudThunks('/modules/', modulesActions);