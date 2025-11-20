// src/pages/projects/ProjectDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import projectsService from '../../services/projectsService'
import toast from 'react-hot-toast'
import ContributionModal from '../../components/contributions/ContributionModal'
import { getProjectImages } from '../../utils/imageUtils'
import CommentairesSection from '../../components/interactions/CommentairesSection'
import interactionsService from '../../services/interactionsService'
import PartageButtons from '../../components/interactions/PartageButtons'





const ProjectDetailPage = () => {
    const { id } = useParams()
    const { isAuthenticated } = useAuth()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('description')
    const [showContributionModal, setShowContributionModal] = useState(false)
    const [commentairesCount, setCommentairesCount] = useState(0)
    const [estFavori, setEstFavori] = useState(false)
    const [favoriLoading, setFavoriLoading] = useState(false)



    // Dans useEffect :
    useEffect(() => {
        loadProject()
        loadCommentairesCount()
        checkIfFavori()


    }, [id, isAuthenticated])

    const loadProject = async () => {
        try {
            setLoading(true)
            const data = await projectsService.getProject(id)

            // Adapter les données Django pour l'interface
            const adaptedProject = {
                ...data,
                porteur: {
                    nom: data.porteur_nom,
                    prenom: data.porteur_nom?.split(' ')[0] || '',
                    email: data.porteur_email || '',
                    photo: "https://via.placeholder.com/100x100/0066cc/ffffff?text=" + (data.porteur_nom?.charAt(0) || 'U')
                },
                images: getProjectImages(data),
                contributeurs_recents: [] // Sera rempli plus tard avec l'API contributions
            }

            setProject(adaptedProject)
        } catch (error) {
            console.error('Erreur chargement projet:', error)
            toast.error('Erreur lors du chargement du projet')
            setProject(null)
        } finally {
            setLoading(false)
        }
    }
    const loadCommentairesCount = async () => {
        if (!id) return

        try {
            const data = await interactionsService.getCommentairesProjet(id)
            setCommentairesCount(data.length || data.results?.length || 0)
        } catch (error) {
            console.error('Erreur chargement count commentaires:', error)
            setCommentairesCount(0)
        }
    }
    const checkIfFavori = async () => {
        if (!isAuthenticated || !id) return

        try {
            const data = await interactionsService.getMesFavoris()
            console.log('🔍 Structure favoris:', data)

            // Django DRF peut retourner {results: [...]} ou directement [...]
            const favoris = data.results || data

            const isFavorite = favoris.some(fav => fav.projet.id == id)
            setEstFavori(isFavorite)
        } catch (error) {
            console.error('Erreur vérification favori:', error)
            setEstFavori(false)
        }
    }
    const toggleFavori = async () => {
        if (!isAuthenticated) {
            toast.error('Connectez-vous pour ajouter aux favoris')
            return
        }

        try {
            setFavoriLoading(true)

            if (estFavori) {
                // Retirer des favoris
                await interactionsService.retirerFavori(project.id)
                setEstFavori(false)
                toast.success('Projet retiré des favoris')
            } else {
                // Ajouter aux favoris
                await interactionsService.ajouterFavori(project.id)
                setEstFavori(true)
                toast.success('Projet ajouté aux favoris !')
            }
        } catch (error) {
            console.error('Erreur toggle favori:', error)
            toast.error('Erreur lors de la mise à jour des favoris')
        } finally {
            setFavoriLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement du projet...</p>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <h2>Projet non trouvé</h2>
                    <p className="text-muted">Le projet demandé n'existe pas ou a été supprimé.</p>
                    <Link to="/projets" className="btn btn-primary">
                        Retour aux projets
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="project-detail-page">

            {/* Breadcrumb */}
            <div className="bg-light py-2">
                <div className="container">
                    <nav>
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link to="/">Accueil</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to="/projets">Projets</Link>
                            </li>
                            <li className="breadcrumb-item active">{project.titre}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-4">
                <div className="row">

                    {/* Contenu principal */}
                    <div className="col-lg-8">

                        {/* Header du projet */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <span className="badge bg-primary fs-6">{project.categorie_nom}</span>
                                <div className="d-flex gap-2">
                                    <button
                                        className={`btn btn-sm ${estFavori ? 'btn-warning' : 'btn-outline-warning'}`}
                                        onClick={toggleFavori}
                                        disabled={favoriLoading}
                                    >
                                        {favoriLoading ? (
                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                        ) : (
                                            <i className={`bi ${estFavori ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
                                        )}
                                        {estFavori ? 'Favoris ✓' : 'Favoris'}
                                    </button>
                                    <PartageButtons projet={project} variant="modal" className="btn-sm" />
                                </div>
                            </div>

                            <h1 className="h2 mb-3">{project.titre}</h1>
                            <p className="lead text-muted mb-3">{project.description_courte}</p>

                            <div className="d-flex align-items-center text-muted">
                                <img
                                    src={project.porteur.photo}
                                    className="rounded-circle me-2"
                                    width="40"
                                    height="40"
                                    alt={project.porteur.nom}
                                />
                                <div>
                                    <strong>Par {project.porteur.prenom} {project.porteur.nom}</strong>
                                    <br />
                                    <small>
                                        <i className="bi bi-geo-alt me-1"></i>
                                        {project.ville}, {project.region}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Images/Vidéo */}
                        <div className="mb-4">
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <img
                                        src={project.images[0]}
                                        className="img-fluid rounded shadow"
                                        alt="Image principale"
                                    />
                                </div>
                                <div className="col-4">
                                    <img
                                        src={project.images[1]}
                                        className="img-fluid rounded"
                                        alt="Image 2"
                                    />
                                </div>
                                <div className="col-4">
                                    <img
                                        src={project.images[2]}
                                        className="img-fluid rounded"
                                        alt="Image 3"
                                    />
                                </div>
                                <div className="col-4">
                                    <div className="bg-light rounded d-flex align-items-center justify-content-center h-100">
                                        <span className="text-muted">
                                            <i className="bi bi-play-circle fs-1"></i>
                                            <br />Voir la vidéo
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Onglets de contenu */}
                        <div className="mb-4">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('description')}
                                    >
                                        Description
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'comments' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('comments')}
                                    >
                                        Commentaires <span className="badge bg-secondary ms-1">{commentairesCount}</span>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'updates' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('updates')}
                                    >
                                        Actualités <span className="badge bg-secondary ms-1">2</span>
                                    </button>
                                </li>
                            </ul>

                            <div className="tab-content mt-3">
                                {activeTab === 'description' && (
                                    <div className="tab-pane fade show active">
                                        <div style={{ whiteSpace: 'pre-line' }}>
                                            {project.description_complete}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'updates' && (
                                    <div className="tab-pane fade show active">
                                        <p className="text-muted">Les actualités du projet apparaîtront ici.</p>
                                    </div>
                                )}

                                {activeTab === 'comments' && (
                                    <div className="tab-pane fade show active">
                                        <CommentairesSection projet={project} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar contribution */}
                    <div className="col-lg-4">
                        <div className="sticky-top" style={{ top: '80px' }}>

                            {/* Carte de contribution */}
                            <div className="card border-0 shadow mb-4">
                                <div className="card-body p-4">

                                    {/* Montant collecté */}
                                    <div className="text-center mb-4">
                                        <h3 className="h2 text-success mb-1">
                                            {(project.montant_collecte / 1000000).toFixed(1)}M FCFA
                                        </h3>
                                        <p className="text-muted mb-1">
                                            collectés sur {(project.montant_objectif / 1000000).toFixed(1)}M FCFA
                                        </p>
                                        <div className="progress mb-2" style={{ height: '12px' }}>
                                            <div
                                                className="progress-bar bg-success"
                                                style={{ width: `${Math.min(project.pourcentage_atteint, 100)}%` }}
                                            />
                                        </div>
                                        <small className="text-muted">{project.pourcentage_atteint}% de l'objectif</small>
                                    </div>

                                    {/* Stats */}
                                    <div className="row text-center mb-4">
                                        <div className="col-6">
                                            <h4 className="h5 text-primary mb-1">{project.nombre_contributeurs}</h4>
                                            <small className="text-muted">contributeurs</small>
                                        </div>
                                        <div className="col-6">
                                            <h4 className="h5 text-warning mb-1">{project.jours_restants}</h4>
                                            <small className="text-muted">jours restants</small>
                                        </div>
                                    </div>

                                    {/* Bouton contribution */}
                                    {isAuthenticated ? (
                                        <div className="d-grid">
                                            <button
                                                className="btn btn-success btn-lg mb-3"
                                                onClick={() => setShowContributionModal(true)}
                                            >
                                                <i className="bi bi-heart-fill me-2"></i>
                                                Soutenir ce projet
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-grid">
                                            <Link to="/register" className="btn btn-primary btn-lg mb-3">
                                                S'inscrire pour contribuer
                                            </Link>
                                        </div>
                                    )}

                                    <small className="text-muted d-block text-center">
                                        Paiement sécurisé via Wave, Orange Money ou Free Money
                                    </small>
                                </div>
                            </div>

                            {/* Contributeurs récents */}
                            <div className="card border-0 shadow">
                                <div className="card-header bg-light">
                                    <h6 className="card-title mb-0">Derniers contributeurs</h6>
                                </div>
                                <div className="card-body">
                                    {project.contributeurs_recents.map((contrib, index) => (
                                        <div key={index} className="d-flex align-items-center mb-3">
                                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{ width: '40px', height: '40px', fontSize: '0.8rem', color: 'white' }}>
                                                {contrib.nom.split(' ').map(n => n.charAt(0)).join('')}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-medium">{contrib.nom}</div>
                                                <small className="text-muted">
                                                    {contrib.montant.toLocaleString()} FCFA • {contrib.date}
                                                </small>
                                                {contrib.message && (
                                                    <div className="small text-muted">"{contrib.message}"</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="text-center">
                                        <button className="btn btn-outline-secondary btn-sm">
                                            Voir tous les contributeurs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal de contribution */}
            <ContributionModal
                show={showContributionModal}
                onHide={() => setShowContributionModal(false)}
                project={project}
                onSuccess={(result) => {
                    // Recharger le projet pour voir les nouvelles données
                    loadProject()
                }}
            />
        </div>
    )

}

export default ProjectDetailPage