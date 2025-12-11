import {rolesSuccess, rolesError} from './reducer'
import {APIClient} from "../../helpers/api_helper";

export const fetchRoles = () => async (dispatch: any) => {
    const api = new APIClient();

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