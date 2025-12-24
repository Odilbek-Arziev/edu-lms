import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    items: [],
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

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        menuRequest(state) {
            state.loading = true;
            state.error = "";
        },
        menuSuccess(state, action) {
            const {results, count, next, previous} = action.payload;

            state.items = results;
            state.count = count;
            state.next = next;
            state.previous = previous;

            state.loading = false;
            state.error = "";
        },
        menuError(state, action) {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const {menuRequest, menuSuccess, menuError} = menuSlice.actions

export default menuSlice.reducer