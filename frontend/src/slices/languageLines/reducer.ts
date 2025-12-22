import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    items: [],
    loading: false,
    error: ''
};

const LanguageLinesSlice = createSlice({
    name: 'language-lines',
    initialState,
    reducers: {
        languageLinesRequest(state) {
            state.loading = true;
            state.error = "";
        },
        languageLinesSuccess(state, action) {
            state.items = action.payload;
            state.loading = false;
            state.error = "";
        },
        languageLinesError(state, action) {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const {languageLinesRequest, languageLinesSuccess, languageLinesError} = LanguageLinesSlice.actions

export default LanguageLinesSlice.reducer