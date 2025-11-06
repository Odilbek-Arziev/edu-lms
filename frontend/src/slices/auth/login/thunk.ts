import {getFirebaseBackend} from "../../../helpers/firebase_helper";

import {loginSuccess, logoutUserSuccess, apiError, reset_login_flag} from './reducer';
import {APIClient} from "../../../helpers/api_helper";

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        const response = await api.create("/users/auth/login/", {
            login: user.login,
            password: user.password,
        });

        dispatch(loginSuccess(response));
        if (history) history("/");
        return response;

    } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data || {};
        let message = "Ошибка входа. Попробуйте снова.";

        if (status === 429) {
            message = data.detail || "Аккаунт заблокирован: слишком много попыток. Попробуйте позже.";
        } else if (data.non_field_errors?.length) {
            message = data.non_field_errors[0];
        } else if (data.detail) {
            message = data.detail;
        }

        dispatch(apiError(message));
        return {non_field_errors: [message]};
    }
};

export const logoutUser = () => async (dispatch: any) => {
    try {
        sessionStorage.removeItem("authUser");
        let fireBaseBackend: any = getFirebaseBackend();
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const response = fireBaseBackend.logout;
            dispatch(logoutUserSuccess(response));
        } else {
            dispatch(logoutUserSuccess(true));
        }

    } catch (error) {
        dispatch(apiError(error));
    }
};

export const socialLogin = (type: any, history: any) => async (dispatch: any) => {
    try {
        let response;

        const socialdata = await response;
        if (socialdata) {
            sessionStorage.setItem("authUser", JSON.stringify(response));
            dispatch(loginSuccess(response));
            history('/dashboard')
        }

    } catch (error) {
        dispatch(apiError(error));
    }
};

export const resetLoginFlag = () => async (dispatch: any) => {
    try {
        const response = dispatch(reset_login_flag());
        return response;
    } catch (error) {
        dispatch(apiError(error));
    }
};