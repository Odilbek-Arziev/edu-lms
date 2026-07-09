import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";

const submissionReviewsSlice =
    createCrudSlice<any>('submissionReviews', {simplifiedResponse: true});

export const submissionReviewsReducer = submissionReviewsSlice.reducer;

const {request, success, error} = submissionReviewsSlice.actions;

export const submissionReviewsActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const submissionReviewsThunk =
    createCrudThunks('/submission_reviews/', submissionReviewsActions);