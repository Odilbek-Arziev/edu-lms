import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    items: [],
    registerTypes: [],
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

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        usersRequest(state) {
            state.loading = true;
            state.error = "";
        },
        setRegisterTypes: (state, action) => {
            state.registerTypes = Array.isArray(action.payload)
                ? action.payload
                : action.payload?.results ?? [];
        },
        usersSuccess(state, action) {
            const {results, count, next, previous} = action.payload;

            state.items = results;
            state.count = count;
            state.next = next;
            state.previous = previous;

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