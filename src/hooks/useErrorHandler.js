// src/hooks/useErrorHandler.js
import { useState, useCallback } from 'react';
import toastService from '../services/toastService';

/**
 * Hook personnalisé pour gérer les erreurs dans les composants
 * Fournit un wrapper try/catch avec affichage automatique de toast
 * 
 * @param {object} options - Options de configuration
 * @param {boolean} options.showToast - Afficher automatiquement un toast en cas d'erreur (défaut: true)
 * @param {function} options.onError - Callback personnalisé en cas d'erreur
 * @param {boolean} options.logError - Logger l'erreur dans la console (défaut: true)
 * 
 * @returns {object} - { error, handleError, clearError, executeWithErrorHandling }
 */
const useErrorHandler = (options = {}) => {
    const {
        showToast = true,
        onError = null,
        logError = true,
    } = options;

    const [error, setError] = useState(null);

    /**
     * Gère une erreur
     * @param {Error} err - L'erreur à gérer
     * @param {string} customMessage - Message personnalisé à afficher
     */
    const handleError = useCallback((err, customMessage = null) => {
        // Sauvegarder l'erreur dans l'état
        setError(err);

        // Logger l'erreur si activé
        if (logError) {
            console.error('🔴 Error caught by useErrorHandler:', err);
        }

        // Déterminer le message à afficher
        let message = customMessage;

        if (!message) {
            // Essayer d'extraire un message de l'erreur
            if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.response?.data?.error) {
                message = err.response.data.error;
            } else if (err.message) {
                message = err.message;
            } else {
                message = 'Une erreur est survenue';
            }
        }

        // Afficher le toast si activé
        if (showToast) {
            toastService.error(message);
        }

        // Appeler le callback personnalisé si fourni
        if (onError && typeof onError === 'function') {
            onError(err, message);
        }

        return { error: err, message };
    }, [showToast, onError, logError]);

    /**
     * Efface l'erreur de l'état
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Wrapper pour exécuter une fonction avec gestion d'erreur automatique
     * @param {function} fn - Fonction à exécuter (peut être async)
     * @param {string} customMessage - Message personnalisé en cas d'erreur
     * @returns {Promise} - Résultat de la fonction ou erreur
     */
    const executeWithErrorHandling = useCallback(async (fn, customMessage = null) => {
        try {
            clearError();
            const result = await fn();
            return { success: true, data: result };
        } catch (err) {
            const errorInfo = handleError(err, customMessage);
            return { success: false, error: errorInfo.error, message: errorInfo.message };
        }
    }, [handleError, clearError]);

    return {
        error,
        handleError,
        clearError,
        executeWithErrorHandling,
    };
};

export default useErrorHandler;
