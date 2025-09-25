import axios, {AxiosResponse, AxiosRequestConfig, CreateAxiosDefaults} from "axios";
import config from "../config";

const {api} = config;

/**
 * Создаём два клиента: публичный (без токена) и авторизованный (с токеном)
 */
const defaultConfig: { headers: { "Content-Type": string }; baseURL: string } = {
  baseURL: api.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};
const publicAxios = axios.create(defaultConfig);
const authAxios = axios.create(defaultConfig);

// Response interceptor для обоих
const responseInterceptor = (response: any) =>
    response.data ? response.data : response;

const errorInterceptor = (error: any) => {
    if (error.response) {
        return Promise.reject(error);
    }
    return Promise.reject({
        response: {
            data: {non_field_errors: ["Сервер недоступен или проблемы с сетью"]},
        },
    });
};

publicAxios.interceptors.response.use(responseInterceptor, errorInterceptor);
authAxios.interceptors.response.use(responseInterceptor, errorInterceptor);

/**
 * Установка токена в авторизованный клиент
 */
const setAuthorization = (token: string) => {
    authAxios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

/**
 * Берём текущего пользователя из localStorage
 */
const getLoggedinUser = () => {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
};

/**
 * Универсальный APIClient
 */
class APIClient {
    private client: typeof publicAxios | typeof authAxios;

    constructor(auth: boolean = true) {
        this.client = auth ? authAxios : publicAxios;
    }

    get = (url: string, params?: any): Promise<AxiosResponse> => {
        let queryString = "";
        if (params) {
            queryString = Object.keys(params)
                .map((key) => `${key}=${params[key]}`)
                .join("&");
        }
        return this.client.get(queryString ? `${url}?${queryString}` : url);
    };

    create = (url: string, data: any): Promise<AxiosResponse> => {
        return this.client.post(url, data);
    };

    update = (url: string, data: any): Promise<AxiosResponse> => {
        return this.client.patch(url, data);
    };

    put = (url: string, data: any): Promise<AxiosResponse> => {
        return this.client.put(url, data);
    };

    delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
        return this.client.delete(url, {...config});
    };
}

export {APIClient, setAuthorization, getLoggedinUser};
