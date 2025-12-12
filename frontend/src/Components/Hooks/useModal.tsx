import React, {useContext, ReactNode} from 'react';
import {ModalContext} from "../Common/Modal";

type ModalComponent<P = any> = React.ComponentType<P> | ((props: P) => ReactNode);

export function useModal<P = any>(
    component: ModalComponent<P> | ReactNode,
    onClose?: () => void
): [showModal: (props?: P) => void, hideModal: () => void] {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }

    const {setModalComponent} = context;

    function showModal(props?: P) {
        let content: ReactNode;

        if (React.isValidElement(component)) {
            content = component;
        } else if (typeof component === 'function') {
            const Component = component as React.ComponentType<any>;
            content = <Component {...(props || {})} />;
        } else {
            content = component;
        }

        setModalComponent({content, onClose});
    }

    function hideModal() {
        if (typeof onClose === 'function') {
            onClose();
        }
        setModalComponent(null);
    }

    return [showModal, hideModal];
}