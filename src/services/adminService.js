// ✅ ÉTAPE 4 : Service API Admin
// Créez ce fichier : src/services/adminService.js

import api from './api'; // Votre instance Axios configurée

const adminService = {
    // 📊 STATISTIQUES DASHBOARD
    async getStats() {
        try {
            const response = await api.get('/projects/admin/stats/');
            return response.data;
        } catch (error) {
            console.error('Erreur récupération stats admin:', error);
            throw error;
        }
    },

    // 📋 PROJETS EN ATTENTE
    async getProjetsEnAttente() {
        try {
            const response = await api.get('/projects/admin/en-attente/');
            return response.data;
        } catch (error) {
            console.error('Erreur récupération projets en attente:', error);
            throw error;
        }
    },

    // ✅ VALIDER PROJET
    async validerProjet(projetId, validationData) {
        try {
            const response = await api.post(`/projects/admin/valider/${projetId}/`, validationData);
            return response.data;
        } catch (error) {
            console.error('Erreur validation projet:', error);
            throw error;
        }
    },

    // 📜 HISTORIQUE VALIDATIONS
    async getHistoriqueValidations() {
        try {
            const response = await api.get('/projects/admin/validations/');
            return response.data;
        } catch (error) {
            console.error('Erreur récupération historique:', error);
            throw error;
        }
    },

    // 👥 GESTION UTILISATEURS
    async getUtilisateurs(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await api.get(`/projects/admin/users/?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Erreur récupération utilisateurs:', error);
            throw error;
        }
    },

    // 🔄 SUSPENDRE/ACTIVER UTILISATEUR (à implémenter côté backend plus tard)
    async toggleUtilisateurStatut(userId, nouveau_statut) {
        try {
            const response = await api.patch(`/projects/admin/users/${userId}/`, {
                statut_compte: nouveau_statut
            });
            return response.data;
        } catch (error) {
            console.error('Erreur modification statut utilisateur:', error);
            throw error;
        }
    },
};

export default adminService;