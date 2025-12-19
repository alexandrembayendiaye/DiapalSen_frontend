// src/services/api.js
import axios from 'axios';
import toastService from './toastService';

// URL de base de l'API Django (via variable d'environnement ou fallback local)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
// URL de base pour les fichiers média (images, documents)
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || 'http://127.0.0.1:8000';

// Fonction utilitaire pour construire l'URL complète d'un fichier média
export const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${MEDIA_BASE_URL}${path}`;
};

// Création de l'instance Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 secondes de timeout
});

// ========== INTERCEPTEUR REQUEST ==========
api.interceptors.request.use(
    (config) => {
        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Logger en développement uniquement
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        toastService.error('Erreur lors de la préparation de la requête');
        return Promise.reject(error);
    }
);

// ========== INTERCEPTEUR RESPONSE ==========
api.interceptors.response.use(
    (response) => {
        // Logger en développement uniquement
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ API Response:', response.status, response.config.url);
        }
        return response;
    },
    async (error) => {
        const { response, config } = error;

        // Logger l'erreur
        console.error('❌ API Error:', {
            status: response?.status,
            url: config?.url,
            message: error.message,
        });

        // ===== GESTION DES ERREURS PAR CODE HTTP =====

        if (!response) {
            // Erreur réseau (pas de réponse du serveur)
            toastService.error(
                'Problème de connexion. Vérifiez votre connexion internet.',
                { duration: 6000 }
            );
            return Promise.reject(error);
        }

        switch (response.status) {
            case 400:
                // Bad Request - Erreur de validation
                const errorMessage = response.data?.message ||
                    response.data?.error ||
                    'Données invalides';
                toastService.error(errorMessage);
                break;

            case 401:
                // Unauthorized - Token expiré ou invalide
                console.log('🔐 Token expiré, déconnexion...');

                // Nettoyer le localStorage
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                // Afficher message
                toastService.warning('Session expirée. Veuillez vous reconnecter.');

                // Rediriger vers login après un court délai
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
                break;

            case 403:
                // Forbidden - Accès refusé
                toastService.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
                break;

            case 404:
                // Not Found - Ressource introuvable
                toastService.error('Ressource introuvable');
                break;

            case 409:
                // Conflict - Conflit (ex: email déjà utilisé)
                const conflictMessage = response.data?.message ||
                    response.data?.error ||
                    'Conflit détecté';
                toastService.warning(conflictMessage);
                break;

            case 422:
                // Unprocessable Entity - Erreur de validation
                const validationMessage = response.data?.message ||
                    'Erreur de validation des données';
                toastService.error(validationMessage);
                break;

            case 429:
                // Too Many Requests - Rate limit
                toastService.warning('Trop de requêtes. Veuillez patienter un moment.');
                break;

            case 500:
            case 502:
            case 503:
            case 504:
                // Erreurs serveur
                toastService.error(
                    'Erreur serveur. Notre équipe a été notifiée.',
                    { duration: 6000 }
                );

                // TODO: Envoyer à Sentry en production
                // if (window.Sentry) {
                //     window.Sentry.captureException(error);
                // }
                break;

            default:
                // Autres erreurs
                toastService.error('Une erreur inattendue est survenue');
        }

        return Promise.reject(error);
    }
);

export default api;