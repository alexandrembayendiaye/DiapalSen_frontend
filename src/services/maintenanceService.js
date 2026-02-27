// src/services/maintenanceService.js
// Service pour détecter quand le backend est indisponible (dyno Heroku éteint)
// et notifier l'application pour afficher un message de maintenance.

const FAILURE_THRESHOLD = 2; // Nombre d'échecs réseau consécutifs avant maintenance

let consecutiveFailures = 0;
let maintenanceMode = false;
const listeners = new Set();

/**
 * Signaler une erreur réseau (pas de réponse du serveur)
 */
const reportNetworkError = () => {
    consecutiveFailures++;

    if (consecutiveFailures >= FAILURE_THRESHOLD && !maintenanceMode) {
        maintenanceMode = true;
        notifyListeners();
        console.warn('🔧 Mode maintenance activé — backend indisponible');
    }
};

/**
 * Signaler un succès (le backend répond)
 */
const reportSuccess = () => {
    consecutiveFailures = 0;

    if (maintenanceMode) {
        maintenanceMode = false;
        notifyListeners();
        console.log('✅ Mode maintenance désactivé — backend de retour');
    }
};

/**
 * Vérifier si on est en mode maintenance
 */
const isInMaintenance = () => maintenanceMode;

/**
 * S'abonner aux changements d'état de maintenance
 * @param {function} callback - Fonction appelée avec (isInMaintenance: boolean)
 * @returns {function} Fonction de désabonnement
 */
const onMaintenanceChange = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

/**
 * Notifier tous les listeners du changement d'état
 */
const notifyListeners = () => {
    listeners.forEach((cb) => {
        try {
            cb(maintenanceMode);
        } catch (err) {
            console.error('Erreur dans listener de maintenance:', err);
        }
    });
};

const maintenanceService = {
    reportNetworkError,
    reportSuccess,
    isInMaintenance,
    onMaintenanceChange,
};

export default maintenanceService;
