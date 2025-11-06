import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    forgetSuccessMsg: null,
    forgetError: null,
};

const forgotPasswordSlice = createSlice({
    name: "forgotpwd",
    initialState,
    reducers: {
        userForgetPasswordSuccess(state, action) {
            state.forgetSuccessMsg = action.payload
            state.forgetError = null
        },
        userForgetPasswordError(state, action) {
            state.forgetError = action.payload?.non_field_errors?.[0] || action.payload?.detail || "Ошибка отправки письма";
        },
    },
});

export const {
    userForgetPasswordSuccess,
    userForgetPasswordError
} = forgotPasswordSlice.actions

export default forgotPasswordSlice.reducer;
