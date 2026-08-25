import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notificaciones del sistema" className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        let toastClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          toastClass = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          toastClass = 'toast-error';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          toastClass = 'toast-warning';
        }

        return (
          <div key={toast.id} className={`toast-item ${toastClass}`}>
            <div className="toast-icon-wrapper">
              <Icon size={20} className="toast-icon" />
            </div>
            <div className="toast-content">
              <p className="toast-title">{toast.title}</p>
              {toast.message && <p className="toast-message">{toast.message}</p>}
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
