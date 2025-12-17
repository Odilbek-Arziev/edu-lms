import {useState} from 'react';
import {useRecaptcha} from './useRecaptcha';

const Swal = require('sweetalert2');

interface UseRecaptchaSubmitOptions {
    onSubmit: (payload: any) => Promise<any>;
    onSuccess?: () => void;
    loadingTitle?: string;
    loadingText?: string;
}

export const useRecaptchaSubmit = ({
                                       onSubmit,
                                       onSuccess,
                                       loadingTitle = "Отправка...",
                                       loadingText = "Пожалуйста, подождите"
                                   }: UseRecaptchaSubmitOptions) => {
    const [isLoading, setIsLoading] = useState(false);
    const {recaptchaRef, executeRecaptcha} = useRecaptcha();

    const handleSubmit = async (values: any) => {
        setIsLoading(true);

        Swal.fire({
            title: loadingTitle,
            text: loadingText,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const token = await executeRecaptcha();

            if (!token) {
                Swal.close();
                setIsLoading(false);
                return;
            }

            const payload = {
                ...values,
                captcha: token,
            };

            await onSubmit(payload);

            Swal.close();

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            Swal.close();
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {handleSubmit, isLoading, recaptchaRef};
};