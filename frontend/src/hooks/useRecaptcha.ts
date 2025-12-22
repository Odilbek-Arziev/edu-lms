import {useRef} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {showError} from "../utils/swal";

export const useRecaptcha = () => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const executeRecaptcha = async (): Promise<string | null> => {
        try {
            if (!recaptchaRef.current) {
                await showError('Ошибка', 'reCAPTCHA не инициализирована');
                return null;
            }

            const token = await (recaptchaRef.current as any).executeAsync();

            try {
                if (recaptchaRef.current?.reset) {
                    recaptchaRef.current.reset();
                }
            } catch (resetError) {
                console.warn('Failed to reset reCAPTCHA:', resetError);
            }

            if (!token) {
                await showError('Ошибка', 'Не удалось проверить капчу');
                return null;
            }

            return token;
        } catch (e: any) {
            console.error('reCAPTCHA error:', e);
            await showError('Ошибка', 'Ошибка проверки капчи. Попробуйте снова.');
            return null;
        }
    };

    return {recaptchaRef, executeRecaptcha};
};