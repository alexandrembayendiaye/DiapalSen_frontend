// src/services/notificationsService.js
import api from './api'

const notificationsService = {

    // 📋 LISTE DES NOTIFICATIONS
    async getNotifications() {
        try {
            console.log('🔄 Récupération des notifications...')
            const response = await api.get('/notifications/')
            console.log('✅ Notifications récupérées:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Erreur récupération notifications:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 🔢 COMPTEUR NON LUES
    async getUnreadCount() {
        try {
            const response = await api.get('/notifications/non-lues/')
            return response.data
        } catch (error) {
            console.error('❌ Erreur count notifications:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // ✅ MARQUER COMME LUE
    async markAsRead(notificationId) {
        try {
            console.log('🔄 Marquer notification lue:', notificationId)
            const response = await api.put(`/notifications/${notificationId}/lire/`)
            console.log('✅ Notification marquée lue')
            return response.data
        } catch (error) {
            console.error('❌ Erreur marquer lue:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // ✅✅ MARQUER TOUTES COMME LUES
    async markAllAsRead() {
        try {
            console.log('🔄 Marquer toutes les notifications lues...')
            const response = await api.put('/notifications/marquer-toutes-lues/')
            console.log('✅ Toutes les notifications marquées lues')
            return response.data
        } catch (error) {
            console.error('❌ Erreur marquer toutes lues:', error.response?.data)
            throw error.response?.data || error
        }
    },

    // 🗑️ SUPPRIMER
    async deleteNotification(notificationId) {
        try {
            console.log('🔄 Suppression notification:', notificationId)
            const response = await api.delete(`/notifications/${notificationId}/supprimer/`)
            console.log('✅ Notification supprimée')
            return response.data
        } catch (error) {
            console.error('❌ Erreur suppression notification:', error.response?.data)
            throw error.response?.data || error
        }
    }
}

export default notificationsService
