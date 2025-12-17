import {rolesSuccess, rolesError, rolesRequest, setCurrentRole} from './reducer'
import {APIClient} from "../../helpers/api_helper";

export const fetchRoles = () => async (dispatch: any) => {
    const api = new APIClient();

    dispatch(rolesRequest());

    try {
        const response = await api.get('/roles/')
        dispatch(rolesSuccess(response))
        return response
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки ролей'
        dispatch(rolesError(message))
        return null;
    }
}

export const createRole = (data: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.create("/roles/", data);
        return response
    } catch (error: any) {
        dispatch(rolesError(error));
    }
};

export const deleteRole = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.delete(`/roles/${id}/`);
        return response
    } catch (error: any) {
        dispatch(rolesError(error));
    }
};

export const getRoleItem = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        const response = await api.get(`/roles/${id}/`);
        dispatch(setCurrentRole(response));
        return response;
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки роли';
        dispatch(rolesError(message));
        return null;
    }
};

export const editRole = (id: number, data: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.update(`/roles/${id}/`, data);
        return response
    } catch (error: any) {
        dispatch(rolesError(error));
    }
};
