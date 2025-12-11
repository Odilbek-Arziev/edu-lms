import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    items: [],
    loading: false,
    error: ''
};

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        rolesSuccess(state, action) {
            state.items = action.payload;
            state.loading = false;
            state.error = "";
        },
        rolesError(state, action) {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const {rolesSuccess, rolesError} = rolesSlice.actions

export default rolesSlice.reducer