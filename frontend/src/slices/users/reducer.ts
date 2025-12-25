import { createCrudSlice } from "../common/reducer";
import { createCrudThunks } from "../common/thunk";
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload, Draft, PayloadAction } from "@reduxjs/toolkit";
import { APIClient } from "../../helpers/api_helper";
import {UsersState} from "../../types/User";


const usersSlice = createCrudSlice<any>('users', {
    reducers: {
        setRegisterTypes(state: Draft<UsersState<any>>, action: PayloadAction<any>) {
            state.registerTypes = Array.isArray(action.payload)
                ? action.payload
                : action.payload?.results ?? [];
        }
    }
});

export const usersReducer = usersSlice.reducer;

const { request, success, error, setRegisterTypes } = usersSlice.actions;

export const usersActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>,
    setRegisterTypes: setRegisterTypes as ActionCreatorWithPayload<any>
};

const baseThunks = createCrudThunks('/users/', {
    request: usersActions.request,
    success: usersActions.success,
    error: usersActions.error
});

export const usersThunks = {
    ...baseThunks,

    getRegisterTypes: () => async (dispatch: any) => {
        const api = new APIClient();

        try {
            const response = await api.get('/users/register_types/');
            dispatch(usersActions.setRegisterTypes(response));
            return response;
        } catch (error: any) {
            const message = error.response?.data || 'Ошибка загрузки типов регистрации';
            dispatch(usersActions.error(message));
            return null;
        }
    }
};