import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    user: {},
    error: "", // for error message
    loading: false,
    isUserLogout: false,
    errorMsg: false, // for error
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        apiError(state, action) {
            state.error = action.payload.data;
            state.loading = true;
            state.isUserLogout = false;
            state.errorMsg = true;
        },
        loginSuccess(state, action) {
            const userData = action.payload;
            state.user = userData;
            state.loading = false;
            state.errorMsg = false;
            localStorage.setItem("authUser", JSON.stringify(userData));
        },
        logoutUserSuccess(state, action) {
            state.isUserLogout = true
            state.user = {};
            localStorage.removeItem("authUser");
        },
        reset_login_flag(state) {
            state.error = "";
            state.loading = false;
            state.errorMsg = false;
        }
    },
});

export const {
    apiError,
    loginSuccess,
    logoutUserSuccess,
    reset_login_flag
} = loginSlice.actions

export default loginSlice.reducer;