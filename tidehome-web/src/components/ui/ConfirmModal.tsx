import React from 'react';
import { AlertTriangle, Archive, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'archive';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!open) return null;

  const icons = {
    danger: <Trash2 size={22} className="text-red-600"/>,
    warning: <AlertTriangle size={22} className="text-amber-600"/>,
    archive: <Archive size={22} className="text-tide-mid"/>,
  };

  const iconBg = {
    danger: 'bg-red-50',
    warning: 'bg-amber-50',
    archive: 'bg-tide-foam',
  };

  const btnClass = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    archive: 'bg-tide-deep hover:bg-tide-mid text-white',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full ${iconBg[variant]} flex items-center justify-center flex-shrink-0`}>
              {icons[variant]}
            </div>
            <div>
              <h3 className="font-serif text-lg text-tide-deep leading-tight">{title}</h3>
              <p className="text-sm text-tide-muted mt-1.5 leading-relaxed">{message}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-tide-muted hover:text-tide-deep transition-colors ml-2 flex-shrink-0"
          >
            <X size={18}/>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-tide-deep/8 mx-6"/>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`btn ${btnClass[variant]} border-0`}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}