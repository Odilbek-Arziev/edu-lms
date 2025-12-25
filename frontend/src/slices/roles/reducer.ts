import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {Role} from "../../types/Role";
import {ActionCreatorWithoutPayload, ActionCreatorWithPayload, Draft, PayloadAction} from "@reduxjs/toolkit";
import {CrudState} from "../common/crudState";
import {APIClient} from "../../helpers/api_helper";

const rolesSlice = createCrudSlice<Role>('roles', {
    reducers: {
        setCurrentRole(state: Draft<CrudState<Role>>, action: PayloadAction<Role>) {
            state.currentRole = action.payload;
            state.loading = false;
            state.error = '';
        }
    }
});

export const rolesReducer = rolesSlice.reducer;

const { request, success, error, setCurrentRole } = rolesSlice.actions;

export const rolesActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>,
    setCurrentRole: setCurrentRole as ActionCreatorWithPayload<Role>
};

const baseThunks = createCrudThunks('/roles/', {
    request: rolesActions.request,
    success: rolesActions.success,
    error: rolesActions.error
});

export const rolesThunks = {
    ...baseThunks,

    getById: (id: number) => async (dispatch: any) => {
        const api = new APIClient();

        try {
            const response = await api.get(`/roles/${id}/`);
            dispatch(rolesActions.setCurrentRole(response));
            return response;
        } catch (e: any) {
            const message = e.response?.data || 'Ошибка загрузки роли';
            dispatch(rolesActions.error(message));
            return null;
        }
    },

    editRole: (id: number, data: any, permissions: boolean = false) => async (dispatch: any) => {
        const api = new APIClient();

        try {
            const endpoint = `/roles/${id}/${permissions ? 'permissions/' : ''}`;
            return await api.update(endpoint, data);
        } catch (e: any) {
            dispatch(rolesActions.error(e.response?.data || 'Ошибка обновления роли'));
            return null;
        }
    }
};