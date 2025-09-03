//Include Both Helper File with needed methods
import {getFirebaseBackend} from "../../../helpers/firebase_helper";
import {
    postFakeRegister,
    postJwtRegister,
} from "../../../helpers/fakebackend_helper";

// action
import {
    registerUserSuccessful,
    registerUserFailed,
    resetRegisterFlagChange,
    // apiErrorChange
} from "./reducer";
import {APIClient} from "../../../helpers/api_helper";

// initialize relavant method of both Auth
const fireBaseBackend: any = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
export const registerUser = (user: any) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        let response;

        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            response = fireBaseBackend.registerUser(user.email, user.password);
            // yield put(registerUserSuccessful(response));
        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
            response = api.create("/users/auth/register/", {
                email: user.email,
                username: user.username,
                password: user.password,
            });
            return response

        } else if (process.env.REACT_APP_API_URL) {
            response = postFakeRegister(user);
        }
    } catch (error: any) {
        dispatch(registerUserFailed(error));
    }
};

export const resetRegisterFlag = () => {
    try {
        const response = resetRegisterFlagChange();
        return response;
    } catch (error) {
        return error;
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