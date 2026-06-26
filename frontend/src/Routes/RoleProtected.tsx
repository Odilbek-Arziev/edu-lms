import {Navigate} from "react-router-dom";
import {getUserRoles} from "../helpers/getUserRoles";

const RoleProtected = ({allowedRoles, children}: {
    allowedRoles: string[];
    children: JSX.Element;
}) => {
    const roles = getUserRoles();
    console.log(roles)
    const hasAccess = roles.some((r) => allowedRoles.includes(r));

    if (!hasAccess) {
        return <Navigate to="/access-denied" replace/>;
    }
    return children;
};

export default RoleProtected;