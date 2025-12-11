import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    items: [],
    loading: false,
    error: ''
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        menuSuccess(state, action) {
            state.items = action.payload;
            state.loading = false;
            state.error = "";
        },
        menuError(state, action) {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const {menuSuccess, menuError} = menuSlice.actions

export default menuSlice.reducer