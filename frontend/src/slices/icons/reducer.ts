import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    items: [],
    loading: false,
    error: ''
};

const iconsSlice = createSlice({
    name: 'icons',
    initialState,
    reducers: {
        iconsSuccess(state, action) {
            state.items = action.payload;
            state.loading = false;
            state.error = "";
        },
        iconsError(state, action) {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const {iconsSuccess, iconsError} = iconsSlice.actions

export default iconsSlice.reducer