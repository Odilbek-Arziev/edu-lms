import axios, {AxiosResponse, AxiosRequestConfig} from "axios";
import config from "../config";

const {api} = config;

/**
 * Создаём два клиента: публичный (без токена) и авторизованный (с токеном)
 */
const defaultConfig = {
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
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
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

/**
 * Установка токена в авторизованный клиент
 */
const setAuthorization = (token: string | null) => {

    if (!token) {
        console.log("⚠️ Токен пустой, удаляем Authorization header");
        delete authAxios.defaults.headers.common["Authorization"];
        return;
    }

    authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * Берём текущего пользователя из localStorage
 */
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
        const parsed = JSON.parse(user);
        return parsed;
    } catch (error) {
        console.error("❌ Ошибка парсинга authUser:", error);
        return null;
    }
};

/**
 * ДОБАВЛЕНО: Очистка данных авторизации
 */
const clearAuth = () => {
    console.log("🧹 Очистка данных авторизации");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    delete authAxios.defaults.headers.common["Authorization"];
};

/**
 * ДОБАВЛЕНО: Сохранение пользователя
 */
const setLoggedinUser = (userData: any) => {
    console.log("💾 Сохранение данных пользователя");

    if (!userData || !userData.access || !userData.refresh) {
        console.error("❌ Невалидные данные пользователя:", userData);
        return false;
    }

    try {
        localStorage.setItem("authUser", JSON.stringify(userData));
        console.log("✅ Данные сохранены в localStorage");

        // Устанавливаем токен сразу
        setAuthorization(userData.access);

        return true;
    } catch (error) {
        console.error("❌ Ошибка сохранения данных:", error);
        return false;
    }
};

/**
 * Универсальный APIClient
 */
class APIClient {
    private client: typeof publicAxios | typeof authAxios;

    constructor(auth: boolean = true) {
        this.client = auth ? authAxios : publicAxios;
        console.log(`🔧 APIClient создан (auth: ${auth})`);
    }

    get = (url: string, params?: any): Promise<AxiosResponse> => {
        let queryString = "";
        if (params) {
            queryString = Object.keys(params)
                .map((key) => `${key}=${params[key]}`)
                .join("&");
        }
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        console.log(`📤 GET запрос: ${fullUrl}`);
        return this.client.get(fullUrl);
    };

    create = (url: string, data: any): Promise<AxiosResponse> => {
        console.log(`📤 POST запрос: ${url}`);
        return this.client.post(url, data);
    };

    update = (url: string, data: any): Promise<AxiosResponse> => {
        console.log(`📤 PATCH запрос: ${url}`);
        return this.client.patch(url, data);
    };

    put = (url: string, data: any): Promise<AxiosResponse> => {
        console.log(`📤 PUT запрос: ${url}`);
        return this.client.put(url, data);
    };

    delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
        console.log(`📤 DELETE запрос: ${url}`);
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