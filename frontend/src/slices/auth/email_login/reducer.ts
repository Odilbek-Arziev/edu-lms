import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    loginSuccessMsg: null,
    loginError: null,
};

const emailLoginSlice = createSlice({
    name: "email_login",
    initialState,
    reducers: {
        emailLoginSuccess(state, action) {
            state.loginSuccessMsg = action.payload;
            state.loginError = null;
        },
        emailLoginError(state, action) {
            state.loginError =
                action.payload?.non_field_errors?.[0] ||
                action.payload?.detail ||
                action.payload?.message ||
                action.payload?.error ||
                "Ошибка входа";
            state.loginSuccessMsg = null;
        },
        resetEmailLogin(state) {
            state.loginSuccessMsg = null;
            state.loginError = null;
        }
    },
});

export const {
    emailLoginSuccess,
    emailLoginError,
    resetEmailLogin
} = emailLoginSlice.actions;

export default emailLoginSlice.reducer;