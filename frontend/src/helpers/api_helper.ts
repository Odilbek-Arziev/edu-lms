import axios, {AxiosRequestConfig} from "axios";
import config from "../config";
import {logoutUser} from "../slices/auth/login/thunk";
import {store} from "../index";

const {api} = config;

const defaultConfig = {
    baseURL: api.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
};

const publicAxios = axios.create(defaultConfig);
const authAxios = axios.create(defaultConfig);

const responseInterceptor = (response: any) =>
    response.data ? response.data : response;

const errorInterceptor = (error: any) => {
    if (error.response) {
        const status = error.response.status;

        if (status === 401) {
            const isLanguageLinesRequest = error.config?.url?.includes('/language_lines');

            if (isLanguageLinesRequest) {
                return Promise.reject(error);
            }

            console.warn('Токен истек - выполняем logout');
            clearAuth();
            store.dispatch(logoutUser());
            window.location.href = '/login';
            return;
        }

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

authAxios.interceptors.request.use(
    (config) => {
        const user = getLoggedinUser();
        if (user && user.access) {
            config.headers["Authorization"] = `Bearer ${user.access}`;
        } else {
            console.warn("⚠️ Токен не найден для запроса:", config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const setAuthorization = (token: string | null) => {
    if (!token) {
        console.log("⚠️ Токен пустой, удаляем Authorization header");
        delete authAxios.defaults.headers.common["Authorization"];
        return;
    }

    authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const getLoggedinUser = () => {
    let user = localStorage.getItem("authUser");

    if (!user) {
        console.log("⚠️ authUser не найден в localStorage, проверяем sessionStorage");
        user = sessionStorage.getItem("authUser");
    }

    if (!user) {
        console.log("❌ Пользователь не найден ни в localStorage, ни в sessionStorage");
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("❌ Ошибка парсинга authUser:", error);
        return null;
    }
};

const clearAuth = () => {
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    delete authAxios.defaults.headers.common["Authorization"];
};

const setLoggedinUser = (userData: any) => {
    if (!userData || !userData.access || !userData.refresh) {
        console.error("❌ Невалидные данные пользователя:", userData);
        return false;
    }

    try {
        localStorage.setItem("authUser", JSON.stringify(userData));
        setAuthorization(userData.access);
        return true;
    } catch (error) {
        console.error("❌ Ошибка сохранения данных:", error);
        return false;
    }
};

class APIClient {
    private client: typeof publicAxios | typeof authAxios;

    constructor(auth: boolean = true) {
        this.client = auth ? authAxios : publicAxios;
    }

    get = (url: string, params?: any): Promise<any> => {
        return this.client.get(url, {params});
    };

    create = (url: string, data: any): Promise<any> => {
        return this.client.post(url, data);
    };

    update = (url: string, data: any): Promise<any> => {
        return this.client.patch(url, data);
    };

    put = (url: string, data: any): Promise<any> => {
        return this.client.put(url, data);
    };

    delete = (url: string, config?: AxiosRequestConfig): Promise<any> => {
        return this.client.delete(url, {...config});
    };
}

export {
    APIClient,
    setAuthorization,
    getLoggedinUser,
    setLoggedinUser,
    clearAuth,
    publicAxios,
    authAxios
};