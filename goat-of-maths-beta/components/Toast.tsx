

import React, { useState, useEffect, useCallback } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    // Wait for animation to finish before removing from DOM
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Corresponds to duration-300
  }, [onDismiss, toast.id]);
  
  useEffect(() => {
    // Animate in on mount
    const onMount = requestAnimationFrame(() => {
      setVisible(true);
    });

    // Auto-dismiss timer
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3000);

    return () => {
      cancelAnimationFrame(onMount);
      clearTimeout(timer);
    };
  }, [handleDismiss]);

  return (
    <div
      className={`max-w-xs bg-green-500 text-white text-sm rounded-xl shadow-lg p-3 m-2 transition-all duration-300 ease-in-out transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p className="flex-grow pr-2">{toast.message}</p>
        <button
          onClick={handleDismiss}
          className="ml-2 flex-shrink-0 p-1.5 rounded-full text-xl leading-none flex items-center justify-center h-6 w-6 opacity-75 hover:opacity-100 hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Fermer"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};


interface ToastContainerProps {
    toasts: ToastMessage[];
    removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-16 right-0 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};