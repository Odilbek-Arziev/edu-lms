import {APIClient} from "../../helpers/api_helper";
import {setRegisterTypes, usersError, usersRequest, usersSuccess} from "./reducer";

export const fetchUsers = () => async (dispatch: any) => {
    const api = new APIClient();

    dispatch(usersRequest());

    try {
        const response = await api.get('/users/')
        dispatch(usersSuccess(response))
        return response
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки ролей'
        dispatch(usersError(message))
        return null;
    }
}

export const deleteUser = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.delete(`/users/${id}/`);
        return response
    } catch (error: any) {
        dispatch(usersError(error));
    }
};

export const getUser = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        return await api.get(`/users/${id}/`);
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки пользователя';
        dispatch(usersError(message));
        return null;
    }
};

export const getRegisterTypes = () => async (dispatch: any) => {
    const api = new APIClient();

    try {
        const response = await api.get('/users/register_types/');
        dispatch(setRegisterTypes(response));
        return response;
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки';
        dispatch(usersError(message));
        return null;
    }
};

export const editUser = (id: number, data: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.update(`/users/${id}/`, data);
        return response
    } catch (error: any) {
        dispatch(usersError(error));
    }
};
