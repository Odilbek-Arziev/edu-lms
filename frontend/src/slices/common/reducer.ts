import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CrudState} from "./crudState";

export function createCrudSlice<T>(name: string, extraReducers?: any) {
    const initialState: CrudState<T> = {
        items: [],
        loading: false,
        error: '',
        count: 0,
        next: null,
        previous: null
    };

    return createSlice({
        name,
        initialState,
        reducers: {
            request(state) {
                state.loading = true;
                state.error = '';
            },
            success(state, action: PayloadAction<any>) {
                const {results, count, next, previous} = action.payload;

                state.items = results;
                state.count = count;
                state.next = next;
                state.previous = previous;
                state.loading = false;
            },
            error(state, action: PayloadAction<string>) {
                state.error = action.payload;
                state.loading = false;
            }
        },
        extraReducers
    });
}
