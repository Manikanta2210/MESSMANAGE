import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useMess } from '../../context/MessContext';

export default function Toast() {
  const { toast, dismissToast } = useMess();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95',
    warning: 'border-amber-200 bg-amber-50/95',
    error: 'border-rose-200 bg-rose-50/95',
    info: 'border-blue-200 bg-blue-50/95',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-fade-in pointer-events-auto">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
          {toast.message && (
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="text-slate-600 hover:text-slate-800 p-0.5 rounded-md hover:bg-black/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
