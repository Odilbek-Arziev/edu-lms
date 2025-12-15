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
        menuRequest(state) {
            state.loading = true;
            state.error = "";
        },
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

export const { menuRequest, menuSuccess, menuError } = menuSlice.actions

export default menuSlice.reducer