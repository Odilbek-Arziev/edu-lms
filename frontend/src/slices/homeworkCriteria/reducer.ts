import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";
import {Material} from "../../types/Material";

const homeworkCriteriaSlice = createCrudSlice<Material>('homework_criterion', {simplifiedResponse: true});

export const homeworkCriteriaReducer = homeworkCriteriaSlice.reducer;

const {request, success, error} = homeworkCriteriaSlice.actions;

export const homeworkCriteriaActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const homeworkCriteriaThunk = createCrudThunks('/homework_criterion/', homeworkCriteriaActions);