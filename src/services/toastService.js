// src/services/toastService.js
import toast from 'react-hot-toast';

/**
 * Service centralisé pour les notifications toast
 * Utilise react-hot-toast avec configuration personnalisée
 */

const toastService = {
    /**
     * Affiche un toast de succès
     * @param {string} message - Message à afficher
     * @param {object} options - Options supplémentaires
     */
    success: (message, options = {}) => {
        return toast.success(message, {
            duration: 4000,
            position: 'top-right',
            icon: '✅',
            style: {
                background: '#28a745',
                color: '#fff',
                fontWeight: '500',
            },
            ...options,
        });
    },

    /**
     * Affiche un toast d'erreur
     * @param {string} message - Message à afficher
     * @param {object} options - Options supplémentaires
     */
    error: (message, options = {}) => {
        return toast.error(message, {
            duration: 5000,
            position: 'top-right',
            icon: '❌',
            style: {
                background: '#dc3545',
                color: '#fff',
                fontWeight: '500',
            },
            ...options,
        });
    },

    /**
     * Affiche un toast d'avertissement
     * @param {string} message - Message à afficher
     * @param {object} options - Options supplémentaires
     */
    warning: (message, options = {}) => {
        return toast(message, {
            duration: 4500,
            position: 'top-right',
            icon: '⚠️',
            style: {
                background: '#ffc107',
                color: '#000',
                fontWeight: '500',
            },
            ...options,
        });
    },

    /**
     * Affiche un toast d'information
     * @param {string} message - Message à afficher
     * @param {object} options - Options supplémentaires
     */
    info: (message, options = {}) => {
        return toast(message, {
            duration: 4000,
            position: 'top-right',
            icon: 'ℹ️',
            style: {
                background: '#17a2b8',
                color: '#fff',
                fontWeight: '500',
            },
            ...options,
        });
    },

    /**
     * Affiche un toast de chargement
     * @param {string} message - Message à afficher
     * @param {object} options - Options supplémentaires
     */
    loading: (message, options = {}) => {
        return toast.loading(message, {
            position: 'top-right',
            ...options,
        });
    },

    /**
     * Gère une promesse avec des toasts automatiques
     * @param {Promise} promise - Promesse à gérer
     * @param {object} messages - Messages pour chaque état {loading, success, error}
     * @param {object} options - Options supplémentaires
     */
    promise: (promise, messages, options = {}) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Chargement...',
                success: messages.success || 'Succès !',
                error: messages.error || 'Une erreur est survenue',
            },
            {
                position: 'top-right',
                ...options,
            }
        );
    },

    /**
     * Ferme un toast spécifique
     * @param {string} toastId - ID du toast à fermer
     */
    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },

    /**
     * Ferme tous les toasts
     */
    dismissAll: () => {
        toast.dismiss();
    },

    /**
     * Toast personnalisé
     * @param {string} message - Message à afficher
     * @param {object} options - Options complètes
     */
    custom: (message, options = {}) => {
        return toast(message, {
            position: 'top-right',
            ...options,
        });
    },
};

export default toastService;
