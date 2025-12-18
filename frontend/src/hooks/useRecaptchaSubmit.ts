import { useState } from 'react';
import { useRecaptcha } from './useRecaptcha';
import { useApiHandler } from './useApiHandler';
import {closeLoading, showLoading} from "../utils/swal";

interface UseRecaptchaSubmitOptions {
    onSubmit: (payload: any) => Promise<any>;
    onSuccess?: () => void;
    onResetForm?: () => void;
    loadingTitle?: string;
    loadingText?: string;
    showLoadingModal?: boolean;
}

export const useRecaptchaSubmit = ({
    onSubmit,
    onSuccess,
    onResetForm,
    loadingTitle = "Отправка...",
    loadingText = "Пожалуйста, подождите",
    showLoadingModal = false
}: UseRecaptchaSubmitOptions) => {
    const [isLoading, setIsLoading] = useState(false);
    const { recaptchaRef, executeRecaptcha } = useRecaptcha();
    const { handleRequest } = useApiHandler(setIsLoading);

    const handleSubmit = async (values: any, actions?: any) => {
        if (showLoadingModal) {
            showLoading(loadingTitle, loadingText);
        }

        try {
            const token = await executeRecaptcha();

            if (!token) {
                if (showLoadingModal) closeLoading();
                return;
            }

            const payload = {
                ...values,
                captcha: token,
            };

            await handleRequest(
                () => onSubmit(payload),
                {
                    onSuccess,
                    onResetForm: onResetForm || (() => actions?.resetForm())
                }
            );

             if (showLoadingModal) closeLoading();
        } catch (error) {
             if (showLoadingModal) closeLoading();
        }
    };

    return { handleSubmit, isLoading, recaptchaRef };
};