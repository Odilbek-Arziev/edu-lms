import {CrudState} from "../slices/common/crudState";

export interface UsersState<T> extends CrudState<T> {
    registerTypes: any[];
}