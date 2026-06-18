import {CrudState} from "../slices/common/crudState";

export interface UsersState<T> extends CrudState<T> {
    registerTypes: any[];
    users: any[];
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
}
