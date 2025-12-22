import {useCallback} from 'react';
import {showError} from "../utils/swal";

declare global {
    interface Window {
        grecaptcha: any;
    }
}

export const useRecaptchaV3 = () => {
    const executeRecaptcha = useCallback(async (action: string = 'submit'): Promise<string | null> => {
        try {
            if (typeof window.grecaptcha === 'undefined') {
                console.error('grecaptcha not loaded');
                await showError('Ошибка', 'reCAPTCHA не загружена. Попробуйте перезагрузить страницу.');
                return null;
            }

            await new Promise<void>((resolve) => {
                window.grecaptcha.ready(() => resolve());
            });

            const token = await window.grecaptcha.execute(
                process.env.REACT_APP_RECAPTCHA_SITE_KEY,
                {action}
            );

            if (!token) {
                await showError('Ошибка', 'Не удалось получить токен reCAPTCHA');
                return null;
            }

            return token;
        } catch (e: any) {
            console.error('reCAPTCHA v3 error:', e);
            await showError('Ошибка', 'Ошибка проверки капчи');
            return null;
        }
    }, []);

    return {executeRecaptcha};
};