import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const Swal = require("sweetalert2");

const MagicLoginPage = () => {
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
                Swal.fire({
                    title: "Error",
                    text: 'Link expired or already used',
                    icon: "error",
                });
                navigate("/login");
            });
    }, [location.search, navigate]);

    return <div>Verifying magic link...</div>;
}
export default MagicLoginPage