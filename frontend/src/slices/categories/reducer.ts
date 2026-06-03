import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";
import {Category} from "../../types/Category";

const categoriesSlice = createCrudSlice<Category>('categories', { simplifiedResponse: true });

export const categoriesReducer = categoriesSlice.reducer;

const {request, success, error} = categoriesSlice.actions;

export const categoriesActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const categoriesThunk = createCrudThunks('/categories/', categoriesActions);