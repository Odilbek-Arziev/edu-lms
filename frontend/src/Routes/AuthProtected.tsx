import React, {useEffect} from "react";
import {Navigate} from "react-router-dom";
import {setAuthorization} from "../helpers/api_helper";
import {useDispatch} from "react-redux";

import {useProfile} from "../Components/Hooks/UserHooks";

import {logoutUser} from "../slices/auth/login/thunk";

const AuthProtected = (props: any) => {
    const dispatch: any = useDispatch();
    const {userProfile, loading, token} = useProfile();

    useEffect(() => {
        if (userProfile && !loading && token) {
            setAuthorization(token);
        } else if (!userProfile && !loading && !token) {
            console.log("❌ Пользователь не авторизован, выполняем logout");
            dispatch(logoutUser());
        }
    }, [token, userProfile, loading, dispatch]);

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                Загрузка...
            </div>
        );
    }

    if (!userProfile && !token) {
        return <Navigate to="/login" replace />;
    }

    return <>{props.children}</>;
};

export default AuthProtected;