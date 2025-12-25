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