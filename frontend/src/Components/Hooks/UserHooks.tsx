import {useEffect, useState} from "react";
import {getLoggedinUser} from "../../helpers/api_helper";

const useProfile = () => {
    const userProfileSession = getLoggedinUser();
    const [loading, setLoading] = useState(!userProfileSession);
    const [userProfile, setUserProfile] = useState(userProfileSession);

    useEffect(() => {
        const userProfileSession = getLoggedinUser();
        setUserProfile(userProfileSession);
        setLoading(!userProfileSession);
    }, []);

    return {
        userProfile,
        loading,
        token: userProfile?.access || null,
    };
};

export {useProfile};
