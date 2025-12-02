import {emailLoginSuccess, emailLoginError} from "./reducer";
import {APIClient} from "../../../helpers/api_helper";

export const emailLinkLogin = (formData: any, history: any) => async (dispatch: any) => {
    try {
        const api = new APIClient();
        const response = await api.create("/users/magic_link/send_magic_link/?link_type=login", formData);

        if (response) {
            dispatch(
                emailLoginSuccess("Ссылка для входа отправлена на вашу почту. Проверьте email.")
            );
        }
    } catch (error: any) {
        console.error("Ошибка при отправке magic link:", error);

        dispatch(emailLoginError(error.response?.data || {detail: error.message}));
    }
};