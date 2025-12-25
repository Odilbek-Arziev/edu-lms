import {APIClient} from "../../helpers/api_helper";

export function createCrudThunks(
    endpoint: string,
    actions: any
) {
    const api = new APIClient();

    return {
        fetch:
            (params: any = {}) =>
                async (dispatch: any) => {
                    dispatch(actions.request());
                    try {
                        const response = await api.get(endpoint, params);
                        dispatch(actions.success(response));
                        return response;
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data || 'Ошибка загрузки'));
                        return null;
                    }
                },

        create:
            (data: any) =>
                async (dispatch: any) => {
                    try {
                        return await api.create(endpoint, data);
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data));
                    }
                },

        update:
            (id: number, data: any) =>
                async (dispatch: any) => {
                    try {
                        return await api.update(`${endpoint}${id}/`, data);
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data));
                    }
                },

        delete:
            (id: number) =>
                async (dispatch: any) => {
                    try {
                        return await api.delete(`${endpoint}${id}/`);
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data));
                    }
                },

        getById:
            (id: number) =>
                async (dispatch: any) => {
                    try {
                        return await api.get(`${endpoint}${id}/`);
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data));
                    }
                }
    };
}