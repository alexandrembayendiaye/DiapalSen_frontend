// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout as logoutAction } from '../store/authSlice'
import { useAuth } from '../contexts/AuthContext.jsx'
import authService from '../services/authService'
import { toast } from 'react-hot-toast'

const DashboardPage = () => {
    const { user, isPorteur, isContributeur, isAdmin, getFullName, getInitials, logout, getProfile } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        projets_crees: 0,
        projets_finances: 0,
        projets_en_cours: 0,
        contributions: 0,
        projets_soutenus: 0,
        montant_total_contribue: 0,
        notifications_non_lues: 0,
        // Stats admin
        projets_en_attente: 0,
        total_utilisateurs: 0,
        projets_actifs: 0,
        montant_total: 0
    })
    const [loadingStats, setLoadingStats] = useState(true)
    const [showBecomePorteurModal, setShowBecomePorteurModal] = useState(false)
    const [loadingProfileChange, setLoadingProfileChange] = useState(false)

    // Fonction pour gérer le changement de profil (contributeur -> porteur)
    const handleBecomePorteur = async () => {
        try {
            setLoadingProfileChange(true)
            await authService.changeProfileType()
            toast.success('Félicitations ! Vous êtes maintenant un porteur de projet 🎉')
            setShowBecomePorteurModal(false)
            await getProfile()
            navigate('/projets/creer')
        } catch (error) {
            console.error('Erreur changement de profil:', error)
            toast.error(error.error || 'Erreur lors du changement de profil')
        } finally {
            setLoadingProfileChange(false)
        }
    }

    const handleLogout = async () => {
        try {
            console.log('🔄 Début déconnexion complète...')
            await logout()
            console.log('✅ Déconnexion complète')
            window.location.href = '/'
        } catch (error) {
            console.warn('❌ Erreur API, mais on continue:', error)
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/'
        }
    }

    useEffect(() => {
        console.log('📊 DashboardPage: Utilisateur connecté:', user)
    }, [user])

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoadingStats(true)
                const data = await authService.getUserStats()
                setStats(prev => ({ ...prev, ...data }))
            } catch (error) {
                console.error('❌ Erreur chargement stats:', error)
            } finally {
                setLoadingStats(false)
            }
        }
        if (user) {
            loadStats()
        }
    }, [user])

    // Loading si pas encore d'utilisateur
    if (!user) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement de votre dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-page bg-light min-vh-100">
            <div className="container py-4">

                {/* Header du dashboard */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="bg-white rounded shadow-sm p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <div
                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                        style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                                    >
                                        {getInitials()}
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h1 className="h3 mb-1">
                                        Bienvenue, {getFullName()} !
                                    </h1>
                                    <p className="text-muted mb-0">
                                        {isPorteur() && 'Porteur de projet'}
                                        {isContributeur() && 'Contributeur'}
                                        {isAdmin() && 'Administrateur'}
                                        {' • Connecté sur DiapalSen'}
                                    </p>
                                </div>
                                <div>
                                    <span className={`badge ${isPorteur() ? 'bg-success' :
                                        isContributeur() ? 'bg-info' :
                                            isAdmin() ? 'bg-warning' : 'bg-secondary'
                                        } fs-6`}>
                                        {user.type_utilisateur}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Colonne gauche - Profil */}
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-primary text-white">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-person-circle me-2"></i>
                                    Mon profil
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <small className="text-muted">Email</small>
                                    <div className="fw-medium">{user.email}</div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">Région</small>
                                    <div className="fw-medium">
                                        {user.region ? user.region.charAt(0).toUpperCase() + user.region.slice(1) : 'Non renseignée'}
                                    </div>
                                </div>

                                {user.ville && (
                                    <div className="mb-3">
                                        <small className="text-muted">Ville</small>
                                        <div className="fw-medium">{user.ville}</div>
                                    </div>
                                )}

                                {user.telephone && (
                                    <div className="mb-3">
                                        <small className="text-muted">Téléphone</small>
                                        <div className="fw-medium">{user.telephone}</div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <small className="text-muted">Membre depuis</small>
                                    <div className="fw-medium">
                                        {new Date(user.date_joined).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>

                                <div className="d-grid">
                                    <Link to="/profil" className="btn btn-outline-primary">
                                        <i className="bi bi-pencil me-2"></i>
                                        Modifier mon profil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite - Actions et stats */}
                    <div className="col-lg-8">

                        {/* Actions rapides */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-lightning me-2"></i>
                                    Actions rapides
                                </h5>
                            </div>
                            <div className="card-body">

                                {/* Actions pour Porteur */}
                                {isPorteur() && !isAdmin() && (
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <Link to="/projets/creer" className="btn btn-success w-100 p-3">
                                                <i className="bi bi-plus-circle me-2"></i>
                                                <div>
                                                    <strong>Créer un projet</strong>
                                                    <br />
                                                    <small>Lancer une nouvelle campagne</small>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-md-6">
                                            <Link to="/mes-projets" className="btn btn-outline-primary w-100 p-3">
                                                <i className="bi bi-folder me-2"></i>
                                                <div>
                                                    <strong>Mes projets</strong>
                                                    <br />
                                                    <small>Gérer mes campagnes</small>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-md-6">
                                            <Link to="/mes-projets" className="btn btn-outline-info w-100 p-3">
                                                <i className="bi bi-graph-up me-2"></i>
                                                <div>
                                                    <strong>Statistiques</strong>
                                                    <br />
                                                    <small>Analyser mes performances</small>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-md-6">
                                            <Link to="/contributeurs" className="btn btn-outline-secondary w-100 p-3">
                                                <i className="bi bi-people me-2"></i>
                                                <div>
                                                    <strong>Mes contributeurs</strong>
                                                    <br />
                                                    <small>Communauté de soutien</small>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Actions pour Contributeur */}
                                {isContributeur() && !isAdmin() && (
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <Link to="/projets" className="btn btn-primary w-100 p-3">
                                                <i className="bi bi-search me-2"></i>
                                                <div>
                                                    <strong>Découvrir des projets</strong>
                                                    <br />
                                                    <small>Explorer les innovations</small>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-md-6">
                                            <Link to="/mes-favoris" className="btn btn-outline-warning w-100 p-3">
                                                <i className="bi bi-heart me-2"></i>
                                                <div>
                                                    <strong>Mes favoris</strong>
                                                    <br />
                                                    <small>Projets sauvegardés</small>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-md-6">
                                            <Link to="/mes-contributions" className="btn btn-outline-success w-100 p-3">
                                                <i className="bi bi-wallet2 me-2"></i>
                                                <div>
                                                    <strong>Mes contributions</strong>
                                                    <br />
                                                    <small>Historique des soutiens</small>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="col-md-6">
                                            <Link to="/notifications" className="btn btn-outline-info w-100 p-3">
                                                <i className="bi bi-bell me-2"></i>
                                                <div>
                                                    <strong>Notifications</strong>
                                                    <br />
                                                    <small>Actualités des projets</small>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Actions pour Admin avec Stats */}
                                {isAdmin() && (
                                    <>
                                        {/* Statistiques Admin en temps réel */}
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-3 col-6">
                                                <div className="card bg-warning bg-opacity-10 border-warning h-100">
                                                    <div className="card-body text-center py-3">
                                                        <i className="bi bi-clock-history text-warning fs-2"></i>
                                                        <h3 className="mt-2 mb-0 text-warning">
                                                            {loadingStats ? '...' : (stats.projets_en_attente || 0)}
                                                        </h3>
                                                        <small className="text-muted">En attente</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6">
                                                <div className="card bg-primary bg-opacity-10 border-primary h-100">
                                                    <div className="card-body text-center py-3">
                                                        <i className="bi bi-people text-primary fs-2"></i>
                                                        <h3 className="mt-2 mb-0 text-primary">
                                                            {loadingStats ? '...' : (stats.total_utilisateurs || 0)}
                                                        </h3>
                                                        <small className="text-muted">Utilisateurs</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6">
                                                <div className="card bg-success bg-opacity-10 border-success h-100">
                                                    <div className="card-body text-center py-3">
                                                        <i className="bi bi-folder-check text-success fs-2"></i>
                                                        <h3 className="mt-2 mb-0 text-success">
                                                            {loadingStats ? '...' : (stats.projets_actifs || 0)}
                                                        </h3>
                                                        <small className="text-muted">Projets actifs</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6">
                                                <div className="card bg-info bg-opacity-10 border-info h-100">
                                                    <div className="card-body text-center py-3">
                                                        <i className="bi bi-cash-stack text-info fs-2"></i>
                                                        <h3 className="mt-2 mb-0 text-info">
                                                            {loadingStats ? '...' : `${((stats.montant_total || 0) / 1000).toFixed(0)}K`}
                                                        </h3>
                                                        <small className="text-muted">FCFA collectés</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions rapides Admin */}
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <Link to="/admin/projets/en-attente" className="btn btn-outline-danger w-100 p-3">
                                                    <i className="bi bi-clock me-2"></i>
                                                    <div>
                                                        <strong>Validation projets</strong>
                                                        <br />
                                                        <small>Projets en attente</small>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="col-md-4">
                                                <Link to="/admin/utilisateurs" className="btn btn-outline-primary w-100 p-3">
                                                    <i className="bi bi-people me-2"></i>
                                                    <div>
                                                        <strong>Gestion utilisateurs</strong>
                                                        <br />
                                                        <small>Modération comptes</small>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="col-md-4">
                                                <Link to="/admin/validations" className="btn btn-outline-info w-100 p-3">
                                                    <i className="bi bi-file-text me-2"></i>
                                                    <div>
                                                        <strong>Historique</strong>
                                                        <br />
                                                        <small>Validations récentes</small>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Statistiques de base - cachées pour admin */}
                        {!isAdmin() && (
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-light">
                                    <h5 className="card-title mb-0">
                                        <i className="bi bi-bar-chart me-2"></i>
                                        Mon activité
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-md-3 col-6 mb-3">
                                            <div className="p-3">
                                                <h4 className="text-primary mb-1">
                                                    {loadingStats ? '...' : (isPorteur() ? stats.projets_crees : stats.contributions)}
                                                </h4>
                                                <small className="text-muted">
                                                    {isPorteur() ? 'Projets créés' : 'Contributions'}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-3">
                                            <div className="p-3">
                                                <h4 className="text-success mb-1">
                                                    {loadingStats ? '...' : (isPorteur() ? stats.projets_finances : stats.projets_soutenus)}
                                                </h4>
                                                <small className="text-muted">
                                                    {isPorteur() ? 'Projets financés' : 'Projets soutenus'}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-3">
                                            <div className="p-3">
                                                <h4 className="text-warning mb-1">
                                                    {loadingStats ? '...' : stats.projets_en_cours}
                                                </h4>
                                                <small className="text-muted">En cours</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 mb-3">
                                            <div className="p-3">
                                                <h4 className="text-info mb-1">
                                                    {loadingStats ? '...' : stats.notifications_non_lues}
                                                </h4>
                                                <small className="text-muted">Notifications</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message et déconnexion */}
                        <div className="card shadow-sm border-0 mt-4">
                            <div className="card-body text-center py-4">
                                <p className="text-muted mb-3">
                                    {isPorteur() && 'Votre aventure entrepreneuriale commence ici !'}
                                    {isContributeur() && 'Découvrez des projets inspirants à soutenir.'}
                                    {isAdmin() && 'Gérez la plateforme et aidez les entrepreneurs.'}
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline-secondary"
                                    type="button"
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal de confirmation pour devenir porteur */}

        </div>
    )
}

export default DashboardPage