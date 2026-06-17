import {APIClient} from "../../helpers/api_helper";

export function createCrudThunks(
    endpoint: string,
    actions: any
) {
    const getApi = () => new APIClient();

    return {
        fetch:
            (params: any = {}) =>
                async (dispatch: any) => {
                    const {skipReduxUpdate, ...apiParams} = params;

                    if (!skipReduxUpdate) {
                        dispatch(actions.request());
                    }

                    try {
                        // Используем getApi() вместо api
                        const response = await getApi().get(endpoint, apiParams);

                        if (!skipReduxUpdate) {
                            dispatch(actions.success(response));
                        }

                        return response;
                    } catch (e: any) {
                        if (!skipReduxUpdate) {
                            dispatch(actions.error(e.response?.data || 'Ошибка загрузки'));
                        }
                        return null;
                    }
                },

        create:
            (data: any) =>
                async (dispatch: any) => {
                    try {
                        const isFormData = data instanceof FormData;
                        return await getApi().create(endpoint, data, {
                            headers: isFormData
                                ? {'Content-Type': 'multipart/form-data'}
                                : {'Content-Type': 'application/json'}
                        });
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data));
                    }
                },

        update:
            (id: any, data: any) =>
                async (dispatch: any) => {
                    try {
                        const isFormData = data instanceof FormData;
                        return await getApi().update(`${endpoint}${id}/`, data, {
                            headers: isFormData
                                ? {'Content-Type': 'multipart/form-data'}
                                : {'Content-Type': 'application/json'}
                        });
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data));
                    }
                },

        delete:
            (id: number) =>
                async (dispatch: any) => {
                    try {
                        return await getApi().delete(`${endpoint}${id}/`);
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data));
                    }
                },

        getById:
            (id: number) =>
                async (dispatch: any) => {
                    try {
                        return await getApi().get(`${endpoint}${id}/`);
                    } catch (e: any) {
                        dispatch(actions.error(e.response?.data));
                    }
                }
    };
}