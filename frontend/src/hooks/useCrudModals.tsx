import React from "react";
import {useModal} from "../Components/Hooks/useModal";
import {EditModalProps} from "../types/editModal";

type CrudComponents = {
    create?: React.ComponentType<any>;
    edit?: React.ComponentType<any>;
    remove?: React.ComponentType<any>;
};

type UseCrudModalsOptions = {
    onChange?: () => void;
    extraProps?: Record<string, any>;
};

export function useCrudModals(
    components: CrudComponents,
    {onChange, extraProps}: UseCrudModalsOptions = {}
) {
    const {create: Create, edit: Edit, remove: Remove} = components;

    const [showCreate, hideCreate] = useModal(
        Create ? (
            <Create
                {...extraProps}
                onSuccess={() => {
                    onChange?.();
                    hideCreate();
                }}
                onCancel={() => hideCreate()}
            />
        ) : <></>
    );

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) =>
            Edit ? (
                <Edit
                    {...props}
                    {...extraProps}
                    onSuccess={() => {
                        onChange?.();
                        hideEdit();
                    }}
                    onCancel={() => hideEdit()}
                />
            ) : <></>
    );

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) =>
            Remove ? (
                <Remove
                    {...props}
                    {...extraProps}
                    onSuccess={() => {
                        onChange?.();
                        hideDelete();
                    }}
                    onCancel={() => hideDelete()}
                />
            ) : <></>
    );

    return {showCreate, hideCreate, showEdit, hideEdit, showDelete, hideDelete};
}