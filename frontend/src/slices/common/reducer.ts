import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CrudState} from "./crudState";

export function createCrudSlice<T>(
    name: string,
    config?: {
        reducers?: any;
        extraReducers?: any;
        simplifiedResponse?: boolean;
    }
) {
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
            request(state: any) {
                state.loading = true;
                state.error = '';
            },
            success(state: any, action: PayloadAction<any>) {
                if (config?.simplifiedResponse) {
                    state.items = action.payload as any;
                    state.count = action.payload.length;
                } else {
                    const {results, count, next, previous} = action.payload;
                    state.items = results as any;
                    state.count = count;
                    state.next = next;
                    state.previous = previous;
                }
                state.loading = false;
            },
            error(state: any, action: PayloadAction<string>) {
                state.error = action.payload;
                state.loading = false;
            },
            ...(config?.reducers || {})
        },
        extraReducers: config?.extraReducers
    });
}