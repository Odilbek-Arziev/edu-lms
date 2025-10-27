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
            state.loginSuccessMsg = action.payload
        },
        emailLoginError(state, action) {
            state.loginError = action.payload
        },
    },
});

export const {
    emailLoginSuccess,
    emailLoginError
} = emailLoginSlice.actions

export default emailLoginSlice.reducer;
