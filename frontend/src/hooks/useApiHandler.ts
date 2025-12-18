import {useCallback} from "react";
import Swal from 'sweetalert2'
import {useNavigate} from "react-router-dom";

export function useApiHandler(setLoader: (loading: boolean) => void) {
    const navigate = useNavigate();

    const handleRequest = useCallback(async <T>(
        apiCall: () => Promise<T>,
        callbacks?: {
            onSuccess?: (result: T) => void | Promise<void>;
            onResetForm?: () => void;
        }
    ): Promise<T | void> => {
        try {
            setLoader(true)
            const result: any = await apiCall();

            if (result?.non_field_errors) {
                const errorMessage = result.non_field_errors[0];
                await Swal.fire({
                    title: "Ошибка",
                    text: errorMessage,
                    icon: "error",
                });

                if (errorMessage === "Превышено количество попыток, пользователь удалён") {
                    localStorage.removeItem("verifyEmail");
                    navigate('/login');
                }

                return;
            }

            callbacks?.onResetForm?.();

            if (callbacks?.onSuccess) {
                await callbacks.onSuccess(result);
            }

            return result
        } catch (e: any) {
            const result = e.response?.data

            const fieldErrors = Object.keys(result || {}).map(key => {
                if (Array.isArray(result[key])) {
                    return `${key}: ${result[key].join(", ")}`;
                }
                return null;
            }).filter(Boolean);

            if (fieldErrors.length > 0) {
                await Swal.fire({
                    title: "Ошибка",
                    text: fieldErrors.join("\n"),
                    icon: "error",
                });
                return;
            }
        } finally {
            setLoader(false)
        }
    }, [setLoader])

    return {handleRequest};
}