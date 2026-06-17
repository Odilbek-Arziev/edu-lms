import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload} from "@reduxjs/toolkit";
import {LiveSession} from "../../types/LiveSession";

const liveSessionsSlice = createCrudSlice<LiveSession>('live-sessions', {simplifiedResponse: true});

export const liveSessionsReducer = liveSessionsSlice.reducer;

const {request, success, error} = liveSessionsSlice.actions;

export const liveSessionsActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>
};

export const liveSessionsThunk = createCrudThunks('/live_sessions/', liveSessionsActions);