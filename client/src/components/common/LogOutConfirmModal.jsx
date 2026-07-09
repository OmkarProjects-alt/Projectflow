import React from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { LogOut, X, AlertCircle } from 'lucide-react';
import ModalPortal from './ModalPortal';

const LogOutConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false 
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <ModalPortal>
        <div 
          className="
            fixed inset-0 
            bg-black/60 backdrop-blur-sm 
            z-50 
            animate-in fade-in 
            duration-200
          "
          onClick={onClose}
        />

    <div className="
        fixed inset-0 
        flex items-center justify-center 
        z-50 
        p-4
        animate-in zoom-in-95 
        duration-200
      ">
        <div className={`
          ${theme.card.primary}
          ${theme.border}
          max-w-md 
          w-full 
          rounded-2xl 
          shadow-2xl 
          shadow-black/50
          overflow-hidden
        `}>
          {/* Header */}
          <div className={`
            flex items-center justify-between
            px-6 py-4
            ${theme.table.divider}
            border-b
          `}>
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-xl
                bg-red-500/10
                ${theme.text.danger}
              `}>
                <LogOut size={20} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
                Logout Confirmation
              </h3>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className={`
                p-1.5 rounded-lg
                ${theme.text.muted}
                hover:${theme.text.primary}
                hover:bg-gray-200/20
                dark:hover:bg-gray-800/50
                transition-all
                duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
              `}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <div className="flex flex-col items-center text-center">
              {/* Warning Icon */}
              <div className={`
                p-4 rounded-full
                bg-red-500/10
                ${theme.text.danger}
                mb-4
              `}>
                <AlertCircle size={40} />
              </div>

              {/* Title */}
              <h4 className={`text-xl font-bold ${theme.text.primary} mb-2`}>
                Are you sure?
              </h4>

              {/* Description */}
              <p className={`${theme.text.muted} text-sm leading-relaxed max-w-sm`}>
                You are about to log out of your account. 
                You'll need to sign in again to access your projects and tasks.
              </p>

              {/* Session Info */}
              <div className={`
                mt-4 p-3
                ${theme.card.secondary}
                rounded-xl
                w-full
                text-left
              `}>
                <p className={`${theme.text.muted} text-xs`}>
                  <span className="font-medium">Note:</span> Your active session will be terminated and you'll be redirected to the login page.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`
            flex flex-col sm:flex-row items-center gap-3
            px-6 py-4
            ${theme.table.divider}
            border-t
            bg-gray-50/5
          `}>
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`
                w-full sm:w-auto
                px-6 py-2.5
                rounded-xl
                ${theme.button.secondary}
                ${theme.text.secondary}
                hover:${theme.text.primary}
                transition-all
                duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
                order-2 sm:order-1
              `}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`
                w-full sm:w-auto
                px-6 py-2.5
                rounded-xl
                bg-red-500
                hover:bg-red-600
                active:bg-red-700
                text-white
                font-medium
                transition-all
                duration-200
                hover:scale-[1.02]
                active:scale-[0.98]
                hover:shadow-lg
                hover:shadow-red-500/20
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                flex items-center justify-center
                gap-2
                order-1 sm:order-2
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut size={18} />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal> 
  );
};

export default LogOutConfirmModal;