// src/services/interactionsService.js
import api from './api';

// Service pour toutes les interactions sociales (commentaires, favoris, partages)
const interactionsService = {

    // 💬 COMMENTAIRES D'UN PROJET
    async getCommentairesProjet(projetId) {
        try {
            console.log('🔄 Récupération commentaires du projet:', projetId);

            const response = await api.get(`/interactions/projet/${projetId}/commentaires/`);

            console.log('✅ Commentaires projet récupérés:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération commentaires projet:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 💬 AJOUTER UN COMMENTAIRE
    async ajouterCommentaire(projetId, commentaireData) {
        try {
            console.log('🔄 Ajout commentaire projet:', projetId, commentaireData);

            // Ajouter le champ projet requis par Django
            const dataToSend = {
                ...commentaireData,
                projet: projetId  // ✅ AJOUT du champ projet
            };

            const response = await api.post(`/interactions/projet/${projetId}/commenter/`, dataToSend);

            console.log('✅ Commentaire ajouté:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur ajout commentaire:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // ❤️ TOGGLE FAVORI (ajouter)
    async ajouterFavori(projetId) {
        try {
            console.log('🔄 Ajout favori projet:', projetId);

            const response = await api.post(`/interactions/projet/${projetId}/favori/`);

            console.log('✅ Favori ajouté:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur ajout favori:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // ❤️ TOGGLE FAVORI (supprimer)
    async retirerFavori(projetId) {
        try {
            console.log('🔄 Suppression favori projet:', projetId);

            const response = await api.delete(`/interactions/projet/${projetId}/favori/`);

            console.log('✅ Favori retiré:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur suppression favori:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // ❤️ MES FAVORIS
    async getMesFavoris() {
        try {
            console.log('🔄 Récupération de mes favoris...');

            const response = await api.get('/interactions/mes-favoris/');

            console.log('✅ Favoris récupérés:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération favoris:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 🔗 PARTAGER PROJET
    async partagerProjet(projetId, plateforme) {
        try {
            console.log('🔄 Partage projet:', projetId, 'sur', plateforme);

            const response = await api.post(`/interactions/projet/${projetId}/partager/`, {
                projet: projetId,
                plateforme: plateforme
            });

            console.log('✅ Projet partagé:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur partage projet:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // 🚨 SIGNALER UN CONTENU
    async signalerContenu(signalementData) {
        try {
            console.log('🔄 Signalement contenu:', signalementData);

            const response = await api.post('/interactions/signaler/', signalementData);

            console.log('✅ Contenu signalé:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur signalement:', error.response?.data);
            throw error.response?.data || error;
        }
    }
};

export default interactionsService;