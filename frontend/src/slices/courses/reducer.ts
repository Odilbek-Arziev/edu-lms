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
        setLessons(state: Draft<any>, action: PayloadAction<any>) {
            state.lessons = action.payload
        },
    }
});

export const coursesReducer = coursesSlice.reducer;

const {
    request,
    success,
    error,
    setLanguages,
    setLevels,
    setCategories,
    setLessons
} = coursesSlice.actions;

export const coursesActions = {
    request: request as ActionCreatorWithoutPayload,
    success: success as ActionCreatorWithPayload<any>,
    error: error as ActionCreatorWithPayload<string>,
    setLanguages: setLanguages as ActionCreatorWithPayload<any>,
    setLevels: setLevels as ActionCreatorWithPayload<any>,
    setCategories: setCategories as ActionCreatorWithPayload<any>,
    setLessons: setLessons as ActionCreatorWithPayload<any>,
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

        dispatch(coursesActions.request());

        try {
            const response = await api.get('/courses/languages/');
            dispatch(coursesActions.setLanguages(response));
            dispatch(coursesActions.success(response));
            return response;
        } catch (error: any) {
            const message = error.response?.data || 'Ошибка загрузки языков';
            dispatch(coursesActions.error(message));
            return null;
        }
    },

    getLevels: () => async (dispatch: any) => {
        const api = new APIClient();

        dispatch(coursesActions.request());

        try {
            const response = await api.get('/courses/levels/');
            dispatch(coursesActions.setLevels(response));
            dispatch(coursesActions.success(response));
            return response;
        } catch (error: any) {
            const message = error.response?.data || 'Ошибка загрузки уровней курсов';
            dispatch(coursesActions.error(message));
            return null;
        }
    },

    getCategories: () => async (dispatch: any) => {
        const api = new APIClient();

        dispatch(coursesActions.request());

        try {
            const response = await api.get('/categories/');

            const categories = response?.map((item: any) => ({
                value: item.id,
                label: item.title,
            })) || [];

            dispatch(coursesActions.setCategories(categories));
            dispatch(coursesActions.success(response));
            return response;
        } catch (error: any) {
            const message = error.response?.data || 'Ошибка загрузки категорий';
            dispatch(coursesActions.error(message));
            return null;
        }
    },

    getLessons: (id: number) => async (dispatch: any) => {
        const api = new APIClient();

        dispatch(coursesActions.request());

        try {
            const response = await api.get(`/courses/${id}/lessons`);

            dispatch(coursesActions.setLessons(response));
            dispatch(coursesActions.success(response));
            return response;
        } catch (error: any) {
            const message = error.response?.data || 'Ошибка загрузки уроков курса';
            dispatch(coursesActions.error(message));
            return null;
        }
    }
};