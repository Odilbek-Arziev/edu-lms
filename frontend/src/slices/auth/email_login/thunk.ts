import {emailLoginSuccess, emailLoginError} from "./reducer";
import {APIClient} from "../../../helpers/api_helper";

export const emailLinkLogin = (formData: any, history: any) => async (dispatch: any) => {
    try {
        const api = new APIClient();

        const response = await api.create("/users/magic_link/send_magic_link/?link_type=login", formData);

        if (response) {
            dispatch(
                emailLoginSuccess("Login link has been sent to your mailbox. Please check your email.")
            );
        }
    } catch (error: any) {
        dispatch(emailLoginError(error.message || "Something went wrong while sending the link."));
    }
};
