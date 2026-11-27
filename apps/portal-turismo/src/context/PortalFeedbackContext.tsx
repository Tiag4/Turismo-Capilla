import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface PortalFeedbackContextType {
  isEmergencyModalOpen: boolean;
  openEmergencyModal: () => void;
  closeEmergencyModal: () => void;
  isOffline: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const PortalFeedbackContext = createContext<PortalFeedbackContextType | undefined>(undefined);

export const PortalFeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const openEmergencyModal = useCallback(() => setIsEmergencyModalOpen(true), []);
  const closeEmergencyModal = useCallback(() => setIsEmergencyModalOpen(false), []);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: PortalFeedbackContextType = {
    isEmergencyModalOpen,
    openEmergencyModal,
    closeEmergencyModal,
    isOffline,
    toasts,
    showToast,
    dismissToast,
  };

  return (
    <PortalFeedbackContext.Provider value={value}>
      {children}
      {/* Toast floating notifications renderer */}
      {toasts.length > 0 && (
        <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`p-3 rounded-xl shadow-lg border text-xs font-semibold pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2 ${
                t.type === 'error'
                  ? 'bg-rose-700 text-white border-rose-800'
                  : t.type === 'success'
                  ? 'bg-emerald-700 text-white border-emerald-800'
                  : t.type === 'warning'
                  ? 'bg-amber-600 text-white border-amber-700'
                  : 'bg-sand-900 text-white border-sand-800'
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </PortalFeedbackContext.Provider>
  );
};

export function usePortalFeedback(): PortalFeedbackContextType {
  const context = useContext(PortalFeedbackContext);
  if (!context) {
    throw new Error('usePortalFeedback debe ser utilizado dentro de un PortalFeedbackProvider');
  }
  return context;
}
