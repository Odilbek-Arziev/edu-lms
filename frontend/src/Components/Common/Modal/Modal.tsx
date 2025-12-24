import React, {useEffect, ReactNode} from 'react';
import {createPortal} from 'react-dom';

interface ModalProps {
    isActive: boolean;
    children: ReactNode;
    onClose: () => void;
}

export function Modal({isActive, children, onClose}: ModalProps) {
    useEffect(() => {
        const handleKeyboard = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isActive) {
            window.addEventListener('keydown', handleKeyboard);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyboard);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, isActive]);

    if (!isActive) return null;

    return createPortal(
        <div
            className="modal fade show d-block"
            style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        >
            <div
                className="modal-dialog modal-dialog-centered"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}