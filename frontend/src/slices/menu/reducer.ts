import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {Menu} from "../../types/Menu";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";

const menuSlice = createCrudSlice<Menu>('menu');

export const menuReducer = menuSlice.reducer;

const { request, success, error } = menuSlice.actions;

export const menuActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const menuThunks = createCrudThunks('/menu/', menuActions);