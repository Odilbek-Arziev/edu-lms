export interface CrudState<T> {
    items: T[];
    loading: boolean;
    error: string;
    count: number;
    next: string | null;
    previous: string | null;
    currentRole?: T | null;
}