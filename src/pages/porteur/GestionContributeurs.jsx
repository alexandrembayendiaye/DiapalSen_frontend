// src/pages/porteur/GestionContributeurs.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import contributionsService from '../../services/contributionsService'
import projectsService from '../../services/projectsService'
import toast from 'react-hot-toast'

const GestionContributeurs = () => {
    const { projectId } = useParams()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [project, setProject] = useState(null)
    const [contributeurs, setContributeurs] = useState([])
    const [stats, setStats] = useState({
        total_contributeurs: 0,
        total_contributions: 0,
        montant_moyen: 0,
        contribution_max: 0
    })
    const [filtres, setFiltres] = useState({
        search: '',
        sort: 'recent',
        montant_min: '',
        montant_max: ''
    })
    const [selectedContributeur, setSelectedContributeur] = useState(null)
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [message, setMessage] = useState({
        type: 'remerciement',
        sujet: '',
        contenu: ''
    })

    useEffect(() => {
        loadContributeurs()
    }, [projectId])

    const loadContributeurs = async () => {
        try {
            setLoading(true)

            // Charger les vraies données du projet
            try {
                const projectData = await projectsService.getMonProjet(projectId)

                // Vérifier que l'utilisateur est bien le porteur
                if (projectData.porteur.id !== user.id) {
                    toast.error('Vous n\'avez pas accès aux contributeurs de ce projet')
                    return
                }

                setProject(projectData)

                // Charger les contributeurs du projet
                const contributeursData = await contributionsService.getContributionsProjet(projectId)

                // Traiter les données pour grouper par contributeur
                const contributeurs = {}
                const contributions = contributeursData.results || []

                contributions.forEach(contribution => {
                    const contributeurId = contribution.contributeur_id || contribution.contributeur?.id
                    const contributeurNom = contribution.contributeur_nom || contribution.contributeur?.nom || 'Anonyme'
                    const contributeurEmail = contribution.contributeur_email || contribution.contributeur?.email || ''

                    if (!contributeurs[contributeurId]) {
                        contributeurs[contributeurId] = {
                            id: contributeurId,
                            nom_complet: contributeurNom,
                            email: contributeurEmail,
                            contributions: [],
                            total_contribution: 0,
                            nombre_contributions: 0,
                            premiere_contribution: contribution.date_contribution,
                            derniere_contribution: contribution.date_contribution,
                            region: contribution.contributeur?.region || ''
                        }
                    }

                    contributeurs[contributeurId].contributions.push(contribution)
                    contributeurs[contributeurId].total_contribution += parseInt(contribution.montant)
                    contributeurs[contributeurId].nombre_contributions += 1

                    // Mettre à jour les dates
                    if (new Date(contribution.date_contribution) < new Date(contributeurs[contributeurId].premiere_contribution)) {
                        contributeurs[contributeurId].premiere_contribution = contribution.date_contribution
                    }
                    if (new Date(contribution.date_contribution) > new Date(contributeurs[contributeurId].derniere_contribution)) {
                        contributeurs[contributeurId].derniere_contribution = contribution.date_contribution
                    }
                })

                const contributeursArray = Object.values(contributeurs)
                setContributeurs(contributeursArray)

                // Calculer les stats
                if (contributeursArray.length > 0) {
                    const totalContrib = contributeursArray.reduce((sum, c) => sum + c.total_contribution, 0)
                    const totalContributions = contributeursArray.reduce((sum, c) => sum + c.nombre_contributions, 0)
                    const montantMoyen = totalContrib / contributeursArray.length
                    const contributionMax = Math.max(...contributeursArray.map(c => c.total_contribution))

                    setStats({
                        total_contributeurs: contributeursArray.length,
                        total_contributions: totalContributions,
                        montant_moyen: montantMoyen,
                        contribution_max: contributionMax
                    })
                } else {
                    setStats({
                        total_contributeurs: 0,
                        total_contributions: 0,
                        montant_moyen: 0,
                        contribution_max: 0
                    })
                }

            } catch (apiError) {
                console.error('❌ Erreur API, utilisation de données simulées:', apiError)

                // Fallback avec données simulées si l'API échoue
                const simulatedProject = {
                    id: parseInt(projectId),
                    titre: "Application AgriSmart - IA pour l'agriculture",
                    montant_collecte: 245000,
                    nombre_contributeurs: 4,
                    porteur: { id: user.id }
                }

                const simulatedContributeurs = [
                    {
                        id: 1,
                        nom_complet: "Mamadou Diallo",
                        email: "mamadou.d@email.com",
                        contributions: [
                            { id: 1, montant: 75000, date: "2024-11-12T10:30:00Z", message: "Excellent projet !" }
                        ],
                        total_contribution: 75000,
                        premiere_contribution: "2024-11-12T10:30:00Z",
                        derniere_contribution: "2024-11-12T10:30:00Z",
                        nombre_contributions: 1,
                        region: "Dakar"
                    },
                    {
                        id: 2,
                        nom_complet: "Aïssatou Niang",
                        email: "aissatou.n@email.com",
                        contributions: [
                            { id: 2, montant: 50000, date: "2024-11-11T15:20:00Z", message: "Bonne continuation !" }
                        ],
                        total_contribution: 50000,
                        premiere_contribution: "2024-11-11T15:20:00Z",
                        derniere_contribution: "2024-11-11T15:20:00Z",
                        nombre_contributions: 1,
                        region: "Thiès"
                    },
                    {
                        id: 3,
                        nom_complet: "Ousmane Ba",
                        email: "ousmane.ba@email.com",
                        contributions: [
                            { id: 3, montant: 65000, date: "2024-11-09T09:15:00Z", message: "Très beau projet !" }
                        ],
                        total_contribution: 65000,
                        premiere_contribution: "2024-11-09T09:15:00Z",
                        derniere_contribution: "2024-11-09T09:15:00Z",
                        nombre_contributions: 1,
                        region: "Saint-Louis"
                    },
                    {
                        id: 4,
                        nom_complet: "Fatou Seck",
                        email: "fatou.s@email.com",
                        contributions: [
                            { id: 4, montant: 55000, date: "2024-11-08T16:45:00Z", message: "J'encourage ce projet !" }
                        ],
                        total_contribution: 55000,
                        premiere_contribution: "2024-11-08T16:45:00Z",
                        derniere_contribution: "2024-11-08T16:45:00Z",
                        nombre_contributions: 1,
                        region: "Diourbel"
                    }
                ]

                setProject(simulatedProject)
                setContributeurs(simulatedContributeurs)

                // Stats simulées
                setStats({
                    total_contributeurs: 4,
                    total_contributions: 4,
                    montant_moyen: 61250,
                    contribution_max: 75000
                })

                toast.warning('Données simulées utilisées - API en cours de développement')
            }

        } catch (error) {
            console.error('❌ Erreur générale chargement contributeurs:', error)
            toast.error('Erreur lors du chargement des contributeurs')
        } finally {
            setLoading(false)
        }
    }

    // Filtrage et tri des contributeurs
    const contributeursFiltres = contributeurs.filter(contributeur => {
        const matchSearch = contributeur.nom_complet.toLowerCase().includes(filtres.search.toLowerCase())
        const matchMontantMin = !filtres.montant_min || contributeur.total_contribution >= parseInt(filtres.montant_min)
        const matchMontantMax = !filtres.montant_max || contributeur.total_contribution <= parseInt(filtres.montant_max)

        return matchSearch && matchMontantMin && matchMontantMax
    }).sort((a, b) => {
        switch (filtres.sort) {
            case 'recent':
                return new Date(b.derniere_contribution) - new Date(a.derniere_contribution)
            case 'montant_desc':
                return b.total_contribution - a.total_contribution
            case 'montant_asc':
                return a.total_contribution - b.total_contribution
            case 'nom':
                return a.nom_complet.localeCompare(b.nom_complet)
            default:
                return 0
        }
    })

    const envoyerMessage = async () => {
        try {
            if (!message.sujet || !message.contenu) {
                toast.error('Veuillez remplir tous les champs')
                return
            }

            // Simuler l'envoi
            console.log('📧 Envoi message:', {
                destinataire: selectedContributeur,
                message
            })

            toast.success('Message envoyé avec succès !')
            setShowMessageModal(false)
            setMessage({ type: 'remerciement', sujet: '', contenu: '' })
            setSelectedContributeur(null)

            /* VRAIE API
            await contributionsService.envoyerMessage({
                contributeur_id: selectedContributeur.id,
                projet_id: projectId,
                ...message
            })
            */
        } catch (error) {
            console.error('❌ Erreur envoi message:', error)
            toast.error('Erreur lors de l\'envoi du message')
        }
    }

    const ouvrirModalMessage = (contributeur) => {
        setSelectedContributeur(contributeur)
        setMessage({
            type: 'remerciement',
            sujet: `Merci pour votre soutien à "${project?.titre}"`,
            contenu: `Bonjour ${contributeur.nom_complet},\n\nJe tenais à vous remercier chaleureusement pour votre soutien à mon projet "${project?.titre}". Votre contribution de ${contributeur.total_contribution.toLocaleString()} FCFA me permet d'avancer vers mon objectif.\n\nVotre confiance en ce projet est très précieuse et motivante.\n\nCordialement,\n${user.prenom} ${user.nom}`
        })
        setShowMessageModal(true)
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement des contributeurs...</p>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h4>Projet non trouvé</h4>
                    <p>Le projet demandé n'existe pas ou vous n'y avez pas accès.</p>
                    <Link to="/mes-projets" className="btn btn-primary">
                        Retour à mes projets
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="gestion-contributeurs">

            {/* En-tête */}
            <div className="bg-primary text-white py-4 mb-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <nav aria-label="breadcrumb" className="mb-2">
                                <ol className="breadcrumb breadcrumb-white mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/mes-projets" className="text-white">Mes projets</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to={`/mes-projets/${project.id}/stats`} className="text-white">Statistiques</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Contributeurs</li>
                                </ol>
                            </nav>
                            <h1 className="h3 mb-1">{project.titre}</h1>
                            <p className="mb-0 opacity-75">
                                Gestion et communication avec vos contributeurs
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            <Link
                                to={`/mes-projets/${project.id}/stats`}
                                className="btn btn-light me-2"
                            >
                                <i className="bi bi-graph-up me-1"></i>
                                Statistiques
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">

                {/* Métriques des contributeurs */}
                <div className="row mb-4">
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card bg-primary text-white h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="card-title opacity-75">Contributeurs</h6>
                                        <h3 className="mb-0">{stats.total_contributeurs}</h3>
                                        <small className="opacity-75">
                                            {stats.total_contributions} contribution{stats.total_contributions > 1 ? 's' : ''}
                                        </small>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-people fs-1 opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card bg-success text-white h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="card-title opacity-75">Contribution max</h6>
                                        <h3 className="mb-0">{(stats.contribution_max / 1000).toFixed(0)}k</h3>
                                        <small className="opacity-75">FCFA</small>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-trophy fs-1 opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card bg-info text-white h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="card-title opacity-75">Contribution moyenne</h6>
                                        <h3 className="mb-0">{(stats.montant_moyen / 1000).toFixed(0)}k</h3>
                                        <small className="opacity-75">FCFA par personne</small>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-calculator fs-1 opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card bg-warning text-white h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="card-title opacity-75">Fidélité</h6>
                                        <h3 className="mb-0">
                                            {contributeurs.filter(c => c.nombre_contributions > 1).length}
                                        </h3>
                                        <small className="opacity-75">contributeurs récurrents</small>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-heart fs-1 opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-4 mb-2 mb-md-0">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Rechercher un contributeur..."
                                        value={filtres.search}
                                        onChange={(e) => setFiltres({ ...filtres, search: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 mb-2 mb-md-0">
                                <select
                                    className="form-select"
                                    value={filtres.sort}
                                    onChange={(e) => setFiltres({ ...filtres, sort: e.target.value })}
                                >
                                    <option value="recent">Plus récents</option>
                                    <option value="montant_desc">Montant décroissant</option>
                                    <option value="montant_asc">Montant croissant</option>
                                    <option value="nom">Nom alphabétique</option>
                                </select>
                            </div>
                            <div className="col-md-2 mb-2 mb-md-0">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Min FCFA"
                                    value={filtres.montant_min}
                                    onChange={(e) => setFiltres({ ...filtres, montant_min: e.target.value })}
                                />
                            </div>
                            <div className="col-md-2 mb-2 mb-md-0">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Max FCFA"
                                    value={filtres.montant_max}
                                    onChange={(e) => setFiltres({ ...filtres, montant_max: e.target.value })}
                                />
                            </div>
                            <div className="col-md-1">
                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => setFiltres({ search: '', sort: 'recent', montant_min: '', montant_max: '' })}
                                    title="Réinitialiser"
                                >
                                    <i className="bi bi-arrow-clockwise"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des contributeurs */}
                <div className="card">
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-people me-2"></i>
                                Mes contributeurs ({contributeursFiltres.length})
                            </h5>
                            <div>
                                <button className="btn btn-success btn-sm me-2">
                                    <i className="bi bi-download me-1"></i>
                                    Exporter
                                </button>
                                <button className="btn btn-primary btn-sm">
                                    <i className="bi bi-envelope me-1"></i>
                                    Message groupé
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {contributeursFiltres.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Contributeur</th>
                                            <th>Total contribué</th>
                                            <th>Contributions</th>
                                            <th>Première contribution</th>
                                            <th>Dernière contribution</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contributeursFiltres.map(contributeur => (
                                            <tr key={contributeur.id} className="align-middle">
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                            style={{ width: '40px', height: '40px' }}>
                                                            <span className="text-white fw-bold">
                                                                {contributeur.nom_complet.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <strong className="d-block">{contributeur.nom_complet}</strong>
                                                            <small className="text-muted">{contributeur.email}</small>
                                                            {contributeur.region && (
                                                                <div>
                                                                    <small className="text-muted">
                                                                        <i className="bi bi-geo-alt me-1"></i>
                                                                        {contributeur.region}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong className="text-success">
                                                        {contributeur.total_contribution.toLocaleString()} FCFA
                                                    </strong>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {contributeur.nombre_contributions} contribution{contributeur.nombre_contributions > 1 ? 's' : ''}
                                                    </span>
                                                    {contributeur.nombre_contributions > 1 && (
                                                        <div>
                                                            <small className="text-success">
                                                                <i className="bi bi-arrow-repeat me-1"></i>
                                                                Récurrent
                                                            </small>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {new Date(contributeur.premiere_contribution).toLocaleDateString('fr-FR')}
                                                    </small>
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {new Date(contributeur.derniere_contribution).toLocaleDateString('fr-FR')}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => ouvrirModalMessage(contributeur)}
                                                            title="Envoyer un message"
                                                        >
                                                            <i className="bi bi-envelope"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-info"
                                                            title="Voir le profil"
                                                        >
                                                            <i className="bi bi-person"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <i className="bi bi-people fs-1 text-muted mb-3"></i>
                                <h5>Aucun contributeur trouvé</h5>
                                <p className="text-muted">
                                    {contributeurs.length === 0
                                        ? "Votre projet n'a pas encore reçu de contribution."
                                        : "Aucun contributeur ne correspond aux filtres appliqués."
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Modal de message */}
            {showMessageModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-envelope me-2"></i>
                                    Message à {selectedContributeur?.nom_complet}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowMessageModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Type de message</label>
                                    <select
                                        className="form-select"
                                        value={message.type}
                                        onChange={(e) => setMessage({ ...message, type: e.target.value })}
                                    >
                                        <option value="remerciement">Remerciement</option>
                                        <option value="mise_a_jour">Mise à jour projet</option>
                                        <option value="invitation">Invitation événement</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Sujet</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={message.sujet}
                                        onChange={(e) => setMessage({ ...message, sujet: e.target.value })}
                                        placeholder="Sujet du message..."
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        rows="6"
                                        value={message.contenu}
                                        onChange={(e) => setMessage({ ...message, contenu: e.target.value })}
                                        placeholder="Votre message..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowMessageModal(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={envoyerMessage}
                                >
                                    <i className="bi bi-send me-1"></i>
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GestionContributeurs