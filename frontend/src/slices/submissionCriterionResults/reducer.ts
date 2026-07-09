import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";

const submissionCriterionResultsSlice =
    createCrudSlice<any>('submissionCriterionResults', {simplifiedResponse: true});

export const submissionCriterionResultsReducer = submissionCriterionResultsSlice.reducer;

const {request, success, error} = submissionCriterionResultsSlice.actions;

export const submissionCriterionResultsActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const submissionCriterionResultsThunk =
    createCrudThunks('/submission_criterion_results/', submissionCriterionResultsActions);