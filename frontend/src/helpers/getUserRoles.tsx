import {getLoggedinUser} from "./api_helper";

const getUserRoles = (): string[] => {
    const user = getLoggedinUser();
    return user?.roles || [];
};

export {getUserRoles};