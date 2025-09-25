import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import config from "../config";

const {api} = config;

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const authUser: any = sessionStorage.getItem("authUser")
const token = JSON.parse(authUser) ? JSON.parse(authUser).token : null;
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

axios.interceptors.response.use(
    function (response) {
        return response.data ? response.data : response;
    },
    function (error) {
        if (error.response) {
            return Promise.reject(error);
        }
        return Promise.reject({
            response: {
                data: {non_field_errors: ["Сервер недоступен или проблемы с сетью"]}
            }
        });
    }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: string) => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
    /**
     * Fetches data from the given URL
     */
    get = (url: string, params?: any): Promise<AxiosResponse> => {
        let response: Promise<AxiosResponse>;

        let paramKeys: string[] = [];

        if (params) {
            Object.keys(params).map(key => {
                paramKeys.push(key + '=' + params[key]);
                return paramKeys;
            });

            const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
            response = axios.get(`${url}?${queryString}`, params);
        } else {
            response = axios.get(`${url}`, params);
        }

        return response;
    };

    /**
     * Posts the given data to the URL
     */
    create = (url: string, data: any): Promise<AxiosResponse> => {
        return axios.post(url, data);
    };

    /**
     * Updates data
     */
    update = (url: string, data: any): Promise<AxiosResponse> => {
        return axios.patch(url, data);
    };

    put = (url: string, data: any): Promise<AxiosResponse> => {
        return axios.put(url, data);
    };

    /**
     * Deletes data
     */
    delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
        return axios.delete(url, {...config});
    };
}

const getLoggedinUser = () => {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
};

export {APIClient, setAuthorization, getLoggedinUser};