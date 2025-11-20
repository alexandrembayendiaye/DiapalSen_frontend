// src/pages/projects/MesProjetsPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import projectsService from '../../services/projectsService'

const MesProjetsPage = () => {
    const { user, isPorteur } = useAuth()
    const [projets, setProjets] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        brouillon: 0,
        en_attente: 0,
        actif: 0,
        termine: 0,
        rejete: 0
    })
    const [filtres, setFiltres] = useState({
        statut: '',
        search: ''
    })

    // Charger les vrais projets depuis l'API Django
    useEffect(() => {
        if (!isPorteur()) {
            toast.error('Accès réservé aux porteurs de projet')
            return
        }

        loadMesProjets()
    }, [isPorteur])

    const loadMesProjets = async () => {
        try {
            setLoading(true)
            const response = await projectsService.getMesProjets()

            // Django retourne {count, results} - extraire results
            const data = response.results || []

            console.log('✅ Projets récupérés:', data.length, 'projets')

            // Adapter les données
            const adaptedProjets = data.map(projet => ({
                ...projet,
                montant_objectif: parseInt(projet.montant_objectif),
                montant_collecte: parseInt(projet.montant_collecte) || 0,
                pourcentage_atteint: projet.pourcentage_atteint || 0,
                nombre_contributeurs: projet.nombre_contributeurs || 0,
                jours_restants: projet.jours_restants || 0
            }))

            setProjets(adaptedProjets)

            // Calculer les stats
            const stats = adaptedProjets.reduce((acc, projet) => {
                acc.total++
                acc[projet.statut] = (acc[projet.statut] || 0) + 1
                return acc
            }, {
                total: 0,
                brouillon: 0,
                en_attente: 0,
                actif: 0,
                termine: 0,
                rejete: 0
            })

            setStats(stats)
        } catch (error) {
            console.error('❌ Erreur chargement mes projets:', error)
            toast.error('Erreur lors du chargement de vos projets')
            setProjets([])
            setStats({
                total: 0,
                brouillon: 0,
                en_attente: 0,
                actif: 0,
                termine: 0,
                rejete: 0
            })
        } finally {
            setLoading(false)
        }
    }

    // Fonction de filtrage
    const projetsFiltres = projets.filter(projet => {
        return (
            (filtres.statut === '' || projet.statut === filtres.statut) &&
            (filtres.search === '' ||
                projet.titre.toLowerCase().includes(filtres.search.toLowerCase()) ||
                projet.description_courte.toLowerCase().includes(filtres.search.toLowerCase()))
        )
    })

    const getStatutBadge = (statut) => {
        const classes = {
            brouillon: 'bg-secondary',
            en_attente: 'bg-warning text-dark',
            actif: 'bg-success',
            termine: 'bg-info text-dark',
            rejete: 'bg-danger'
        }

        const labels = {
            brouillon: 'Brouillon',
            en_attente: 'En attente',
            actif: 'Actif',
            termine: 'Terminé',
            rejete: 'Rejeté'
        }

        return (
            <span className={`badge ${classes[statut] || 'bg-secondary'} fs-6`}>
                {labels[statut] || statut}
            </span>
        )
    }

    // Soumettre un projet pour validation
    const handleSubmitProject = async (projectId) => {
        if (!confirm('Êtes-vous sûr de vouloir soumettre ce projet pour validation ? Vous ne pourrez plus le modifier.')) {
            return
        }

        try {
            await projectsService.submitProject(projectId)
            toast.success('Projet soumis pour validation !')
            loadMesProjets() // Recharger la liste
        } catch (error) {
            console.error('❌ Erreur soumission projet:', error)
            toast.error('Erreur lors de la soumission')
        }
    }

    const getStatutActions = (projet) => {
        const baseButtonClass = "btn btn-sm"

        switch (projet.statut) {
            case 'brouillon':
                return (
                    <div className="d-flex gap-1">
                        <Link
                            to={`/projets/${projet.id}/modifier`}
                            className={`${baseButtonClass} btn-outline-primary`}
                            title="Modifier le projet"
                        >
                            <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                            className={`${baseButtonClass} btn-primary`}
                            onClick={() => handleSubmitProject(projet.id)}
                            title="Soumettre pour validation"
                        >
                            <i className="bi bi-send"></i>
                        </button>
                        <Link
                            to={`/mes-projets/${projet.id}/stats`}
                            className={`${baseButtonClass} btn-info`}
                            title="Aperçu des statistiques"
                        >
                            <i className="bi bi-graph-up"></i>
                        </Link>

                    </div>
                )
            case 'en_attente':
                return (
                    <div className="d-flex gap-1">
                        <button
                            className={`${baseButtonClass} btn-outline-secondary`}
                            disabled
                            title="En attente de validation"
                        >
                            <i className="bi bi-clock"></i>
                        </button>
                        <Link
                            to={`/mes-projets/${projet.id}/stats`}
                            className={`${baseButtonClass} btn-info`}
                            title="Voir les statistiques"
                        >
                            <i className="bi bi-graph-up"></i>
                        </Link>
                    </div>
                )
            case 'actif':
                return (
                    <div className="d-flex gap-1">
                        <Link
                            to={`/projets/${projet.id}`}
                            className={`${baseButtonClass} btn-outline-primary`}
                            title="Voir le projet public"
                        >
                            <i className="bi bi-eye"></i>
                        </Link>
                        <Link
                            to={`/mes-projets/${projet.id}/actualites`}
                            className="btn btn-sm btn-outline-success"
                            title="Gérer les actualités"
                        >
                            <i className="bi bi-megaphone"></i>
                        </Link>
                        <Link
                            to={`/mes-projets/${projet.id}/stats`}
                            className={`${baseButtonClass} btn-info`}
                            title="Tableau de bord détaillé"
                        >
                            <i className="bi bi-graph-up"></i>
                        </Link>
                        <Link
                            to={`/mes-projets/${projet.id}/contributeurs`}
                            className="btn btn-sm btn-outline-info"
                            title="Gérer les contributeurs"
                        >
                            <i className="bi bi-people"></i>
                        </Link>
                    </div>
                )
            case 'termine':
                return (
                    <div className="d-flex gap-1">
                        <Link
                            to={`/projets/${projet.id}`}
                            className={`${baseButtonClass} btn-outline-primary`}
                            title="Voir le projet"
                        >
                            <i className="bi bi-eye"></i>
                        </Link>
                        <Link
                            to={`/mes-projets/${projet.id}/stats`}
                            className={`${baseButtonClass} btn-success`}
                            title="Bilan final de la campagne"
                        >
                            <i className="bi bi-clipboard-data"></i>
                        </Link>
                        <Link
                            to={`/mes-projets/${projet.id}/contributeurs`}
                            className="btn btn-sm btn-outline-info"
                            title="Gérer les contributeurs"
                        >
                            <i className="bi bi-people"></i>
                        </Link>
                    </div>

                )
            case 'rejete':
                return (
                    <div className="d-flex gap-1">
                        <Link
                            to={`/projets/${projet.id}`}
                            className={`${baseButtonClass} btn-outline-primary`}
                            title="Voir le projet"
                        >
                            <i className="bi bi-eye"></i>
                        </Link>
                        <Link
                            to={`/mes-projets/${projet.id}/stats`}
                            className={`${baseButtonClass} btn-warning`}
                            title="Analyser pour améliorer"
                        >
                            <i className="bi bi-bar-chart"></i>
                        </Link>
                    </div>
                )
            default:
                return (
                    <div className="d-flex gap-1">
                        <Link
                            to={`/projets/${projet.id}`}
                            className={`${baseButtonClass} btn-outline-primary`}
                            title="Voir le projet"
                        >
                            <i className="bi bi-eye"></i>
                        </Link>
                    </div>
                )
        }
    }

    const resetFiltres = () => {
        setFiltres({ statut: '', search: '' })
    }

    if (!isPorteur()) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <h2>Accès refusé</h2>
                    <p>Cette page est réservée aux porteurs de projet.</p>
                    <Link to="/dashboard" className="btn btn-primary">
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement de vos projets...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mes-projets-page bg-light min-vh-100">
            <div className="container py-4">

                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="h2 mb-1">
                                    <i className="bi bi-folder-check me-2 text-primary"></i>
                                    Mes projets
                                </h1>
                                <p className="text-muted mb-0">
                                    Gérez vos campagnes de financement participatif
                                </p>
                            </div>
                            <div>
                                <Link to="/projets/creer" className="btn btn-success shadow-sm">
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Nouveau projet
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <div className="card border-0 shadow-sm text-center h-100 hover-shadow">
                            <div className="card-body py-3">
                                <h3 className="h4 text-primary mb-1">{stats.total}</h3>
                                <small className="text-muted fw-medium">Total</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <div className="card border-0 shadow-sm text-center h-100 hover-shadow">
                            <div className="card-body py-3">
                                <h3 className="h4 text-secondary mb-1">{stats.brouillon}</h3>
                                <small className="text-muted fw-medium">Brouillons</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <div className="card border-0 shadow-sm text-center h-100 hover-shadow">
                            <div className="card-body py-3">
                                <h3 className="h4 text-warning mb-1">{stats.en_attente}</h3>
                                <small className="text-muted fw-medium">En attente</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <div className="card border-0 shadow-sm text-center h-100 hover-shadow">
                            <div className="card-body py-3">
                                <h3 className="h4 text-success mb-1">{stats.actif}</h3>
                                <small className="text-muted fw-medium">Actifs</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <div className="card border-0 shadow-sm text-center h-100 hover-shadow">
                            <div className="card-body py-3">
                                <h3 className="h4 text-info mb-1">{stats.termine}</h3>
                                <small className="text-muted fw-medium">Terminés</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <div className="card border-0 shadow-sm text-center h-100 hover-shadow">
                            <div className="card-body py-3">
                                <h3 className="h4 text-danger mb-1">{stats.rejete}</h3>
                                <small className="text-muted fw-medium">Rejetés</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body py-3">
                        <div className="row align-items-center">
                            <div className="col-md-6 mb-2 mb-md-0">
                                <div className="input-group">
                                    <span className="input-group-text border-end-0 bg-white">
                                        <i className="bi bi-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="Rechercher dans mes projets..."
                                        value={filtres.search}
                                        onChange={(e) => setFiltres({ ...filtres, search: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mb-2 mb-md-0">
                                <select
                                    className="form-select"
                                    value={filtres.statut}
                                    onChange={(e) => setFiltres({ ...filtres, statut: e.target.value })}
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="brouillon">📝 Brouillons</option>
                                    <option value="en_attente">⏳ En attente</option>
                                    <option value="actif">✅ Actifs</option>
                                    <option value="termine">🎯 Terminés</option>
                                    <option value="rejete">❌ Rejetés</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={resetFiltres}
                                    title="Réinitialiser les filtres"
                                >
                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                    <span className="d-none d-lg-inline">Reset</span>
                                </button>
                            </div>
                        </div>
                        {(filtres.search || filtres.statut) && (
                            <div className="mt-2">
                                <small className="text-muted">
                                    <i className="bi bi-funnel me-1"></i>
                                    {projetsFiltres.length} projet{projetsFiltres.length > 1 ? 's' : ''} trouvé{projetsFiltres.length > 1 ? 's' : ''}
                                    {filtres.search && ` pour "${filtres.search}"`}
                                    {filtres.statut && ` avec le statut "${filtres.statut}"`}
                                </small>
                            </div>
                        )}
                    </div>
                </div>

                {/* Liste des projets */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-bottom">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">
                                        <i className="bi bi-folder me-2 text-primary"></i>
                                        Mes projets ({projetsFiltres.length})
                                    </h5>
                                    {projets.length > projetsFiltres.length && (
                                        <small className="text-muted">
                                            {projetsFiltres.length} sur {projets.length} affichés
                                        </small>
                                    )}
                                </div>
                            </div>
                            <div className="card-body p-0">
                                {projetsFiltres.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="border-0 ps-3">Projet</th>
                                                    <th className="border-0">Statut</th>
                                                    <th className="border-0">Objectif</th>
                                                    <th className="border-0">Collecté</th>
                                                    <th className="border-0">Progression</th>
                                                    <th className="border-0">Date création</th>
                                                    <th className="border-0 pe-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projetsFiltres.map(projet => (
                                                    <tr key={projet.id} className="align-middle">
                                                        <td className="ps-3">
                                                            <div>
                                                                <strong className="d-block text-dark">
                                                                    {projet.titre}
                                                                </strong>
                                                                <small className="text-muted">
                                                                    {projet.description_courte.length > 60
                                                                        ? projet.description_courte.substring(0, 60) + '...'
                                                                        : projet.description_courte
                                                                    }
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {getStatutBadge(projet.statut)}
                                                        </td>
                                                        <td>
                                                            <strong className="text-primary">
                                                                {(projet.montant_objectif / 1000000).toFixed(1)}M FCFA
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <span className="text-success fw-medium">
                                                                {(projet.montant_collecte / 1000000).toFixed(2)}M FCFA
                                                            </span>
                                                            {projet.nombre_contributeurs > 0 && (
                                                                <div>
                                                                    <small className="text-muted">
                                                                        <i className="bi bi-people me-1"></i>
                                                                        {projet.nombre_contributeurs} contributeur{projet.nombre_contributeurs > 1 ? 's' : ''}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="progress mb-1" style={{ height: '8px', width: '80px' }}>
                                                                <div
                                                                    className="progress-bar bg-success"
                                                                    style={{ width: `${Math.min(projet.pourcentage_atteint, 100)}%` }}
                                                                />
                                                            </div>
                                                            <small className={`fw-medium ${projet.pourcentage_atteint >= 100 ? 'text-success' : 'text-muted'}`}>
                                                                {projet.pourcentage_atteint.toFixed(1)}%
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">
                                                                <i className="bi bi-calendar3 me-1"></i>
                                                                {new Date(projet.date_creation).toLocaleDateString('fr-FR')}
                                                            </small>
                                                            {projet.jours_restants > 0 && (
                                                                <div>
                                                                    <small className="text-warning fw-medium">
                                                                        <i className="bi bi-clock me-1"></i>
                                                                        {projet.jours_restants} jour{projet.jours_restants > 1 ? 's' : ''}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="pe-3">
                                                            {getStatutActions(projet)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : projets.length > 0 ? (
                                    <div className="text-center py-5">
                                        <i className="bi bi-search display-1 text-muted mb-3"></i>
                                        <h5 className="text-muted">Aucun projet ne correspond aux filtres</h5>
                                        <p className="text-muted mb-4">
                                            Essayez de modifier vos critères de recherche
                                        </p>
                                        <button onClick={resetFiltres} className="btn btn-outline-primary">
                                            <i className="bi bi-arrow-clockwise me-2"></i>
                                            Réinitialiser les filtres
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="bi bi-folder-x display-1 text-muted mb-3"></i>
                                        <h5>Aucun projet pour le moment</h5>
                                        <p className="text-muted mb-4">
                                            Créez votre premier projet pour commencer votre aventure entrepreneuriale !
                                        </p>
                                        <Link to="/projets/creer" className="btn btn-success shadow-sm">
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Créer mon premier projet
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-shadow:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    transform: translateY(-2px);
                    transition: all 0.3s ease;
                }
                .table tbody tr:hover {
                    background-color: rgba(0, 123, 255, 0.05);
                }
            `}</style>
        </div>
    )
}

export default MesProjetsPage