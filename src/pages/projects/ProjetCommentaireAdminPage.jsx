// src/pages/projects/ProjetCommentaireAdminPage.jsx
// Page pour afficher les commentaires de l'admin sur un projet (rejet ou demande de modification)
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import projectsService from '../../services/projectsService';
import toast from 'react-hot-toast';

const ProjetCommentaireAdminPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [projet, setProjet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('Veuillez vous connecter');
            navigate('/login');
            return;
        }
        loadProjet();
    }, [projectId, isAuthenticated]);

    const loadProjet = async () => {
        try {
            setLoading(true);
            // Utiliser l'API mes-projets pour récupérer le projet du porteur
            const response = await projectsService.getMesProjets();
            const mesProjets = response.results || [];
            const projetTrouve = mesProjets.find(p => p.id === parseInt(projectId));

            if (!projetTrouve) {
                setError('Projet non trouvé ou vous n\'êtes pas le propriétaire');
                return;
            }

            setProjet(projetTrouve);
        } catch (err) {
            console.error('Erreur chargement projet:', err);
            setError('Impossible de charger le projet');
        } finally {
            setLoading(false);
        }
    };

    const getStatutInfo = (statut) => {
        switch (statut) {
            case 'rejete':
                return {
                    titre: 'Projet rejeté',
                    icon: 'bi-x-circle',
                    bgColor: 'bg-danger',
                    textColor: 'text-white',
                    alertType: 'alert-danger'
                };
            case 'modification_demandee':
                return {
                    titre: 'Modification demandée',
                    icon: 'bi-pencil-square',
                    bgColor: 'bg-warning',
                    textColor: 'text-dark',
                    alertType: 'alert-warning'
                };
            default:
                return {
                    titre: 'Commentaire de l\'admin',
                    icon: 'bi-chat-text',
                    bgColor: 'bg-info',
                    textColor: 'text-white',
                    alertType: 'alert-info'
                };
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error || !projet) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error || 'Projet non trouvé'}
                    <Link to="/mes-projets" className="btn btn-outline-danger btn-sm ms-3">
                        Retour à mes projets
                    </Link>
                </div>
            </div>
        );
    }

    const statutInfo = getStatutInfo(projet.statut);

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/mes-projets" className="text-decoration-none">
                            <i className="bi bi-folder me-1"></i>Mes Projets
                        </Link>
                    </li>
                    <li className="breadcrumb-item active">{projet.titre}</li>
                </ol>
            </nav>

            {/* Card principale */}
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow">
                        {/* Header */}
                        <div className={`card-header ${statutInfo.bgColor} ${statutInfo.textColor} py-4`}>
                            <div className="d-flex align-items-center">
                                <i className={`bi ${statutInfo.icon} fs-1 me-3`}></i>
                                <div>
                                    <h4 className="mb-1">{statutInfo.titre}</h4>
                                    <p className="mb-0 opacity-75">{projet.titre}</p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="card-body p-4">
                            {/* Commentaire de l'admin */}
                            <div className="alert alert-light border mb-4">
                                <h5 className="mb-3">
                                    <i className="bi bi-person-badge me-2 text-primary"></i>
                                    Commentaire de l'administrateur :
                                </h5>
                                <div className="bg-white p-3 rounded border" style={{ whiteSpace: 'pre-wrap' }}>
                                    {projet.commentaire_admin || 'Aucun commentaire disponible.'}
                                </div>
                            </div>

                            {/* Motif détaillé (si présent) */}
                            {projet.motif_rejet && (
                                <div className={`alert ${statutInfo.alertType} mb-4`}>
                                    <h5 className="mb-3">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Motif détaillé :
                                    </h5>
                                    <div className="bg-white p-3 rounded border" style={{ whiteSpace: 'pre-wrap' }}>
                                        {projet.motif_rejet}
                                    </div>
                                </div>
                            )}

                            {/* Actions selon le statut */}
                            {projet.statut === 'modification_demandee' && (
                                <>
                                    <div className="alert alert-info">
                                        <i className="bi bi-lightbulb me-2"></i>
                                        <strong>Conseil :</strong> Prenez en compte les remarques de l'administrateur
                                        pour modifier votre projet, puis resoumettez-le pour une nouvelle validation.
                                    </div>

                                    <div className="d-flex gap-3 justify-content-center mt-4">
                                        <Link
                                            to={`/projets/${projet.id}/modifier`}
                                            className="btn btn-warning btn-lg"
                                        >
                                            <i className="bi bi-pencil me-2"></i>
                                            Modifier le projet
                                        </Link>
                                        <Link
                                            to="/mes-projets"
                                            className="btn btn-outline-secondary btn-lg"
                                        >
                                            <i className="bi bi-arrow-left me-2"></i>
                                            Retour
                                        </Link>
                                    </div>
                                </>
                            )}

                            {projet.statut === 'rejete' && (
                                <>
                                    <div className="alert alert-secondary">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Ce projet a été définitivement rejeté. Si vous pensez que c'est une erreur,
                                        veuillez contacter l'administration.
                                    </div>

                                    <div className="text-center mt-4">
                                        <Link
                                            to="/mes-projets"
                                            className="btn btn-outline-secondary btn-lg"
                                        >
                                            <i className="bi bi-arrow-left me-2"></i>
                                            Retour à mes projets
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjetCommentaireAdminPage;
