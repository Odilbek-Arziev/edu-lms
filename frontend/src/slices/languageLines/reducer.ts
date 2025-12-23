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
    lastFetch: null
};

const LanguageLinesSlice = createSlice({
    name: 'language-lines',
    initialState,
    reducers: {
        languageLinesRequest(state) {
            state.loading = true;
            state.error = "";
        },
        
        languageLinesSuccess(state, action: PayloadAction<LanguageLine[]>) {
            state.items = action.payload;
            state.loading = false;
            state.error = "";
            state.lastFetch = Date.now();
            
            const translationsByLang: TranslationsByLanguage = {
                en: {},
                ru: {},
                uz: {}
            };
            
            action.payload.forEach((item: LanguageLine) => {
                Object.keys(item.value).forEach((lang: string) => {
                    if (!translationsByLang[lang]) {
                        translationsByLang[lang] = {};
                    }
                    translationsByLang[lang][item.key] = item.value[lang];
                });
            });
            
            state.translations = translationsByLang;
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
    languageLinesError,
    setCurrentLanguage,
    upsertLanguageLine,
    removeLanguageLine
} = LanguageLinesSlice.actions;

export default LanguageLinesSlice.reducer;