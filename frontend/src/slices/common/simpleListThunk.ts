import {APIClient} from "../../helpers/api_helper";

export function createSimpleListThunks(
    endpoint: string,
    actions: any
) {
    const api = new APIClient();

    return {
        fetch: (params: any = {}) => async (dispatch: any) => {
            dispatch(actions.request());
            try {
                const response = await api.get(endpoint, params);
                dispatch(actions.success(response));
                return response;
            } catch (e: any) {
                dispatch(actions.error(e.response?.data || 'Ошибка загрузки'));
                return null;
            }
        }
    };
}