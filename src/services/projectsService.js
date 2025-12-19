// src/services/projectsService.js
import api from './api'

// Service pour toutes les opérations liées aux projets
const projectsService = {

    // 📋 RÉCUPÉRER LISTE DES PROJETS
    // 📋 RÉCUPÉRER LISTE DES PROJETS
    async getProjects(filters = {}) {
        try {
            console.log('🔄 Récupération des projets...', filters)

            // Construire les paramètres de requête
            const params = new URLSearchParams()
            if (filters.search) params.append('search', filters.search)
            if (filters.category) params.append('categorie', filters.category)
            if (filters.region) params.append('region', filters.region)
            if (filters.sort) params.append('ordering', filters.sort)

            const url = `/projects/${params.toString() ? '?' + params.toString() : ''}`
            const response = await api.get(url)

            console.log('✅ Projets récupérés:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération projets:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 📊 STATISTIQUES GLOBALES POUR LA PAGE D'ACCUEIL
    async getStatsGlobales() {
        try {
            console.log('🔄 Récupération des statistiques globales...')
            const response = await api.get('/projects/')
            const projets = response.data.results || []

            const projetsActifs = projets.filter(p => p.statut === 'valide' || p.statut === 'actif')
            const totalCollecte = projets.reduce((sum, p) => sum + (parseFloat(p.montant_collecte) || 0), 0)
            const totalContributeurs = projets.reduce((sum, p) => sum + (p.nombre_contributeurs || 0), 0)
            const projetsReussis = projets.filter(p => parseFloat(p.montant_collecte) >= parseFloat(p.montant_objectif))
            const tauxReussite = projets.length > 0 ? Math.round((projetsReussis.length / projets.length) * 100) : 0

            return {
                projets_finances: projetsActifs.length,
                total_contributeurs: totalContributeurs,
                montant_total_collecte: totalCollecte,
                taux_reussite: tauxReussite
            }
        } catch (error) {
            console.error('❌ Erreur stats globales:', error)
            return { projets_finances: 0, total_contributeurs: 0, montant_total_collecte: 0, taux_reussite: 0 }
        }
    },

    // 🎯 RÉCUPÉRER UN PROJET SPÉCIFIQUE
    async getProject(id) {
        try {
            console.log('🔄 Récupération du projet ID:', id)
            const response = await api.get(`/projects/${id}/`)

            console.log('✅ Projet récupéré:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération projet:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 📝 CRÉER UN NOUVEAU PROJET
    async createProject(projectData) {
        try {
            console.log('🔄 Création du projet...', projectData)
            const response = await api.post('/projects/create/', projectData)

            console.log('✅ Projet créé:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur création projet:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // ✏️ MODIFIER UN PROJET
    async updateProject(id, projectData) {
        try {
            console.log('🔄 Mise à jour projet:', id);

            // Configurer les headers pour FormData
            const config = projectData instanceof FormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            } : {};

            const response = await api.patch(`/projects/edit/${id}/`, projectData, config);
            console.log('✅ Projet mis à jour:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur update projet:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // Alias pour compatibilité
    async updateProjet(id, projectData) {
        return this.updateProject(id, projectData)
    },

    // 👤 RÉCUPÉRER MES PROJETS (PORTEUR)
    async getMesProjets() {
        try {
            console.log('🔄 Récupération de mes projets...')
            const response = await api.get('/projects/mes-projets/')

            console.log('✅ Mes projets récupérés:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération mes projets:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 📊 RÉCUPÉRER LES CATÉGORIES
    async getCategories() {
        try {
            console.log('🔄 Récupération des catégories...')
            const response = await api.get('/projects/categories/')

            console.log('✅ Catégories récupérées:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération catégories:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 📈 RÉCUPÉRER LES STATS DES CATÉGORIES
    async getCategoriesStats() {
        try {
            console.log('🔄 Récupération des stats catégories...')
            const response = await api.get('/projects/categories/stats/')

            console.log('✅ Stats catégories récupérées:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération stats catégories:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 🖼️ UPLOAD IMAGE PRINCIPALE
    async uploadImage(projectId, imageFile) {
        try {
            console.log('🔄 Upload image pour projet ID:', projectId)

            const formData = new FormData()
            formData.append('image_principale', imageFile)

            const response = await api.post(
                `/projects/${projectId}/upload-image/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            console.log('✅ Image uploadée:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur upload image:', error.response?.data)
            throw error.response?.data || error
        }
    },
    async uploadDocument(projectId, file, type) {
        try {
            console.log(`🔄 Upload document ${type} pour projet ${projectId}`)

            const formData = new FormData()
            if (type === 'budget') {
                formData.append('document_budget', file)
            } else if (type === 'business_plan') {
                formData.append('document_business_plan', file)
            }

            const response = await api.patch(`/projects/${projectId}/upload-document/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log(`✅ Document ${type} uploadé:`, response.data)
            return response.data
        } catch (error) {
            console.error(`❌ Erreur upload document ${type}:`, error.response?.data)
            throw error.response?.data || error
        }
    },

    // 🗑️ SUPPRIMER UN PROJET (BROUILLON SEULEMENT)
    async deleteProject(id) {
        try {
            console.log('🔄 Suppression du projet ID:', id)
            const response = await api.delete(`/projects/${id}/delete/`)

            console.log('✅ Projet supprimé:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur suppression projet:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 🚀 SOUMETTRE UN PROJET POUR VALIDATION
    // 🚀 SOUMETTRE UN PROJET POUR VALIDATION
    async submitProject(id) {
        try {
            console.log('🔄 Soumission du projet ID:', id)
            const response = await api.post(`/projects/${id}/soumettre/`)  // ✅ Corrigé

            console.log('✅ Projet soumis pour validation:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur soumission projet:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 📢 PUBLIER UNE ACTUALITÉ
    async publishUpdate(projectId, updateData) {
        try {
            console.log('🔄 Publication actualité pour projet ID:', projectId, updateData)
            const response = await api.post(`/projects/${projectId}/updates/`, updateData)

            console.log('✅ Actualité publiée:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur publication actualité:', error.response?.data)
            throw error.response?.data || error
        }
    },
    // 🔍 RÉCUPÉRER UN DE MES PROJETS (PORTEUR - TOUS STATUTS)
    async getMonProjet(id) {
        try {
            console.log('🔄 Récupération de mon projet ID:', id)
            const response = await api.get(`/projects/mes-projets/${id}/`)

            console.log('✅ Mon projet récupéré:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération mon projet:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 📊 RÉCUPÉRER LES STATS D'UN PROJET
    async getProjectStats(id) {
        try {
            console.log('🔄 Récupération stats du projet ID:', id)
            const response = await api.get(`/projects/${id}/stats/`)

            console.log('✅ Stats projet récupérées:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération stats projet:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 👥 RÉCUPÉRER LES CONTRIBUTIONS D'UN PROJET
    async getProjectContributions(id) {
        try {
            console.log('🔄 Récupération contributions du projet ID:', id)
            const response = await api.get(`/contributions/projet/${id}/contributions/`)

            console.log('✅ Contributions projet récupérées:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération contributions projet:', error.response?.data)
            throw error.response?.data || error
        }
    }
}

export default projectsService