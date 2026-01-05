export interface CreateProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export interface DeleteProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number;
    t: (key: string, obj?: object) => string;
}

export interface EditProps {
    onCancel: () => void;
    onSuccess: () => void;
    id: number,
    initialValues: any
}

export interface FormProps {
    onSubmit: (data: any, actions: any) => Promise<void>
    onCancel: () => void,
    loader: boolean,
    initialValues?: any,
    action: string,
    t: (key: string, obj?: object) => string;
}

