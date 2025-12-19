// src/pages/contributions/MesContributionsPage.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import contributionsService from '../../services/contributionsService'
import toast from 'react-hot-toast'

const MesContributionsPage = () => {
    const { user, isAuthenticated } = useAuth()
    const [stats, setStats] = useState(null)
    const [contributions, setContributions] = useState([])
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(true)

    // État pour le modal de détail
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedContribution, setSelectedContribution] = useState(null)

    // Fonction pour ouvrir le modal de détail
    const ouvrirDetailModal = (contribution) => {
        setSelectedContribution(contribution)
        setShowDetailModal(true)
    }

    // États pour les filtres
    const [filtres, setFiltres] = useState({
        statut: 'tous',
        periode: 'toutes',
        montant: 'tous',
        recherche: ''
    })

    // Contributions filtrées
    const [contributionsFiltrees, setContributionsFiltrees] = useState([])

    // Charger les statistiques au montage du composant
    useEffect(() => {
        if (isAuthenticated) {
            chargerStats()
            chargerContributions()
        }
    }, [isAuthenticated])

    // Appliquer les filtres quand les contributions ou filtres changent
    useEffect(() => {
        appliquerFiltres()
    }, [contributions, filtres])

    // Fonction pour appliquer les filtres
    const appliquerFiltres = () => {
        let resultats = [...contributions]

        // Filtre par statut
        if (filtres.statut !== 'tous') {
            const statusMap = {
                'valides': 'Validé',
                'en_attente': 'En attente',
                'echec': 'Échec',
                'rembourses': 'Remboursé'
            }
            resultats = resultats.filter(c =>
                c.statut_paiement_display === statusMap[filtres.statut]
            )
        }

        // Filtre par période
        if (filtres.periode !== 'toutes') {
            const maintenant = new Date()
            let dateDebut = new Date()

            switch (filtres.periode) {
                case 'dernier_mois':
                    dateDebut.setMonth(maintenant.getMonth() - 1)
                    break
                case '3_mois':
                    dateDebut.setMonth(maintenant.getMonth() - 3)
                    break
                case '6_mois':
                    dateDebut.setMonth(maintenant.getMonth() - 6)
                    break
                case 'cette_annee':
                    dateDebut = new Date(maintenant.getFullYear(), 0, 1)
                    break
            }

            resultats = resultats.filter(c =>
                new Date(c.date_contribution) >= dateDebut
            )
        }

        // Filtre par montant
        if (filtres.montant !== 'tous') {
            switch (filtres.montant) {
                case 'petit':
                    resultats = resultats.filter(c => parseInt(c.montant) < 10000)
                    break
                case 'moyen':
                    resultats = resultats.filter(c =>
                        parseInt(c.montant) >= 10000 && parseInt(c.montant) <= 50000
                    )
                    break
                case 'grand':
                    resultats = resultats.filter(c => parseInt(c.montant) > 50000)
                    break
            }
        }

        // Filtre par recherche (nom du projet)
        if (filtres.recherche.trim()) {
            const terme = filtres.recherche.toLowerCase().trim()
            resultats = resultats.filter(c =>
                c.projet.titre.toLowerCase().includes(terme)
            )
        }

        setContributionsFiltrees(resultats)
    }

    // Fonction pour changer un filtre
    const changerFiltre = (type, valeur) => {
        setFiltres(prev => ({
            ...prev,
            [type]: valeur
        }))
    }

    // Fonction pour réinitialiser tous les filtres
    const reinitialiserFiltres = () => {
        setFiltres({
            statut: 'tous',
            periode: 'toutes',
            montant: 'tous',
            recherche: ''
        })
    }

    const chargerStats = async () => {
        try {
            setStatsLoading(true)
            console.log('🔄 Chargement stats contributions...')

            const statsData = await contributionsService.getStatsContributions()
            setStats(statsData)

            console.log('✅ Stats contributions chargées:', statsData)
        } catch (error) {
            console.error('❌ Erreur chargement stats:', error)
            toast.error('Erreur lors du chargement des statistiques')
        } finally {
            setStatsLoading(false)
        }
    }

    const chargerContributions = async () => {
        try {
            setLoading(true)
            console.log('🔄 Chargement contributions...')

            const contributionsData = await contributionsService.getMesContributions()
            setContributions(contributionsData.results || contributionsData)

            console.log('✅ Contributions chargées:', contributionsData)
        } catch (error) {
            console.error('❌ Erreur chargement contributions:', error)
            toast.error('Erreur lors du chargement des contributions')
        } finally {
            setLoading(false)
        }
    }

    // Formatage des montants
    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR').format(montant)
    }

    // Formatage des dates
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (!isAuthenticated) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <h3>Accès refusé</h3>
                    <p>Vous devez être connecté pour accéder à cette page.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mes-contributions-page bg-light min-vh-100">
            <div className="container py-4">

                {/* Header de la page */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h1 className="h3 mb-1">
                                    <i className="bi bi-wallet2 text-success me-2"></i>
                                    Mes contributions
                                </h1>
                                <p className="text-muted mb-0">
                                    Suivez l'impact de vos soutiens aux projets innovants
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => window.location.href = '/projets'}
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Découvrir des projets
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard des statistiques */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-success text-white">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-bar-chart me-2"></i>
                                    Tableau de bord de vos contributions
                                </h5>
                            </div>
                            <div className="card-body">
                                {statsLoading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-success" role="status">
                                            <span className="visually-hidden">Chargement...</span>
                                        </div>
                                        <p className="mt-3 text-muted">Chargement de vos statistiques...</p>
                                    </div>
                                ) : stats ? (
                                    <div className="row">
                                        {/* Total contributions */}
                                        <div className="col-md-3 col-6 mb-3">
                                            <div className="text-center p-3 bg-light rounded">
                                                <div className="display-6 text-primary mb-2">
                                                    {stats.nombre_contributions}
                                                </div>
                                                <h6 className="text-muted mb-0">
                                                    Contribution{stats.nombre_contributions > 1 ? 's' : ''}
                                                </h6>
                                                <small className="text-muted">validée{stats.nombre_contributions > 1 ? 's' : ''}</small>
                                            </div>
                                        </div>

                                        {/* Montant total contribué */}
                                        <div className="col-md-3 col-6 mb-3">
                                            <div className="text-center p-3 bg-light rounded">
                                                <div className="display-6 text-success mb-2">
                                                    {formatMontant(stats.montant_total_contribue)}
                                                </div>
                                                <h6 className="text-muted mb-0">FCFA</h6>
                                                <small className="text-muted">contribués</small>
                                            </div>
                                        </div>

                                        {/* Projets soutenus */}
                                        <div className="col-md-3 col-6 mb-3">
                                            <div className="text-center p-3 bg-light rounded">
                                                <div className="display-6 text-info mb-2">
                                                    {stats.nombre_projets_soutenus}
                                                </div>
                                                <h6 className="text-muted mb-0">
                                                    Projet{stats.nombre_projets_soutenus > 1 ? 's' : ''}
                                                </h6>
                                                <small className="text-muted">soutenu{stats.nombre_projets_soutenus > 1 ? 's' : ''}</small>
                                            </div>
                                        </div>

                                        {/* Dernière contribution */}
                                        <div className="col-md-3 col-6 mb-3">
                                            <div className="text-center p-3 bg-light rounded">
                                                {stats.derniere_contribution ? (
                                                    <>
                                                        <div className="display-6 text-warning mb-2">
                                                            {formatMontant(stats.derniere_contribution.montant)}
                                                        </div>
                                                        <h6 className="text-muted mb-0">FCFA</h6>
                                                        <small className="text-muted">
                                                            {formatDate(stats.derniere_contribution.date)}
                                                        </small>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="display-6 text-muted mb-2">
                                                            <i className="bi bi-dash"></i>
                                                        </div>
                                                        <h6 className="text-muted mb-0">Aucune</h6>
                                                        <small className="text-muted">contribution</small>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="bi bi-exclamation-triangle text-warning display-4"></i>
                                        <h5 className="mt-3">Impossible de charger les statistiques</h5>
                                        <button
                                            onClick={chargerStats}
                                            className="btn btn-outline-primary mt-2"
                                        >
                                            <i className="bi bi-arrow-clockwise me-2"></i>
                                            Réessayer
                                        </button>
                                    </div>
                                )}

                                {/* Message d'encouragement si pas de contributions */}
                                {stats && stats.nombre_contributions === 0 && (
                                    <div className="text-center py-4 mt-4 border-top">
                                        <i className="bi bi-heart text-muted display-4"></i>
                                        <h5 className="mt-3 text-muted">Vous n'avez pas encore contribué</h5>
                                        <p className="text-muted">
                                            Découvrez des projets innovants et soutenez l'entrepreneuriat sénégalais !
                                        </p>
                                        <a href="/projets" className="btn btn-success">
                                            <i className="bi bi-search me-2"></i>
                                            Explorer les projets
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section liste des contributions (à développer) */}
                {stats && stats.nombre_contributions > 0 && (
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">
                                        <i className="bi bi-list me-2"></i>
                                        Historique de mes contributions
                                    </h5>
                                    <small className="text-muted">
                                        {contributionsFiltrees.length} sur {contributions.length} contribution{contributions.length > 1 ? 's' : ''} au total
                                    </small>
                                </div>

                                {/* Barre de filtres */}
                                <div className="card-body border-bottom">
                                    <div className="row g-3 align-items-end">
                                        {/* Filtre par statut */}
                                        <div className="col-md-3">
                                            <label htmlFor="filtreStatut" className="form-label small fw-medium">
                                                Statut
                                            </label>
                                            <select
                                                id="filtreStatut"
                                                className="form-select form-select-sm"
                                                value={filtres.statut}
                                                onChange={(e) => changerFiltre('statut', e.target.value)}
                                            >
                                                <option value="tous">Tous les statuts</option>
                                                <option value="valides">✅ Validés</option>
                                                <option value="en_attente">🟡 En attente</option>
                                                <option value="echec">❌ Échecs</option>
                                                <option value="rembourses">🔄 Remboursés</option>
                                            </select>
                                        </div>

                                        {/* Filtre par période */}
                                        <div className="col-md-3">
                                            <label htmlFor="filtrePeriode" className="form-label small fw-medium">
                                                Période
                                            </label>
                                            <select
                                                id="filtrePeriode"
                                                className="form-select form-select-sm"
                                                value={filtres.periode}
                                                onChange={(e) => changerFiltre('periode', e.target.value)}
                                            >
                                                <option value="toutes">Toutes les périodes</option>
                                                <option value="dernier_mois">Dernier mois</option>
                                                <option value="3_mois">3 derniers mois</option>
                                                <option value="6_mois">6 derniers mois</option>
                                                <option value="cette_annee">Cette année</option>
                                            </select>
                                        </div>

                                        {/* Filtre par montant */}
                                        <div className="col-md-3">
                                            <label htmlFor="filtreMontant" className="form-label small fw-medium">
                                                Montant
                                            </label>
                                            <select
                                                id="filtreMontant"
                                                className="form-select form-select-sm"
                                                value={filtres.montant}
                                                onChange={(e) => changerFiltre('montant', e.target.value)}
                                            >
                                                <option value="tous">Tous les montants</option>
                                                <option value="petit">&lt; 10 000 FCFA</option>
                                                <option value="moyen">10 000 - 50 000 FCFA</option>
                                                <option value="grand">&gt; 50 000 FCFA</option>
                                            </select>
                                        </div>

                                        {/* Recherche par projet */}
                                        <div className="col-md-3">
                                            <label htmlFor="rechercheProjet" className="form-label small fw-medium">
                                                Recherche
                                            </label>
                                            <div className="input-group input-group-sm">
                                                <input
                                                    type="text"
                                                    id="rechercheProjet"
                                                    className="form-control"
                                                    placeholder="Nom du projet..."
                                                    value={filtres.recherche}
                                                    onChange={(e) => changerFiltre('recherche', e.target.value)}
                                                />
                                                {filtres.recherche && (
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        type="button"
                                                        onClick={() => changerFiltre('recherche', '')}
                                                        title="Effacer la recherche"
                                                    >
                                                        <i className="bi bi-x"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions sur les filtres */}
                                    <div className="row mt-3">
                                        <div className="col-12 d-flex justify-content-between align-items-center">
                                            <div>
                                                {(filtres.statut !== 'tous' ||
                                                    filtres.periode !== 'toutes' ||
                                                    filtres.montant !== 'tous' ||
                                                    filtres.recherche.trim()) && (
                                                        <small className="text-muted">
                                                            <i className="bi bi-funnel me-1"></i>
                                                            Filtres actifs
                                                        </small>
                                                    )}
                                            </div>
                                            <button
                                                onClick={reinitialiserFiltres}
                                                className="btn btn-outline-secondary btn-sm"
                                                title="Réinitialiser tous les filtres"
                                            >
                                                <i className="bi bi-arrow-clockwise me-1"></i>
                                                Réinitialiser
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Chargement...</span>
                                            </div>
                                            <p className="mt-3 text-muted">Chargement de vos contributions...</p>
                                        </div>
                                    ) : contributionsFiltrees.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Projet</th>
                                                        <th>Montant</th>
                                                        <th>Statut</th>
                                                        <th>Date</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contributionsFiltrees.map((contribution) => (
                                                        <tr key={contribution.id}>
                                                            {/* Projet */}
                                                            <td>
                                                                <div>
                                                                    <strong>{contribution.projet.titre}</strong>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        {contribution.projet.statut} • {contribution.projet.pourcentage_atteint}% atteint
                                                                    </small>
                                                                </div>
                                                            </td>

                                                            {/* Montant */}
                                                            <td>
                                                                <div className="fw-bold text-success">
                                                                    {formatMontant(contribution.montant)} FCFA
                                                                </div>
                                                                <small className="text-muted">
                                                                    Réf: {contribution.reference_paiement}
                                                                </small>
                                                            </td>

                                                            {/* Statut */}
                                                            <td>
                                                                {contribution.statut_paiement_display === 'Validé' && (
                                                                    <span className="badge bg-success fs-6">
                                                                        <i className="bi bi-check-circle me-1"></i>
                                                                        Validé
                                                                    </span>
                                                                )}
                                                                {contribution.statut_paiement_display === 'En attente' && (
                                                                    <span className="badge bg-warning fs-6">
                                                                        <i className="bi bi-clock me-1"></i>
                                                                        En attente
                                                                    </span>
                                                                )}
                                                                {contribution.statut_paiement_display === 'Échec' && (
                                                                    <span className="badge bg-danger fs-6">
                                                                        <i className="bi bi-x-circle me-1"></i>
                                                                        Échec
                                                                    </span>
                                                                )}
                                                                {contribution.statut_paiement_display === 'Remboursé' && (
                                                                    <span className="badge bg-info fs-6">
                                                                        <i className="bi bi-arrow-return-left me-1"></i>
                                                                        Remboursé
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* Date */}
                                                            <td>
                                                                <div>{formatDate(contribution.date_contribution)}</div>
                                                                {contribution.message_soutien && (
                                                                    <small className="text-muted">
                                                                        <i className="bi bi-chat-quote me-1"></i>
                                                                        Message inclus
                                                                    </small>
                                                                )}
                                                            </td>

                                                            {/* Actions */}
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    {/* Bouton détail */}
                                                                    <button
                                                                        className="btn btn-outline-primary btn-sm"
                                                                        title="Voir le détail"
                                                                        onClick={() => ouvrirDetailModal(contribution)}
                                                                    >
                                                                        <i className="bi bi-eye"></i>
                                                                    </button>

                                                                    {/* Bouton reçu PDF si disponible */}
                                                                    {contribution.recu_pdf && (
                                                                        <a
                                                                            href={contribution.recu_pdf}
                                                                            className="btn btn-outline-success btn-sm"
                                                                            title="Télécharger le reçu"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            <i className="bi bi-download"></i>
                                                                        </a>
                                                                    )}

                                                                    {/* Lien vers projet */}
                                                                    <a
                                                                        href={`/projets/${contribution.projet.id}`}
                                                                        className="btn btn-outline-info btn-sm"
                                                                        title="Voir le projet"
                                                                    >
                                                                        <i className="bi bi-box-arrow-up-right"></i>
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : contributions.length > 0 ? (
                                        // Aucun résultat avec les filtres actuels
                                        <div className="text-center py-5">
                                            <i className="bi bi-funnel-fill text-muted display-4"></i>
                                            <h5 className="mt-3 text-muted">Aucune contribution trouvée</h5>
                                            <p className="text-muted">
                                                Aucune contribution ne correspond aux filtres sélectionnés.
                                            </p>
                                            <button
                                                onClick={reinitialiserFiltres}
                                                className="btn btn-outline-primary"
                                            >
                                                <i className="bi bi-arrow-clockwise me-2"></i>
                                                Réinitialiser les filtres
                                            </button>
                                        </div>
                                    ) : (
                                        // Aucune contribution du tout (erreur de chargement)
                                        <div className="text-center py-4">
                                            <i className="bi bi-inbox text-muted display-4"></i>
                                            <h5 className="mt-3 text-muted">Aucune contribution trouvée</h5>
                                            <p className="text-muted">
                                                Une erreur s'est produite lors du chargement de vos contributions.
                                            </p>
                                            <button
                                                onClick={chargerContributions}
                                                className="btn btn-outline-primary"
                                            >
                                                <i className="bi bi-arrow-clockwise me-2"></i>
                                                Recharger
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            {/* Modal de détail de contribution */}
            {showDetailModal && selectedContribution && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-receipt me-2"></i>
                                    Détail de la contribution
                                </h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowDetailModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* En-tête avec montant */}
                                <div className="text-center mb-4 pb-4 border-bottom">
                                    <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{ width: '80px', height: '80px' }}>
                                        <i className="bi bi-wallet2 text-success fs-1"></i>
                                    </div>
                                    <h2 className="text-success mb-1">
                                        {formatMontant(selectedContribution.montant)} FCFA
                                    </h2>
                                    <p className="text-muted mb-0">Montant contribué</p>
                                </div>

                                <div className="row g-4">
                                    {/* Colonne gauche - Informations projet */}
                                    <div className="col-md-6">
                                        <h6 className="text-muted mb-3">
                                            <i className="bi bi-folder me-2"></i>
                                            Projet soutenu
                                        </h6>
                                        <div className="bg-light rounded p-3">
                                            <h5 className="mb-2">{selectedContribution.projet.titre}</h5>
                                            <div className="d-flex flex-wrap gap-2 mb-2">
                                                <span className="badge bg-primary">
                                                    {selectedContribution.projet.statut}
                                                </span>
                                                <span className="badge bg-info">
                                                    {selectedContribution.projet.pourcentage_atteint}% financé
                                                </span>
                                            </div>
                                            <a
                                                href={`/projets/${selectedContribution.projet.id}`}
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                <i className="bi bi-eye me-1"></i>
                                                Voir le projet
                                            </a>
                                        </div>
                                    </div>

                                    {/* Colonne droite - Détails paiement */}
                                    <div className="col-md-6">
                                        <h6 className="text-muted mb-3">
                                            <i className="bi bi-credit-card me-2"></i>
                                            Détails du paiement
                                        </h6>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span className="text-muted">Référence</span>
                                                <span className="fw-bold font-monospace">
                                                    {selectedContribution.reference_paiement}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span className="text-muted">Date</span>
                                                <span>{formatDate(selectedContribution.date_contribution)}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <span className="text-muted">Statut</span>
                                                {selectedContribution.statut_paiement_display === 'Validé' && (
                                                    <span className="badge bg-success">
                                                        <i className="bi bi-check-circle me-1"></i>Validé
                                                    </span>
                                                )}
                                                {selectedContribution.statut_paiement_display === 'Échec' && (
                                                    <span className="badge bg-danger">
                                                        <i className="bi bi-x-circle me-1"></i>Échec
                                                    </span>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Message de soutien */}
                                {selectedContribution.message_soutien && (
                                    <div className="mt-4">
                                        <h6 className="text-muted mb-2">
                                            <i className="bi bi-chat-quote me-2"></i>
                                            Votre message de soutien
                                        </h6>
                                        <div className="bg-light rounded p-3 fst-italic">
                                            "{selectedContribution.message_soutien}"
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                {selectedContribution.recu_pdf && (
                                    <a
                                        href={selectedContribution.recu_pdf}
                                        className="btn btn-success"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="bi bi-download me-2"></i>
                                        Télécharger le reçu PDF
                                    </a>
                                )}
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MesContributionsPage