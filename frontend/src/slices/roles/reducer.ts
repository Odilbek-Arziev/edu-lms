import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    items: [],
    currentRole: null,
    loading: false,
    error: '',
    count: 0,
    next: null,
    previous: null
};

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        rolesRequest(state) {
            state.loading = true;
            state.error = "";
        },
        rolesSuccess(state, action) {
            const {results, count, next, previous} = action.payload;

            state.items = results;
            state.count = count;
            state.next = next;
            state.previous = previous;

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