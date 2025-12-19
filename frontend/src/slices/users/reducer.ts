import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    users: [],
    registerTypes: [],
    loading: false,
    error: ''
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        usersRequest(state) {
            state.loading = true;
            state.error = "";
        },
        setRegisterTypes: (state, action) => {
            state.registerTypes = action.payload;
        },
        usersSuccess(state, action) {
            state.users = action.payload;
            state.loading = false;
            state.error = "";
        },
        usersError(state, action) {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const {usersRequest, setRegisterTypes, usersSuccess, usersError} = usersSlice.actions

export default usersSlice.reducer