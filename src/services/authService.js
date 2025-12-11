// src/services/authService.js
import api from './api';
import { Link, useNavigate } from 'react-router-dom'


// Service pour toutes les opérations d'authentification
const authService = {

    // 📝 INSCRIPTION
    async register(userData) {
        try {
            console.log('🔄 Tentative d\'inscription...', userData);
            const response = await api.post('/users/register/', userData);

            // Si inscription réussie, sauvegarder les tokens
            if (response.data.tokens) {
                localStorage.setItem('access_token', response.data.tokens.access);
                localStorage.setItem('refresh_token', response.data.tokens.refresh);
            }

            return response.data;
        } catch (error) {
            console.error('❌ Erreur inscription:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 🔐 CONNEXION
    async login(credentials) {
        try {
            console.log('🔄 Tentative de connexion...', credentials.email);
            const response = await api.post('/users/login/', credentials);

            // Sauvegarder les tokens
            if (response.data.tokens) {
                localStorage.setItem('access_token', response.data.tokens.access);
                localStorage.setItem('refresh_token', response.data.tokens.refresh);
            }

            return response.data;
        } catch (error) {
            console.error('❌ Erreur connexion:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 👤 RÉCUPÉRER PROFIL
    async getProfile() {
        try {
            console.log('🔄 Récupération du profil...');
            const response = await api.get('/users/profile/');
            return response.data;
        } catch (error) {
            console.error('❌ Erreur profil:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 📊 DASHBOARD UTILISATEUR
    async getDashboard() {
        try {
            console.log('🔄 Récupération du dashboard...');
            const response = await api.get('/users/dashboard/');
            return response.data;
        } catch (error) {
            console.error('❌ Erreur dashboard:', error.response?.data);
            throw error.response?.data || error;
        }
    },
    async getUserStats() {
        try {
            console.log('🔄 Récupération des stats utilisateur...');
            const response = await api.get('/users/stats/');
            console.log('✅ Stats utilisateur récupérées:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur stats utilisateur:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 🚪 DÉCONNEXION
    async logout() {
        try {
            console.log('🔄 Déconnexion...');

            const refreshToken = localStorage.getItem('refresh_token');

            // Envoyer le refresh token si disponible
            if (refreshToken) {
                await api.post('/users/logout/', {
                    refresh: refreshToken  // ← AJOUTER CETTE LIGNE
                });
            }

            console.log('✅ Déconnexion API réussie');
        } catch (error) {
            console.error('❌ Erreur déconnexion:', error.response?.data);
            // On continue quand même pour nettoyer le localStorage
        } finally {
            // Toujours nettoyer le localStorage, même si l'API échoue
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            console.log('🧹 localStorage nettoyé');
        }
    },
    // 🔄 REFRESH TOKEN
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                throw new Error('Pas de refresh token disponible');
            }

            const response = await api.post('/users/token/refresh/', {
                refresh: refreshToken
            });

            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        } catch (error) {
            console.error('❌ Erreur refresh token:', error.response?.data);
            this.logout(); // Forcer la déconnexion
            throw error;
        }
    },

    // ✅ VÉRIFIER SI CONNECTÉ
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    },

    // 📱 RÉCUPÉRER TOKEN
    getToken() {
        return localStorage.getItem('access_token');
    }
};

export default authService;