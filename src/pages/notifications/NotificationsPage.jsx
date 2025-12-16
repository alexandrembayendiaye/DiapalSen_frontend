// src/pages/notifications/NotificationsPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import notificationsService from '../../services/notificationsService'
import toast from 'react-hot-toast'

// Icônes par type de notification
const getNotificationIcon = (type) => {
    const icons = {
        'projet_valide': 'bi-check-circle text-success',
        'projet_rejete': 'bi-x-circle text-danger',
        'infos_demandees': 'bi-pencil-square text-warning',
        'projet_soumis': 'bi-file-earmark-text text-primary',
        'nouvelle_contribution': 'bi-cash-coin text-success',
        'commentaire_projet': 'bi-chat-dots text-info',
        'objectif_atteint': 'bi-trophy text-warning',
        'fin_campagne': 'bi-clock text-secondary',
        'contribution_confirmee': 'bi-heart-fill text-danger',
        'mise_a_jour_projet': 'bi-arrow-repeat text-primary',
        'projet_finance': 'bi-check-all text-success',
        'favori_nouveau_projet': 'bi-star-fill text-warning',
        'rappel_projet': 'bi-bell text-warning',
        'bienvenue': 'bi-person-check text-primary'
    }
    return icons[type] || 'bi-bell text-secondary'
}

const NotificationsPage = () => {
    const { isAuthenticated } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, unread, read

    useEffect(() => {
        loadNotifications()
    }, [])

    const loadNotifications = async () => {
        try {
            setLoading(true)
            const data = await notificationsService.getNotifications()
            setNotifications(data.results || data || [])
        } catch (error) {
            console.error('Erreur chargement notifications:', error)
            toast.error('Erreur lors du chargement des notifications')
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsRead = async (id) => {
        try {
            await notificationsService.markAsRead(id)
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, est_lue: true } : n)
            )
            toast.success('Notification marquée comme lue')
        } catch (error) {
            console.error('Erreur marquer lue:', error)
            toast.error('Erreur lors de la mise à jour')
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            const result = await notificationsService.markAllAsRead()
            setNotifications(prev => prev.map(n => ({ ...n, est_lue: true })))
            toast.success(result.message || 'Toutes les notifications marquées comme lues')
        } catch (error) {
            console.error('Erreur marquer toutes lues:', error)
            toast.error('Erreur lors de la mise à jour')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette notification ?')) return

        try {
            await notificationsService.deleteNotification(id)
            setNotifications(prev => prev.filter(n => n.id !== id))
            toast.success('Notification supprimée')
        } catch (error) {
            console.error('Erreur suppression:', error)
            toast.error('Erreur lors de la suppression')
        }
    }

    // Filtrer les notifications
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.est_lue
        if (filter === 'read') return n.est_lue
        return true
    })

    const unreadCount = notifications.filter(n => !n.est_lue).length

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement des notifications...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="notifications-page">
            {/* Header */}
            <div className="bg-primary text-white py-4 mb-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <nav aria-label="breadcrumb" className="mb-2">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard" className="text-white">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active text-white-50">Notifications</li>
                                </ol>
                            </nav>
                            <h1 className="h3 mb-0">
                                <i className="bi bi-bell me-2"></i>
                                Mes notifications
                                {unreadCount > 0 && (
                                    <span className="badge bg-danger ms-2">{unreadCount}</span>
                                )}
                            </h1>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            {unreadCount > 0 && (
                                <button
                                    className="btn btn-light"
                                    onClick={handleMarkAllAsRead}
                                >
                                    <i className="bi bi-check-all me-2"></i>
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Filtres */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body py-3">
                        <div className="d-flex gap-2">
                            <button
                                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('all')}
                            >
                                Toutes ({notifications.length})
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('unread')}
                            >
                                Non lues ({unreadCount})
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'read' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('read')}
                            >
                                Lues ({notifications.length - unreadCount})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Liste des notifications */}
                {filteredNotifications.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="bi bi-bell-slash fs-1 text-muted mb-3 d-block"></i>
                            <h5 className="text-muted">Aucune notification</h5>
                            <p className="text-muted mb-0">
                                {filter === 'unread'
                                    ? "Vous avez lu toutes vos notifications !"
                                    : "Vous n'avez pas encore de notifications."
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <ul className="list-group list-group-flush">
                            {filteredNotifications.map(notification => (
                                <li
                                    key={notification.id}
                                    className={`list-group-item py-3 ${!notification.est_lue ? 'bg-light' : ''}`}
                                >
                                    <div className="d-flex align-items-start">
                                        <div className="me-3">
                                            <div
                                                className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center"
                                                style={{ width: '48px', height: '48px' }}
                                            >
                                                <i className={`bi ${getNotificationIcon(notification.type_notification)} fs-4`}></i>
                                            </div>
                                        </div>

                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className="mb-0">
                                                    {notification.titre}
                                                    {!notification.est_lue && (
                                                        <span className="badge bg-primary ms-2">Nouveau</span>
                                                    )}
                                                </h6>
                                                <small className="text-muted">
                                                    {notification.temps_ecoule}
                                                </small>
                                            </div>

                                            <p className="text-muted mb-2">
                                                {notification.contenu}
                                            </p>

                                            <div className="d-flex gap-2">
                                                {notification.lien_action && (
                                                    <Link
                                                        to={notification.lien_action}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i className="bi bi-arrow-right me-1"></i>
                                                        Voir
                                                    </Link>
                                                )}

                                                {!notification.est_lue && (
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                    >
                                                        <i className="bi bi-check me-1"></i>
                                                        Marquer lu
                                                    </button>
                                                )}

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(notification.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationsPage
