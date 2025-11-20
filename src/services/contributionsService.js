// src/services/contributionsService.js
import api from './api';

// Service pour toutes les opérations liées aux contributions
const contributionsService = {

    // 💰 CONTRIBUER À UN PROJET
    async contribuer(projetId, contributionData) {
        try {
            console.log('🔄 Contribution en cours...', projetId, contributionData);

            const response = await api.post(`/contributions/projet/${projetId}/contribuer/`, contributionData);

            console.log('✅ Contribution réussie:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur contribution:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 📋 MES CONTRIBUTIONS
    async getMesContributions() {
        try {
            console.log('🔄 Récupération de mes contributions...');

            const response = await api.get('/contributions/mes-contributions/');

            console.log('✅ Contributions récupérées:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération contributions:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 🎯 DÉTAIL D'UNE CONTRIBUTION
    async getContribution(id) {
        try {
            console.log('🔄 Récupération contribution ID:', id);

            const response = await api.get(`/contributions/mes-contributions/${id}/`);

            console.log('✅ Contribution récupérée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération contribution:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 📊 STATISTIQUES CONTRIBUTIONS
    async getStatsContributions() {
        try {
            console.log('🔄 Récupération stats contributions...');

            const response = await api.get('/contributions/mes-contributions/stats/');

            console.log('✅ Stats contributions récupérées:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération stats contributions:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 📋 CONTRIBUTIONS D'UN PROJET (publique)
    async getContributionsProjet(projetId) {
        try {
            console.log('🔄 Récupération contributions du projet:', projetId);

            const response = await api.get(`/contributions/projet/${projetId}/contributions/`);

            console.log('✅ Contributions projet récupérées:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération contributions projet:', error.response?.data);
            throw error.response?.data || error;
        }
    }
};

export default contributionsService;