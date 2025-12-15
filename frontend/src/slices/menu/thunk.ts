import {menuSuccess, menuError, menuRequest} from './reducer'
import {APIClient} from "../../helpers/api_helper";

const URL = '/menu/'

export const fetchMenu = () => async (dispatch: any) => {
    const api = new APIClient();

    dispatch(menuRequest());

    try {
        const response = await api.get(URL)
        dispatch(menuSuccess(response))
        return response
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки меню'
        dispatch(menuError(message))
        return null;
    }
}

export const createMenu = (data: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.create("/menu/", data);
        return response
    } catch (error: any) {
        dispatch(menuError(error));
    }
};

export const deleteMenu = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.delete(`/menu/${id}/`);
        return response
    } catch (error: any) {
        dispatch(menuError(error));
    }
};

export const getMenuItem = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.get(`/menu/${id}/`);
        return response
    } catch (error: any) {
        dispatch(menuError(error));
    }
};

export const editMenu = (id: number, data: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.update(`/menu/${id}/`, data);
        return response
    } catch (error: any) {
        dispatch(menuError(error));
    }
};
