import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {showError} from "../../utils/swal";
import {withTranslation} from "react-i18next";


const MagicLoginPage = (props: any) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
            navigate("/login");
            return;
        }

        axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/users/magic_link/verify_magic_token/`, {
            params: {token}
        })
            .then(res => {
                const {link_type} = res.data;
                if (link_type === 'login') {
                    localStorage.setItem("authUser", JSON.stringify(res.data));
                    navigate("/dashboard");
                } else if (link_type === 'reset_password') {
                    navigate('/reset-password', {state: {token}});
                }
            })
            .catch(() => {
                showError(
                    props.t('expired_or_used_link'),
                    props.t('expired_or_used_link')
                )
                navigate("/login");
            });
    }, [location.search, navigate]);

    return <div>Verifying magic link...</div>;
}
export default withTranslation()(MagicLoginPage)