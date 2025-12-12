// src/pages/porteur/MesContributeursPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import contributionsService from '../../services/contributionsService'
import toast from 'react-hot-toast'

const MesContributeursPage = () => {
    const { isPorteur } = useAuth()
    const [loading, setLoading] = useState(true)
    const [contributeurs, setContributeurs] = useState([])
    const [stats, setStats] = useState({
        total_contributeurs: 0,
        total_contributions: 0,
        montant_total: 0,
        montant_moyen: 0
    })
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('montant')

    useEffect(() => {
        if (!isPorteur()) {
            toast.error('Accès réservé aux porteurs de projet')
            return
        }
        loadContributeurs()
    }, [])

    const loadContributeurs = async () => {
        try {
            setLoading(true)
            const data = await contributionsService.getMesContributeurs()
            setContributeurs(data.contributeurs || [])
            setStats(data.stats || {})
        } catch (error) {
            console.error('Erreur chargement contributeurs:', error)
            toast.error('Erreur lors du chargement des contributeurs')
        } finally {
            setLoading(false)
        }
    }

    // Filtrer et trier
    const contributeursFiltres = contributeurs
        .filter(c =>
            c.nom_complet.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'montant') return b.total_contribution - a.total_contribution
            if (sortBy === 'contributions') return b.nombre_contributions - a.nombre_contributions
            if (sortBy === 'nom') return a.nom_complet.localeCompare(b.nom_complet)
            return 0
        })

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR').format(Math.round(montant)) + ' FCFA'
    }

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement de vos contributeurs...</p>
            </div>
        )
    }

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">
                        <i className="bi bi-people-fill text-primary me-2"></i>
                        Mes Contributeurs
                    </h1>
                    <p className="text-muted mb-0">
                        Tous les contributeurs qui soutiennent vos projets
                    </p>
                </div>
                <Link to="/dashboard" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour au tableau de bord
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-people fs-1 mb-2 d-block"></i>
                            <h2 className="mb-0">{stats.total_contributeurs}</h2>
                            <small>Contributeurs uniques</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-cash-stack fs-1 mb-2 d-block"></i>
                            <h2 className="mb-0">{formatMontant(stats.montant_total)}</h2>
                            <small>Total collecté</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-info text-white h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-graph-up fs-1 mb-2 d-block"></i>
                            <h2 className="mb-0">{stats.total_contributions}</h2>
                            <small>Contributions totales</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-dark h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-calculator fs-1 mb-2 d-block"></i>
                            <h2 className="mb-0">{formatMontant(stats.montant_moyen)}</h2>
                            <small>Contribution moyenne</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Rechercher un contributeur..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="montant">Trier par montant</option>
                                <option value="contributions">Trier par nombre</option>
                                <option value="nom">Trier par nom</option>
                            </select>
                        </div>
                        <div className="col-md-3 text-end">
                            <span className="badge bg-secondary fs-6">
                                {contributeursFiltres.length} contributeur{contributeursFiltres.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des contributeurs */}
            {contributeursFiltres.length > 0 ? (
                <div className="row g-4">
                    {contributeursFiltres.map((contributeur, index) => (
                        <div key={contributeur.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div
                                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                                            style={{ width: '50px', height: '50px' }}
                                        >
                                            <span className="text-white fw-bold fs-5">
                                                {contributeur.nom_complet?.charAt(0) || 'A'}
                                            </span>
                                        </div>
                                        <div>
                                            <h5 className="mb-0">{contributeur.nom_complet}</h5>
                                            <small className="text-muted">{contributeur.email}</small>
                                        </div>
                                        {index < 3 && (
                                            <span className={`badge ms-auto ${index === 0 ? 'bg-warning text-dark' :
                                                    index === 1 ? 'bg-secondary' :
                                                        'bg-danger'
                                                }`}>
                                                <i className="bi bi-trophy-fill me-1"></i>
                                                Top {index + 1}
                                            </span>
                                        )}
                                    </div>

                                    <div className="row text-center mb-3">
                                        <div className="col-6">
                                            <div className="bg-light rounded p-2">
                                                <strong className="text-success d-block">
                                                    {formatMontant(contributeur.total_contribution)}
                                                </strong>
                                                <small className="text-muted">Total contribué</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="bg-light rounded p-2">
                                                <strong className="text-primary d-block">
                                                    {contributeur.nombre_contributions}
                                                </strong>
                                                <small className="text-muted">Contribution{contributeur.nombre_contributions > 1 ? 's' : ''}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted d-block mb-1">Projets soutenus :</small>
                                        <div className="d-flex flex-wrap gap-1">
                                            {contributeur.projets_soutenus.map((projet, i) => (
                                                <span key={i} className="badge bg-light text-dark border">
                                                    {projet.length > 20 ? projet.substring(0, 20) + '...' : projet}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Dernière contribution */}
                                    {contributeur.contributions[0] && (
                                        <div className="border-top pt-2">
                                            <small className="text-muted">
                                                Dernière contribution : {' '}
                                                <strong>{formatMontant(contributeur.contributions[0].montant)}</strong>
                                                {' - '}
                                                {new Date(contributeur.contributions[0].date_contribution).toLocaleDateString('fr-FR')}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="bi bi-people fs-1 text-muted d-block mb-3"></i>
                    <h4 className="text-muted">Aucun contributeur pour le moment</h4>
                    <p className="text-muted">
                        {search ? 'Aucun résultat pour votre recherche' : 'Partagez vos projets pour attirer des contributeurs !'}
                    </p>
                    <Link to="/mes-projets" className="btn btn-primary">
                        <i className="bi bi-folder me-2"></i>
                        Voir mes projets
                    </Link>
                </div>
            )}
        </div>
    )
}

export default MesContributeursPage
