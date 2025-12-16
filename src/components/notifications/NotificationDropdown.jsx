// src/components/notifications/NotificationDropdown.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import notificationsService from '../../services/notificationsService'

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

const NotificationDropdown = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [showDropdown, setShowDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        if (isAuthenticated) {
            loadUnreadCount()
            // Rafraîchir le compteur toutes les 30 secondes
            const interval = setInterval(loadUnreadCount, 30000)
            return () => clearInterval(interval)
        }
    }, [isAuthenticated])

    // Fermer le dropdown en cliquant dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const loadUnreadCount = async () => {
        try {
            const data = await notificationsService.getUnreadCount()
            setUnreadCount(data.count)
        } catch (error) {
            console.error('Erreur chargement count:', error)
        }
    }

    const loadNotifications = async () => {
        try {
            setLoading(true)
            const data = await notificationsService.getNotifications()
            const allNotifications = data.results || data || []
            // Filtrer pour ne garder que les non lues
            const unreadNotifications = allNotifications.filter(n => !n.est_lue)
            setNotifications(unreadNotifications)
        } catch (error) {
            console.error('Erreur chargement notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleDropdown = () => {
        if (!showDropdown) {
            loadNotifications()
        }
        setShowDropdown(!showDropdown)
    }

    // Clic sur une notification : marquer comme lue et naviguer
    const handleNotificationClick = async (notification) => {
        try {
            // Marquer comme lue
            await notificationsService.markAsRead(notification.id)

            // Retirer du dropdown
            setNotifications(prev => prev.filter(n => n.id !== notification.id))
            setUnreadCount(prev => Math.max(0, prev - 1))

            // Fermer le dropdown
            setShowDropdown(false)

            // Rediriger vers le lien_action si disponible
            if (notification.lien_action) {
                navigate(notification.lien_action)
            } else {
                // Sinon, aller vers la page notifications
                navigate('/notifications')
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsService.markAllAsRead()
            setNotifications([])
            setUnreadCount(0)
        } catch (error) {
            console.error('Erreur marquer toutes lues:', error)
        }
    }

    if (!isAuthenticated) return null

    return (
        <div className="position-relative" ref={dropdownRef}>
            <button
                className="btn btn-link nav-link position-relative px-2"
                onClick={toggleDropdown}
                aria-expanded={showDropdown}
                style={{ color: 'rgba(255,255,255,0.85)' }}
            >
                <i className="bi bi-bell fs-5"></i>
                {unreadCount > 0 && (
                    <span
                        className="position-absolute badge rounded-pill bg-danger"
                        style={{
                            top: '0',
                            right: '0',
                            fontSize: '0.65rem',
                            transform: 'translate(25%, -25%)'
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div
                    className="position-absolute bg-white rounded shadow-lg"
                    style={{
                        top: '100%',
                        right: '0',
                        width: '360px',
                        maxHeight: '450px',
                        overflowY: 'auto',
                        zIndex: 1050,
                        marginTop: '0.5rem'
                    }}
                >
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-light">
                        <strong className="text-dark">
                            <i className="bi bi-bell me-2"></i>
                            Notifications
                        </strong>
                        {unreadCount > 0 && (
                            <button
                                className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
                                onClick={handleMarkAllAsRead}
                            >
                                Tout marquer lu
                            </button>
                        )}
                    </div>

                    {/* Contenu */}
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm text-primary"></div>
                            <p className="small text-muted mt-2 mb-0">Chargement...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-4">
                            <i className="bi bi-check-circle fs-1 text-success d-block mb-2"></i>
                            <p className="text-muted mb-0">Aucune notification non lue</p>
                            <Link
                                to="/notifications"
                                className="btn btn-sm btn-outline-primary mt-2"
                                onClick={() => setShowDropdown(false)}
                            >
                                Voir l'historique
                            </Link>
                        </div>
                    ) : (
                        <>
                            {notifications.slice(0, 5).map(notification => (
                                <div
                                    key={notification.id}
                                    className="px-3 py-2 border-bottom notification-item"
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onClick={() => handleNotificationClick(notification)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.1)'}
                                >
                                    <div className="d-flex">
                                        <div className="me-3 pt-1">
                                            <i className={`bi ${getNotificationIcon(notification.type_notification)} fs-5`}></i>
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <strong className="small text-dark">
                                                    {notification.titre}
                                                </strong>
                                                <span className="badge bg-primary ms-1" style={{ fontSize: '0.6rem' }}>
                                                    Nouveau
                                                </span>
                                            </div>
                                            <p className="text-muted small mb-1 text-truncate">
                                                {notification.contenu}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    <i className="bi bi-clock me-1"></i>
                                                    {notification.temps_ecoule}
                                                </small>
                                                {notification.lien_action && (
                                                    <small className="text-primary" style={{ fontSize: '0.7rem' }}>
                                                        <i className="bi bi-arrow-right"></i> Voir
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Footer - Voir tout */}
                            <div className="text-center py-2 border-top bg-light">
                                <Link
                                    to="/notifications"
                                    className="text-primary text-decoration-none small fw-medium"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <i className="bi bi-list me-1"></i>
                                    Voir toutes les notifications
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationDropdown
