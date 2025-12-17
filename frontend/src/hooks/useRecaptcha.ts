import {useRef} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Swal = require('sweetalert2');

export const useRecaptcha = () => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const executeRecaptcha = async (): Promise<string | null> => {
        try {
            if (!recaptchaRef.current) {
                await Swal.fire('Ошибка', 'reCAPTCHA не инициализирована', 'error');
                return null;
            }

            const token = await (recaptchaRef.current as any).executeAsync();

            if (recaptchaRef.current.reset) {
                recaptchaRef.current.reset();
            }

            if (!token) {
                await Swal.fire('Ошибка', 'Не удалось проверить капчу', 'error');
                return null;
            }

            return token;
        } catch (e) {
            await Swal.fire('Ошибка', 'Ошибка проверки капчи', 'error');
            return null;
        }
    };

    return {recaptchaRef, executeRecaptcha};
};