import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload, Draft, PayloadAction} from "@reduxjs/toolkit";
import {Enrollment} from "../../types/Enrollment";
import {APIClient} from "../../helpers/api_helper";

const enrollmentsSlice = createCrudSlice<Enrollment>('enrollments', {
    reducers: {
        setStats(state: Draft<any>, action: PayloadAction<any>) {
            state.stats = action.payload
        }
    }
});

export const enrollmentsReducer = enrollmentsSlice.reducer;

const {request, success, error, setStats} = enrollmentsSlice.actions;

export const enrollmentsActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>,
    setStats: setStats as ActionCreatorWithPayload<any>,
};

export const baseThunks = createCrudThunks('/enrollments/', enrollmentsActions);

export const enrollmentsThunk = {
    ...baseThunks,

    getStats: () => async (dispatch: any) => {
        const api = new APIClient();
        try {
            const response = await api.get('/enrollments/stats/');
            dispatch(enrollmentsActions.setStats(response));
            return response;
        } catch (error: any) {
            return null;
        }
    }
}
