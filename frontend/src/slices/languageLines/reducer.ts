import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface TranslationValue {
    en: string;
    ru: string;
    uz: string;

    [key: string]: string;
}

export interface LanguageLine {
    id?: number;
    key: string;
    value: TranslationValue;
}

export interface FlatTranslations {
    [key: string]: string;
}

export interface TranslationsByLanguage {
    en: FlatTranslations;
    ru: FlatTranslations;
    uz: FlatTranslations;

    [key: string]: FlatTranslations;
}

export interface LanguageLinesState {
    items: LanguageLine[];
    loading: boolean;
    error: string;
    currentLanguage: string;
    translations: TranslationsByLanguage;
    lastFetch: number | null;

    count?: number;
    next?: string | null;
    previous?: string | null;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const initialState: LanguageLinesState = {
    items: [],
    loading: false,
    error: '',
    currentLanguage: localStorage.getItem("I18N_LANGUAGE") || "ru",
    translations: {
        en: {},
        ru: {},
        uz: {}
    },
    lastFetch: null,
    count: 0,
    next: null,
    previous: null,
};

const LanguageLinesSlice = createSlice({
    name: 'language-lines',
    initialState,
    reducers: {
        languageLinesRequest(state) {
            state.loading = true;
            state.error = "";
        },

        languageLinesSuccess(
            state,
            action: PayloadAction<PaginatedResponse<LanguageLine>>
        ) {
            const {results, count, next, previous} = action.payload;

            state.items = results;
            state.count = count;
            state.next = next;
            state.previous = previous;

            state.loading = false;
            state.error = "";
            state.lastFetch = Date.now();

            const translationsByLang: TranslationsByLanguage = {
                en: {},
                ru: {},
                uz: {}
            };

            results.forEach((item: LanguageLine) => {
                Object.keys(item.value).forEach((lang: string) => {
                    if (!translationsByLang[lang]) {
                        translationsByLang[lang] = {};
                    }
                    translationsByLang[lang][item.key] = item.value[lang];
                });
            });

            state.translations = translationsByLang;
        },

        setAllTranslations(state, action: PayloadAction<LanguageLine[]>) {
            if (!action.payload || !Array.isArray(action.payload)) {
                console.error('setAllTranslations: payload is undefined or not an array', action.payload);
                state.loading = false;
                return;
            }

            const translationsByLang: TranslationsByLanguage = {
                en: {},
                ru: {},
                uz: {}
            };

            action.payload.forEach((item: LanguageLine) => {
                if (!item || !item.key || !item.value) {
                    console.warn('Invalid language line item:', item);
                    return;
                }

                Object.keys(item.value).forEach((lang: string) => {
                    if (!translationsByLang[lang]) {
                        translationsByLang[lang] = {};
                    }
                    translationsByLang[lang][item.key] = item.value[lang];
                });
            });

            state.translations = translationsByLang;
            state.loading = false;
            state.error = "";
        },

        languageLinesError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },

        setCurrentLanguage(state, action: PayloadAction<string>) {
            state.currentLanguage = action.payload;
            localStorage.setItem("I18N_LANGUAGE", action.payload);
        },

        upsertLanguageLine(state, action: PayloadAction<LanguageLine>) {
            const index = state.items.findIndex(item => item.id === action.payload.id);

            if (index !== -1) {
                state.items[index] = action.payload;
            } else {
                state.items.push(action.payload);
            }

            Object.keys(action.payload.value).forEach((lang: string) => {
                if (state.translations[lang]) {
                    state.translations[lang][action.payload.key] = action.payload.value[lang];
                }
            });
        },

        removeLanguageLine(state, action: PayloadAction<number>) {
            const item = state.items.find(item => item.id === action.payload);

            if (item) {
                state.items = state.items.filter(i => i.id !== action.payload);

                Object.keys(state.translations).forEach((lang: string) => {
                    if (state.translations[lang]) {
                        delete state.translations[lang][item.key];
                    }
                });
            }
        }
    }
});

export const {
    languageLinesRequest,
    languageLinesSuccess,
    setAllTranslations,
    languageLinesError,
    setCurrentLanguage,
    upsertLanguageLine,
    removeLanguageLine
} = LanguageLinesSlice.actions;

export default LanguageLinesSlice.reducer;