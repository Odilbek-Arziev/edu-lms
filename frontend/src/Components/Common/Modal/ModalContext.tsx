import React, {createContext, useState, ReactNode} from 'react';
import {Modal} from './Modal';

export interface ModalState {
    content: ReactNode | null;
    onClose?: () => void;
}

export interface ModalContextType {
    setModalComponent: (modal: ModalState | null) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
    children: ReactNode;
}

export function ModalProvider({children}: ModalProviderProps) {
    const [modalComponent, setModalComponent] = useState<ModalState | null>(null);

    return (
        <ModalContext.Provider value={{setModalComponent}}>
            {children}
            {modalComponent && modalComponent.content ? (
                <Modal
                    isActive={true}
                    onClose={() => {
                        if (typeof modalComponent.onClose === 'function') {
                            modalComponent.onClose();
                        }
                        setModalComponent(null);
                    }}
                >
                    {modalComponent.content}
                </Modal>
            ) : null}
        </ModalContext.Provider>
    );
}