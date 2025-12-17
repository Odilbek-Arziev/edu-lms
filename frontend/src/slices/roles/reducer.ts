import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    items: [],
    currentRole: null,
    loading: false,
    error: ''
};

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        rolesRequest(state) {
            state.loading = true;
            state.error = "";
        },
        rolesSuccess(state, action) {
            state.items = action.payload;
            state.loading = false;
            state.error = "";
        },
        setCurrentRole(state, action) {
            state.currentRole = action.payload;
            state.loading = false;
            state.error = "";
        },
        rolesError(state, action) {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const {rolesRequest, rolesSuccess, rolesError, setCurrentRole} = rolesSlice.actions

export default rolesSlice.reducer