import {userForgetPasswordSuccess, userForgetPasswordError} from "./reducer"
import {APIClient} from "../../../helpers/api_helper";

export const userForgetPassword = (formData: any, history: any) => async (dispatch: any) => {
    try {
        const api = new APIClient();
        const response = await api.create("/users/magic_link/send_magic_link/?link_type=reset_password", formData);

        const data = await response;

        if (data) {
            dispatch(userForgetPasswordSuccess(
                "Reset link are sent to your mailbox, check there first"
            ))
        }
    } catch (forgetError: any) {
        console.error("Ошибка при отправке magic link:", forgetError);

        const payload =
            forgetError.response?.data ||
            {detail: forgetError.message || "Что-то пошло не так при отправке ссылки."};

        dispatch(userForgetPasswordError(payload))
    }
}