import {getUserRoles} from "../helpers/getUserRoles";

export function usePermission() {
    const roles = getUserRoles();
    return {
        hasRole: (allowed: string[]) => roles.some((r) => allowed.includes(r)),
        roles,
    };
}