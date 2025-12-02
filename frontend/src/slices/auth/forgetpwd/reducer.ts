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
            state.forgetSuccessMsg = action.payload;
            state.forgetError = null;
        },
        userForgetPasswordError(state, action) {
            state.forgetError =
                action.payload?.non_field_errors?.[0] ||
                action.payload?.detail ||
                action.payload?.message ||
                action.payload?.error ||
                "Ошибка отправки письма";
            state.forgetSuccessMsg = null;
        },
        resetForgetPassword(state) {
            state.forgetSuccessMsg = null;
            state.forgetError = null;
        }
    },
});

export const {
    userForgetPasswordSuccess,
    userForgetPasswordError,
    resetForgetPassword
} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;