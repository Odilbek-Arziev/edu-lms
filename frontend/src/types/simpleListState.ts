export interface SimpleListState<T> {
    items: T[];
    loading: boolean;
    error: string;
}