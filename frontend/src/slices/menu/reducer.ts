import {createCrudSlice} from "../common/reducer";
import {createCrudThunks} from "../common/thunk";
import {Menu} from "../../types/Menu";

const menuSlice = createCrudSlice<Menu>('menu');

export const menuReducer = menuSlice.reducer;
export const menuActions = menuSlice.actions;

export const menuThunks = createCrudThunks(
    '/menu/',
    menuActions
);
