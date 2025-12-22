import {APIClient} from "../../helpers/api_helper";
import {languageLinesError, languageLinesRequest, languageLinesSuccess} from "./reducer";

export const fetchLanguageLines = () => async (dispatch: any) => {
    const api = new APIClient();

    dispatch(languageLinesRequest());

    try {

        const response = await api.get("/language_lines/");
        dispatch(languageLinesSuccess(response));
        return response;
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки языков';
        dispatch(languageLinesError(message));
        return null;
    }
}

export const createLanguageLines = (data: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.create("/language_lines/", data);
        return response
    } catch (error: any) {
        dispatch(languageLinesError(error));
    }
};

export const deleteLanguageLine = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.delete(`/language_lines/${id}/`);
        return response
    } catch (error: any) {
        dispatch(languageLinesError(error));
    }
};

export const getLanguageLine = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.get(`/language_lines/${id}/`);
        return response
    } catch (error: any) {
        dispatch(languageLinesError(error));
    }
};

export const editLanguageLine = (id: number, data: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        response = api.update(`/language_lines/${id}/`, data);
        return response
    } catch (error: any) {
        dispatch(languageLinesError(error));
    }
};
