import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {Course} from "../../types/Course";
import {ActionCreatorWithPayload, ActionCreatorWithoutPayload, Draft, PayloadAction} from "@reduxjs/toolkit";
import {APIClient} from "../../helpers/api_helper";


const coursesSlice = createCrudSlice<Course>('courses', {
    reducers: {
        setLanguages(state: Draft<any>, action: PayloadAction<any>) {
            state.languages = action.payload
        },
        setLevels(state: Draft<any>, action: PayloadAction<any>) {
            state.levels = action.payload
        },
        setCategories(state: Draft<any>, action: PayloadAction<any>) {
            state.categories = action.payload
        },
    }
});

export const coursesReducer = coursesSlice.reducer;

const {request, success, error, setLanguages, setLevels, setCategories} = coursesSlice.actions;

export const coursesActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>,
    setLanguages: setLanguages as ActionCreatorWithPayload<any>,
    setLevels: setLevels as ActionCreatorWithPayload<any>,
    setCategories: setCategories as ActionCreatorWithPayload<any>,
}

const baseThunks = createCrudThunks('/courses/', {
    request: coursesActions.request,
    success: coursesActions.success,
    error: coursesActions.error
});

export const coursesThunks = {
    ...baseThunks,

    getLanguages: () => async (dispatch: any) => {
        const api = new APIClient();

        try {
            const response = await api.get('/courses/languages/');
            dispatch(coursesActions.setLanguages(response));
            return response;
        } catch (error: any) {
            const message = error.response?.data || 'Ошибка загрузки языков';
            dispatch(coursesActions.error(message));
            return null;
        }
    },

    getLevels: () => async (dispatch: any) => {
        const api = new APIClient();

        try {
            const response = await api.get('/courses/levels/');
            dispatch(coursesActions.setLevels(response));
            return response;
        } catch (error: any) {
            const message = error.response?.data || 'Ошибка загрузки уровней курсов';
            dispatch(coursesActions.error(message));
            return null;
        }
    },

    getCategories: () => async (dispatch: any) => {
        const api = new APIClient();

        try {
            const response = await api.get('/categories/');
            dispatch(coursesActions.setCategories(response));
            return response;
        } catch (error: any) {
            const message = error.response?.data || 'Ошибка загрузки категорий';
            dispatch(coursesActions.error(message));
            return null;
        }
    }
};