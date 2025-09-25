//Include Both Helper File with needed methods
import {getFirebaseBackend} from "../../../helpers/firebase_helper";
import {
    postFakeLogin,
    postJwtLogin,
} from "../../../helpers/fakebackend_helper";

import {loginSuccess, logoutUserSuccess, apiError, reset_login_flag} from './reducer';
import {APIClient} from "../../../helpers/api_helper";

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            let fireBaseBackend: any = getFirebaseBackend();
            response = await fireBaseBackend.loginUser(user.email, user.password);
        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
            response = await api.create("/users/auth/login/", {
                login: user.login,
                password: user.password,
            });
        } else {
            response = postFakeLogin({
                email: user.email,
                password: user.password,
            });
        }

        dispatch(loginSuccess(response));

        if (history) history("/");

        return response;
    } catch (error: any) {
        const safeError = error.response?.data || {non_field_errors: ["Неизвестная ошибка"]};
        dispatch(apiError(safeError));
        return safeError;
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

        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const fireBaseBackend: any = getFirebaseBackend();
            response = fireBaseBackend.socialLoginUser(type);
        }
        //  else {
        //   response = postSocialLogin(data);
        // }

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