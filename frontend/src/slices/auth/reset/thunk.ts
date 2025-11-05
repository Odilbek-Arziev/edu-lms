import {APIClient} from "../../../helpers/api_helper";
import {resetPasswordError, resetPasswordSuccess} from "./reducer";


export const resetPassword = (data: any, history: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;

        response = api.create("/users/password/reset_password/", {
            password: data.password,
            confirm_password: data.confirm_password,
            token: data.token
        });

        const result = await response;

        if (result) {
            dispatch(resetPasswordSuccess(
                "Password successfully updated. Please, login"
            ))
            history("/login");
        }
        return response
    } catch (error: any) {
        dispatch(resetPasswordError(error));
    }
};
