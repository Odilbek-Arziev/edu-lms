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
        const email = params.get("email");

        if (!token || !email) {
            navigate("/login");
            return;
        }

        axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/users/magic_link/verify_magic_token/`, {
            params: {token, email}
        })
            .then(res => {
                localStorage.setItem("authUser", JSON.stringify(res.data));
                navigate("/dashboard");
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