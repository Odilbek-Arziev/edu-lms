import {createSimpleListSlice} from "../common/simpleListReducer";
import {createSimpleListThunks} from "../common/simpleListThunk";
import {Icon} from "../../types/Icon";

const iconsSlice = createSimpleListSlice<Icon>('icons');

export const iconsReducer = iconsSlice.reducer;
export const iconsActions = iconsSlice.actions;

export const iconsThunks = createSimpleListThunks('/icons/', iconsActions);