import Swal from 'sweetalert2';

export const showLoading = (title = 'Загрузка...', text = 'Пожалуйста, подождите...') => {
    Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

export const closeLoading = () => {
    Swal.close();
};

export const showSuccess = (title: string, text?: string) => {
    return Swal.fire({
        icon: 'success',
        title,
        text,
    });
};

export const showError = (title: string, text?: string) => {
    return Swal.fire({
        icon: 'error',
        title,
        text,
    });
};

export const showConfirm = (title: string, text?: string) => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Да',
        cancelButtonText: 'Отмена',
    });
};

export default Swal;