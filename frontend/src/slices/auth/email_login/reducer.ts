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
            console.log(action.payload)
            state.loginError = action.payload?.non_field_errors?.[0] || action.payload?.detail || "Ошибка входа";
        },
    },
});

export const {
    emailLoginSuccess,
    emailLoginError
} = emailLoginSlice.actions

export default emailLoginSlice.reducer;
