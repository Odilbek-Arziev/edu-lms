export interface Menu {
    id: number;
    title: string;
    url: string;
    parent: number | null;
    children?: Menu[];
}