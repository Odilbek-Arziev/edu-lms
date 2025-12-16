import {useCallback} from "react";
import Swal from 'sweetalert2'

export function useApiHandler(setLoader: (loading: boolean) => void) {
    const handleRequest = useCallback(async <T>(
        apiCall: () => Promise<T>,
        callbacks?: {
            onSuccess?: () => void;
            onResetForm?: () => void;
        }
    ): Promise<T | void> => {
        try {
            setLoader(true)
            const result: any = await apiCall();

            if (result?.non_field_errors) {
                await Swal.fire({
                    title: "Ошибка",
                    text: result.non_field_errors[0],
                    icon: "error",
                });
                return;
            }

            callbacks?.onResetForm?.();
            callbacks?.onSuccess?.();

            return result
        } catch (e: any) {
            const result = e.response.data

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
