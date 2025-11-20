// src/pages/projects/ProjectsListPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import projectsService from '../../services/projectsService'
import toast from 'react-hot-toast'
import { getProjectListImage } from '../../utils/imageUtils'
import interactionsService from '../../services/interactionsService'
import PartageButtons from '../../components/interactions/PartageButtons'





const ProjectsListPage = () => {
    const { isAuthenticated } = useAuth()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        region: '',
        sort: 'recent'
    })
    const [favoris, setFavoris] = useState([])


    // Simuler des projets pour l'instant (plus tard on appellera l'API)

    // ... dans le composant, remplacer useEffect par :

    // Charger les projets depuis l'API Django
    useEffect(() => {
        loadProjects()
        loadFavoris()
    }, [isAuthenticated])

    const loadProjects = async () => {
        try {
            setLoading(true)
            const response = await projectsService.getProjects()  // Sans paramètres
            // Django retourne {count, results} - utiliser response.results
            const projects = response.results || []

            // Adapter les données Django
            const adaptedProjects = projects.map(project => ({
                id: project.id,
                titre: project.titre,
                description_courte: project.description_courte,
                montant_objectif: parseInt(project.montant_objectif),
                montant_collecte: parseInt(project.montant_collecte) || 0,
                pourcentage_atteint: project.pourcentage_atteint || 0,
                nombre_contributeurs: project.nombre_contributeurs || 0,
                jours_restants: project.jours_restants || 0,
                categorie_nom: project.categorie_nom,
                ville: project.ville,
                region: project.region,
                porteur_nom: project.porteur_nom,
                image_principale: getProjectListImage(project.image_principale, project.titre)
            }))

            setProjects(adaptedProjects)
        } catch (error) {
            console.error('Erreur chargement projets:', error)
            toast.error('Erreur lors du chargement des projets')
        } finally {
            setLoading(false)
        }
    }
    const loadFavoris = async () => {
        if (!isAuthenticated) return

        try {
            const data = await interactionsService.getMesFavoris()
            const favorisList = data.results || data
            setFavoris(favorisList.map(fav => fav.projet.id))
        } catch (error) {
            console.error('Erreur chargement favoris:', error)
        }
    }
    const toggleFavoriCard = async (projectId) => {
        if (!isAuthenticated) {
            toast.error('Connectez-vous pour ajouter aux favoris')
            return
        }

        try {
            const estFavori = favoris.includes(projectId)

            if (estFavori) {
                await interactionsService.retirerFavori(projectId)
                setFavoris(prev => prev.filter(id => id !== projectId))
                toast.success('Retiré des favoris')
            } else {
                await interactionsService.ajouterFavori(projectId)
                setFavoris(prev => [...prev, projectId])
                toast.success('Ajouté aux favoris !')
            }
        } catch (error) {
            console.error('Erreur toggle favori:', error)
            toast.error('Erreur lors de la mise à jour')
        }
    }

    const filteredProjects = projects.filter(project => {
        return (
            project.titre.toLowerCase().includes(filters.search.toLowerCase()) &&
            (filters.category === '' || project.categorie_nom === filters.category) &&
            (filters.region === '' || project.region === filters.region)
        )
    })

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement des projets...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="projects-list-page">

            {/* Header */}
            <div className="bg-primary text-white py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="h2 mb-2">Découvrir les projets</h1>
                            <p className="mb-0">
                                Explorez les innovations sénégalaises et soutenez l'entrepreneuriat local
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            {isAuthenticated && (
                                <Link to="/projets/creer" className="btn btn-light">
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Créer un projet
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                <div className="row">

                    {/* Sidebar filtres */}
                    <div className="col-lg-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-funnel me-2"></i>
                                    Filtres
                                </h5>
                            </div>
                            <div className="card-body">

                                {/* Recherche */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Rechercher</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nom du projet..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                </div>

                                {/* Catégorie */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Catégorie</label>
                                    <select
                                        className="form-select"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    >
                                        <option value="">Toutes les catégories</option>
                                        <option value="Technologie">Technologie</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Éducation">Éducation</option>
                                        <option value="Santé">Santé</option>
                                        <option value="Artisanat">Artisanat</option>
                                    </select>
                                </div>

                                {/* Région */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Région</label>
                                    <select
                                        className="form-select"
                                        value={filters.region}
                                        onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                                    >
                                        <option value="">Toutes les régions</option>
                                        <option value="Dakar">Dakar</option>
                                        <option value="Thiès">Thiès</option>
                                        <option value="Saint-Louis">Saint-Louis</option>
                                        <option value="Tambacounda">Tambacounda</option>
                                    </select>
                                </div>

                                {/* Tri */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Trier par</label>
                                    <select
                                        className="form-select"
                                        value={filters.sort}
                                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                    >
                                        <option value="recent">Plus récents</option>
                                        <option value="popular">Plus populaires</option>
                                        <option value="ending">Fin proche</option>
                                        <option value="funded">Mieux financés</option>
                                    </select>
                                </div>

                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => setFilters({ search: '', category: '', region: '', sort: 'recent' })}
                                >
                                    <i className="bi bi-arrow-clockwise me-2"></i>
                                    Réinitialiser
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Liste des projets */}
                    <div className="col-lg-9">

                        {/* Stats */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="mb-0">
                                {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
                            </h4>
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-outline-secondary active">
                                    <i className="bi bi-grid"></i>
                                </button>
                                <button type="button" className="btn btn-outline-secondary">
                                    <i className="bi bi-list"></i>
                                </button>
                            </div>
                        </div>

                        {/* Grille des projets */}
                        <div className="row">
                            {filteredProjects.map(project => (
                                <div key={project.id} className="col-md-6 mb-4">
                                    <div className="card border-0 shadow-sm h-100">

                                        {/* Image */}
                                        <div className="position-relative">
                                            <img
                                                src={project.image_principale}
                                                className="card-img-top"
                                                alt={project.titre}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
                                                {project.categorie_nom}
                                            </span>
                                            <span className="position-absolute top-0 end-0 m-2 badge bg-success">
                                                {project.pourcentage_atteint}%
                                            </span>
                                        </div>

                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{project.titre}</h5>
                                            <p className="card-text text-muted flex-grow-1">
                                                {project.description_courte}
                                            </p>

                                            {/* Métaannées */}
                                            <div className="mb-3">
                                                <small className="text-muted">
                                                    <i className="bi bi-geo-alt me-1"></i>
                                                    {project.ville}, {project.region}
                                                </small>
                                                <br />
                                                <small className="text-muted">
                                                    <i className="bi bi-person me-1"></i>
                                                    Par {project.porteur_nom}
                                                </small>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mb-3">
                                                <div className="progress mb-2" style={{ height: '8px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: `${Math.min(project.pourcentage_atteint, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="row text-center small">
                                                    <div className="col-4">
                                                        <strong className="text-success">
                                                            {(project.montant_collecte / 1000000).toFixed(1)}M
                                                        </strong>
                                                        <br />collectés
                                                    </div>
                                                    <div className="col-4">
                                                        <strong className="text-primary">
                                                            {project.nombre_contributeurs}
                                                        </strong>
                                                        <br />contributeurs
                                                    </div>
                                                    <div className="col-4">
                                                        <strong className="text-warning">
                                                            {project.jours_restants}
                                                        </strong>
                                                        <br />jours restants
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="d-flex gap-2">
                                                <Link
                                                    to={`/projets/${project.id}`}
                                                    className="btn btn-primary flex-grow-1"
                                                >
                                                    Voir le projet
                                                </Link>
                                                <button
                                                    className={`btn ${favoris.includes(project.id) ? 'btn-warning' : 'btn-outline-warning'}`}
                                                    onClick={() => toggleFavoriCard(project.id)}
                                                >
                                                    <i className={`bi ${favoris.includes(project.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                                </button>
                                                <PartageButtons projet={project} variant="modal" className="" />                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {filteredProjects.length > 6 && (
                            <nav className="mt-4">
                                <ul className="pagination justify-content-center">
                                    <li className="page-item disabled">
                                        <span className="page-link">Précédent</span>
                                    </li>
                                    <li className="page-item active">
                                        <span className="page-link">1</span>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">2</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">Suivant</a>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectsListPage