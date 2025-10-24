import {useEffect, useState} from "react";
import {getLoggedinUser, setAuthorization} from "../../helpers/api_helper";

const useProfile = () => {
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {

        const user = getLoggedinUser();

        if (user) {
            setUserProfile(user);
            setAuthorization(user.access);
        } else {
            console.log("❌ Пользователь не найден в useProfile");
            setUserProfile(null);
        }

        setLoading(false);
    }, []);

    return {
        userProfile,
        loading,
        token: userProfile?.access || null,
    };
};

export {useProfile};