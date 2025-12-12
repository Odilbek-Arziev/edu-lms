import {iconsSuccess, iconsError} from './reducer'
import {APIClient} from "../../helpers/api_helper";

export const fetchIcons = () => async (dispatch: any) => {
    const api = new APIClient();

    try {
        const response = await api.get('/icons/')
        dispatch(iconsSuccess(response))
        return response
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки иконок'
        dispatch(iconsError(message))
        return null;
    }
}