import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SimpleListState} from "../../types/simpleListState";

export function createSimpleListSlice<T>(
    name: string,
    config?: {
        reducers?: any;
        extraReducers?: any;
    }
) {
    const initialState: SimpleListState<T> = {
        items: [],
        loading: false,
        error: ''
    };

    return createSlice({
        name,
        initialState,
        reducers: {
            request(state: any) {
                state.loading = true;
                state.error = '';
            },
            success(state: any, action: PayloadAction<T[]>) {
                state.items = action.payload as any;
                state.loading = false;
            },
            error(state:any, action: PayloadAction<string>) {
                state.error = action.payload;
                state.loading = false;
            },
            ...(config?.reducers || {})
        },
        extraReducers: config?.extraReducers
    });
}