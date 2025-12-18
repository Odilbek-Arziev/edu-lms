//Include Both Helper File with needed methods
import {getFirebaseBackend} from "../../../helpers/firebase_helper";

// action
import {registerUserFailed, resetRegisterFlagChange,} from "./reducer";
import {APIClient} from "../../../helpers/api_helper";

// initialize relavant method of both Auth
const fireBaseBackend: any = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
export const registerUser = (user: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;

        response = api.create("/users/auth/register/", user);
        return response
    } catch (error: any) {
        dispatch(registerUserFailed(error));
    }
};

export const resendCode = (data: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;

        response = api.create("/users/code/send_verification_code/", data);
        return response
    } catch (error: any) {
        dispatch(registerUserFailed(error));
    }
};

export const resetRegisterFlag = () => {
    try {
        return resetRegisterFlagChange();
    } catch (error) {
        return error;
    }
};

export const verifyUser = (payload: { code: string; email: string | null }) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        return await api.create("/users/code/verify_code/", payload);
    } catch (error: any) {
        return error.response?.data || {non_field_errors: ["Неизвестная ошибка"]};
    }
};

// export const apiError = () => async (dispatch : any) => {
//   try {
//     const response = dispatch(apiErrorChange(false));
//     return response;
//   } catch (error) {
//     return error;
//   }
// };