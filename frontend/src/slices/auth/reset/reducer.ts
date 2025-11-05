import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    loginSuccessMsg: null,
    loginErrorMsg: null,
};

const resetPasswordSlice = createSlice({
    name: "reset",
    initialState,
    reducers: {
        resetPasswordSuccess(state, action) {
            state.loginSuccessMsg = action.payload
        },
        resetPasswordError(state, action) {
            state.loginErrorMsg = action.payload
        },
        apiErrorChange(state: any, action: any) {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {
    resetPasswordSuccess,
    resetPasswordError,
    apiErrorChange
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;