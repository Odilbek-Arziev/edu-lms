import {APIClient} from "../../helpers/api_helper";
import {
    languageLinesError,
    languageLinesRequest,
    languageLinesSuccess,
    setCurrentLanguage,
    upsertLanguageLine,
    removeLanguageLine,
    LanguageLine, PaginatedResponse, setAllTranslations
} from "./reducer";
import i18n from "../../i18n";
import type {RootState} from "../index";

export const fetchLanguageLines = (params: { page?: number } = {}) => async (dispatch: any, getState: () => RootState) => {
    const api = new APIClient();

    dispatch(languageLinesRequest());

    try {
        const response: PaginatedResponse<LanguageLine> =
            await api.get("/language_lines/", params);

        dispatch(languageLinesSuccess(response));

        const state = getState();
        const currentLang = state.LanguageLines.currentLanguage;
        const translations = state.LanguageLines.translations[currentLang] || {};

        i18n.addResourceBundle(currentLang, 'translation', translations, true, true);

        return response;
    } catch (error: any) {
        const message = error.response?.data || 'Ошибка загрузки языков';
        dispatch(languageLinesError(message));
        return null;
    }
}

export const loadAllTranslations = () => async (dispatch: any, getState: () => RootState) => {
    const api = new APIClient();

    try {
        const languageLines: LanguageLine[] =
            await api.get("/language_lines/", {page_size: 'all'});

        if (!Array.isArray(languageLines)) {
            console.error('Invalid API response - not an array:', languageLines);
            dispatch(languageLinesError('Некорректный ответ от сервера'));
            return false;
        }

        dispatch(setAllTranslations(languageLines));

        const state = getState();
        const currentLang = state.LanguageLines.currentLanguage;
        const translations = state.LanguageLines.translations;

        Object.keys(translations).forEach((lang: string) => {
            i18n.addResourceBundle(
                lang,
                "translation",
                translations[lang],
                true,
                true
            );
        });

        await i18n.changeLanguage(currentLang);

        return true;
    } catch (error: any) {
        console.error('❌ Error loading translations:', error);
        dispatch(languageLinesError('Ошибка загрузки переводов'));
        return false;
    }
};

export const createLanguageLines = (data: Omit<LanguageLine, 'id'>) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        const response: LanguageLine = await api.create("/language_lines/", data);

        if (response) {
            dispatch(upsertLanguageLine(response));

            Object.keys(data.value).forEach((lang: string) => {
                i18n.addResource(lang, 'translation', data.key, data.value[lang]);
            });
        }

        return response;
    } catch (error: any) {
        dispatch(languageLinesError(error));
        throw error;
    }
};

export const deleteLanguageLine = (id: number) => async (dispatch: any, getState: () => RootState) => {
    const api = new APIClient();

    try {
        const state = getState();
        const item = state.LanguageLines.items.find((item: LanguageLine) => item.id === id);

        await api.delete(`/language_lines/${id}/`);

        dispatch(removeLanguageLine(id));

        if (item) {
            Object.keys(item.value).forEach((lang: string) => {
                const resources = i18n.getResourceBundle(lang, 'translation') || {};
                delete resources[item.key];
                i18n.addResourceBundle(lang, 'translation', resources, true, true);
            });
        }

        return true;
    } catch (error: any) {
        dispatch(languageLinesError(error));
        throw error;
    }
};

export const getLanguageLine = (id: number) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        const response: LanguageLine = await api.get(`/language_lines/${id}/`);
        return response;
    } catch (error: any) {
        dispatch(languageLinesError(error));
        throw error;
    }
};

export const editLanguageLine = (id: number, data: Partial<LanguageLine>) => async (dispatch: any) => {
    const api = new APIClient();

    try {
        const response: LanguageLine = await api.update(`/language_lines/${id}/`, data);

        if (response) {
            dispatch(upsertLanguageLine(response));

            if (response.value) {
                Object.keys(response.value).forEach((lang: string) => {
                    i18n.addResource(lang, 'translation', response.key, response.value[lang]);
                });
            }
        }

        return response;
    } catch (error: any) {
        dispatch(languageLinesError(error));
        throw error;
    }
};

export const changeLanguage = (language: string) => async (dispatch: any, getState: () => RootState) => {
    try {
        const state = getState();

        dispatch(setCurrentLanguage(language));

        const translations = state.LanguageLines.translations[language] || {};

        if (!i18n.hasResourceBundle(language, 'translation')) {
            i18n.addResourceBundle(language, 'translation', translations, true, true);
        }

        await i18n.changeLanguage(language);

        return true;
    } catch (error: any) {
        console.error('Error changing language:', error);
        dispatch(languageLinesError('Ошибка смены языка'));
        return false;
    }
};

export const refreshLanguageLines = () => async (dispatch: any) => {
    return dispatch(fetchLanguageLines());
};