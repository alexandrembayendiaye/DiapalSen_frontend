// src/pages/admin/AdminProjetDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import projectsService from '../../services/projectsService';
import adminService from '../../services/adminService';
import { formatMontant } from '../../utils/formatUtils';
import { getProjectDetailImage } from '../../utils/imageUtils';

const AdminProjetDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [projet, setProjet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour les modals
    const [showModalValidation, setShowModalValidation] = useState(false);
    const [showModalRejet, setShowModalRejet] = useState(false);
    const [showModalInfos, setShowModalInfos] = useState(false);

    // États des formulaires
    const [validationForm, setValidationForm] = useState({
        type_financement: 'flexible_50',
        commentaire: ''
    });
    const [rejetForm, setRejetForm] = useState({
        motif_rejet: '',
        commentaire: ''
    });
    const [infosForm, setInfosForm] = useState({
        demande_informations: ''
    });

    useEffect(() => {
        loadProjet();
    }, [projectId]);

    const loadProjet = async () => {
        try {
            setLoading(true);
            const data = await projectsService.getProject(projectId);
            setProjet(data);
        } catch (err) {
            console.error('Erreur chargement projet:', err);
            setError('Impossible de charger le projet');
        } finally {
            setLoading(false);
        }
    };

    // ✅ FONCTION VALIDER PROJET
    const validerProjet = async () => {
        try {
            if (!validationForm.commentaire.trim()) {
                toast.error('Le commentaire est obligatoire');
                return;
            }

            await adminService.validerProjet(projet.id, {
                decision: 'approuve',
                type_financement: validationForm.type_financement,
                commentaire: validationForm.commentaire
            });

            setShowModalValidation(false);
            toast.success('Projet validé avec succès !');
            navigate('/admin/projets/en-attente');
        } catch (error) {
            console.error('Erreur validation:', error);
            toast.error('Erreur lors de la validation');
        }
    };

    // ✅ FONCTION REJETER PROJET
    const rejeterProjet = async () => {
        try {
            if (!rejetForm.motif_rejet.trim() || !rejetForm.commentaire.trim()) {
                toast.error('Le motif de rejet et le commentaire sont obligatoires');
                return;
            }

            await adminService.validerProjet(projet.id, {
                decision: 'rejete',
                motif_rejet: rejetForm.motif_rejet,
                commentaire: rejetForm.commentaire
            });

            setShowModalRejet(false);
            toast.success('Projet rejeté');
            navigate('/admin/projets/en-attente');
        } catch (error) {
            console.error('Erreur rejet:', error);
            toast.error('Erreur lors du rejet');
        }
    };

    // ✅ FONCTION DEMANDER INFOS
    const demanderInfos = async () => {
        try {
            if (!infosForm.demande_informations.trim()) {
                toast.error('Veuillez préciser les informations demandées');
                return;
            }

            await adminService.validerProjet(projet.id, {
                decision: 'infos_demandees',
                commentaire: infosForm.demande_informations
            });

            setShowModalInfos(false);
            toast.success('Demande d\'informations envoyée au porteur');
            navigate('/admin/projets/en-attente');
        } catch (error) {
            console.error('Erreur demande infos:', error);
            toast.error('Erreur lors de l\'envoi');
        }
    };

    const getStatutBadge = (statut) => {
        const badges = {
            'brouillon': 'bg-secondary',
            'en_attente': 'bg-warning text-dark',
            'actif': 'bg-success',
            'termine': 'bg-info',
            'rejete': 'bg-danger',
            'modification_demandee': 'bg-orange text-dark'
        };
        const labels = {
            'brouillon': 'Brouillon',
            'en_attente': 'En attente de validation',
            'actif': 'Actif',
            'termine': 'Terminé',
            'rejete': 'Rejeté',
            'modification_demandee': 'Modification demandée'
        };
        return <span className={`badge ${badges[statut] || 'bg-secondary'}`}>{labels[statut] || statut}</span>;
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement du projet...</p>
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
                    <Link to="/admin/projets/en-attente" className="btn btn-outline-danger btn-sm ms-3">
                        Retour
                    </Link>
                </div>
            </div>
        );
    }
    const imagePrincipale = getProjectDetailImage(projet.image_principale, projet.titre);

    // Vérifier si le projet a déjà été traité
    const projetDejaTraite = projet.statut !== 'en_attente';

    return (
        <div className="container py-4">
            {/* Alerte si projet déjà traité */}
            {projetDejaTraite && (
                <div className="alert alert-info mb-4">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-info-circle fs-4 me-3"></i>
                        <div>
                            <h5 className="mb-1">Ce projet a déjà été traité</h5>
                            <p className="mb-0">
                                Statut actuel : {getStatutBadge(projet.statut)}
                                <span className="ms-2">- Les actions de validation ne sont plus disponibles.</span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <Link to="/admin/projets/en-attente" className="btn btn-primary btn-sm me-2">
                            <i className="bi bi-arrow-left me-1"></i>
                            Voir les projets en attente
                        </Link>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboard" className="text-decoration-none">
                            <i className="bi bi-house me-1"></i>Admin
                        </Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/admin/projets/en-attente" className="text-decoration-none">
                            Projets en attente
                        </Link>
                    </li>
                    <li className="breadcrumb-item active">{projet.titre}</li>
                </ol>
            </nav>

            {/* Header avec actions */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <div className="d-flex align-items-center mb-2">
                                {getStatutBadge(projet.statut)}
                                <span className="ms-2 text-muted">
                                    ID: #{projet.id}
                                </span>
                            </div>
                            <h1 className="h3 mb-2 fw-bold">{projet.titre}</h1>
                            <p className="text-muted mb-0">{projet.description_courte}</p>
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                            {projet.statut === 'en_attente' && (
                                <div className="btn-group">
                                    <button
                                        className="btn btn-success"
                                        onClick={() => setShowModalValidation(true)}
                                    >
                                        <i className="bi bi-check-lg me-2"></i>Valider
                                    </button>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => setShowModalInfos(true)}
                                    >
                                        <i className="bi bi-question-circle me-2"></i>Demander infos
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => setShowModalRejet(true)}
                                    >
                                        <i className="bi bi-x-lg me-2"></i>Rejeter
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Colonne principale */}
                <div className="col-lg-8">
                    {/* Image du projet */}
                    <div className="card border-0 shadow-sm mb-4">
                        <img
                            src={imagePrincipale}
                            alt={projet.titre}
                            className="card-img-top"
                            style={{ height: '350px', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Description complète */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="bi bi-file-text me-2 text-primary"></i>
                                Description complète
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="prose" style={{ whiteSpace: 'pre-wrap' }}>
                                {projet.description_complete || projet.description_courte}
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="bi bi-folder me-2 text-primary"></i>
                                Documents fournis
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="border rounded p-3 h-100">
                                        <h6><i className="bi bi-file-earmark-spreadsheet me-2"></i>Budget</h6>
                                        {projet.document_budget ? (
                                            <a href={projet.document_budget} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                                                <i className="bi bi-download me-1"></i>Télécharger
                                            </a>
                                        ) : (
                                            <span className="text-muted">Non fourni</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="border rounded p-3 h-100">
                                        <h6><i className="bi bi-file-earmark-text me-2"></i>Business Plan</h6>
                                        {projet.document_business_plan ? (
                                            <a href={projet.document_business_plan} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                                                <i className="bi bi-download me-1"></i>Télécharger
                                            </a>
                                        ) : (
                                            <span className="text-muted">Non fourni</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4">
                    {/* Informations du porteur */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="bi bi-person me-2 text-primary"></i>
                                Porteur du projet
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                    style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>
                                    {(projet.porteur?.nom_complet || projet.porteur_nom || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h6 className="mb-1 fw-bold">{projet.porteur?.nom_complet || projet.porteur_nom || 'Utilisateur'}</h6>
                                    <small className="text-muted">
                                        <i className="bi bi-envelope me-1"></i>
                                        {projet.porteur?.email || projet.porteur_email || 'Email non disponible'}
                                    </small>
                                </div>
                            </div>
                            {(projet.porteur?.telephone || projet.porteur_telephone) && (
                                <p className="mb-1">
                                    <i className="bi bi-telephone me-2 text-muted"></i>
                                    {projet.porteur?.telephone || projet.porteur_telephone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Détails du projet */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="bi bi-info-circle me-2 text-primary"></i>
                                Détails du projet
                            </h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0">
                                <li className="mb-3">
                                    <small className="text-muted d-block">Catégorie</small>
                                    <span className="fw-medium">
                                        {projet.categorie?.icone || projet.categorie_icone} {projet.categorie?.nom || projet.categorie_nom || 'Non définie'}
                                    </span>
                                </li>
                                <li className="mb-3">
                                    <small className="text-muted d-block">Localisation</small>
                                    <span className="fw-medium">
                                        <i className="bi bi-geo-alt me-1"></i>
                                        {projet.ville || 'N/A'}, {projet.region || 'N/A'}
                                    </span>
                                </li>
                                <li className="mb-3">
                                    <small className="text-muted d-block">Objectif de financement</small>
                                    <span className="fw-bold text-success fs-5">
                                        {formatMontant(projet.montant_objectif)}
                                    </span>
                                </li>
                                <li className="mb-3">
                                    <small className="text-muted d-block">Durée de campagne</small>
                                    <span className="fw-medium">
                                        {projet.duree_campagne_jours || 30} jours
                                    </span>
                                </li>
                                <li className="mb-3">
                                    <small className="text-muted d-block">Date de création</small>
                                    <span className="fw-medium">
                                        {new Date(projet.date_creation).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </li>
                                {projet.video_url && (
                                    <li className="mb-3">
                                        <small className="text-muted d-block">Vidéo de présentation</small>
                                        <a href={projet.video_url} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                                            <i className="bi bi-play-circle me-1"></i>Voir la vidéo
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <Link to="/admin/projets/en-attente" className="btn btn-outline-secondary w-100">
                                <i className="bi bi-arrow-left me-2"></i>
                                Retour à la liste
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL VALIDATION */}
            {
                showModalValidation && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header bg-success text-white">
                                    <h5 className="modal-title">
                                        <i className="bi bi-check-lg me-2"></i>
                                        Valider le projet : {projet.titre}
                                    </h5>
                                    <button className="btn-close btn-close-white" onClick={() => setShowModalValidation(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Type de financement *</label>
                                        <select
                                            className="form-select"
                                            value={validationForm.type_financement}
                                            onChange={(e) => setValidationForm({ ...validationForm, type_financement: e.target.value })}
                                        >
                                            <option value="tout_ou_rien">Tout ou rien (100% requis)</option>
                                            <option value="flexible_50">Flexible 50% (minimum 50%)</option>
                                            <option value="solidaire">Solidaire (tout montant accepté)</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Commentaire de validation *</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={validationForm.commentaire}
                                            onChange={(e) => setValidationForm({ ...validationForm, commentaire: e.target.value })}
                                            placeholder="Expliquez pourquoi ce projet est validé..."
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModalValidation(false)}>Annuler</button>
                                    <button className="btn btn-success" onClick={validerProjet} disabled={!validationForm.commentaire.trim()}>
                                        <i className="bi bi-check-lg me-2"></i>Valider définitivement
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* MODAL DEMANDE INFOS */}
            {
                showModalInfos && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header bg-warning text-dark">
                                    <h5 className="modal-title">
                                        <i className="bi bi-question-circle me-2"></i>
                                        Demander des informations : {projet.titre}
                                    </h5>
                                    <button className="btn-close" onClick={() => setShowModalInfos(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="alert alert-info">
                                        <i className="bi bi-info-circle me-2"></i>
                                        <strong>Le porteur sera notifié</strong> et devra fournir les informations demandées.
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Informations requises *</label>
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                            value={infosForm.demande_informations}
                                            onChange={(e) => setInfosForm({ demande_informations: e.target.value })}
                                            placeholder="Précisez les informations manquantes..."
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModalInfos(false)}>Annuler</button>
                                    <button className="btn btn-warning" onClick={demanderInfos} disabled={!infosForm.demande_informations.trim()}>
                                        <i className="bi bi-send me-2"></i>Envoyer la demande
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* MODAL REJET */}
            {
                showModalRejet && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <i className="bi bi-x-lg me-2"></i>
                                        Rejeter le projet : {projet.titre}
                                    </h5>
                                    <button className="btn-close btn-close-white" onClick={() => setShowModalRejet(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Motif de rejet *</label>
                                        <select
                                            className="form-select"
                                            value={rejetForm.motif_rejet}
                                            onChange={(e) => setRejetForm({ ...rejetForm, motif_rejet: e.target.value })}
                                        >
                                            <option value="">-- Sélectionner un motif --</option>
                                            <option value="contenu_inapproprie">Contenu inapproprié</option>
                                            <option value="informations_incompletes">Informations incomplètes</option>
                                            <option value="projet_non_viable">Projet non viable</option>
                                            <option value="documents_manquants">Documents manquants</option>
                                            <option value="non_conforme_conditions">Non conforme aux conditions</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Commentaire détaillé *</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={rejetForm.commentaire}
                                            onChange={(e) => setRejetForm({ ...rejetForm, commentaire: e.target.value })}
                                            placeholder="Expliquez les raisons du rejet..."
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModalRejet(false)}>Annuler</button>
                                    <button className="btn btn-danger" onClick={rejeterProjet} disabled={!rejetForm.motif_rejet || !rejetForm.commentaire.trim()}>
                                        <i className="bi bi-x-lg me-2"></i>Rejeter définitivement
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminProjetDetail;
