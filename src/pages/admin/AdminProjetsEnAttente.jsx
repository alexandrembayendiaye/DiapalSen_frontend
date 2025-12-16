// Remplacez votre AdminProjetsEnAttente.jsx par cette version :

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminProjetsEnAttente = () => {
    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour les modals (code existant...)
    const [projetSelectionne, setProjetSelectionne] = useState(null);
    const [showModalValidation, setShowModalValidation] = useState(false);
    const [showModalRejet, setShowModalRejet] = useState(false);
    const [showModalInfos, setShowModalInfos] = useState(false);

    // États des formulaires (code existant...)
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
    // ✅ FONCTIONS POUR LES MODALS
    const ouvrirModalValidation = (projet) => {
        setProjetSelectionne(projet);
        setValidationForm({ type_financement: 'flexible_50', commentaire: '' });
        setShowModalValidation(true);
    };

    const ouvrirModalRejet = (projet) => {
        setProjetSelectionne(projet);
        setRejetForm({ motif_rejet: '', commentaire: '' });
        setShowModalRejet(true);
    };

    const ouvrirModalInfos = (projet) => {
        setProjetSelectionne(projet);
        setInfosForm({ demande_informations: '' });
        setShowModalInfos(true);
    };

    // ✅ FONCTION DEMANDER INFOS
    // ✅ FONCTION DEMANDER INFOS
    const demanderInfos = async () => {
        try {
            if (!infosForm.demande_informations.trim()) {
                toast.error('Veuillez préciser les informations demandées');
                return;
            }

            // Appel API pour demander des infos supplémentaires
            await adminService.validerProjet(projetSelectionne.id, {
                decision: 'infos_demandees',
                commentaire: infosForm.demande_informations
            });

            await loadProjetsEnAttente();
            setShowModalInfos(false);
            setProjetSelectionne(null);
            toast.success('Demande d\'informations envoyée au porteur');
        } catch (error) {
            console.error('Erreur demande infos:', error);
            toast.error('Erreur lors de l\'envoi');
        }
    };

    // ✅ FONCTION VALIDER PROJET
    const validerProjet = async () => {
        try {
            if (!validationForm.commentaire.trim()) {
                toast.error('Le commentaire est obligatoire');
                return;
            }

            await adminService.validerProjet(projetSelectionne.id, {
                decision: 'approuve',
                type_financement: validationForm.type_financement,
                commentaire: validationForm.commentaire
            });

            await loadProjetsEnAttente();
            setShowModalValidation(false);
            setProjetSelectionne(null);
            toast.success('Projet validé avec succès !');
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

            await adminService.validerProjet(projetSelectionne.id, {
                decision: 'rejete',
                motif_rejet: rejetForm.motif_rejet,
                commentaire: rejetForm.commentaire
            });

            await loadProjetsEnAttente();
            setShowModalRejet(false);
            setProjetSelectionne(null);
            toast.success('Projet rejeté');
        } catch (error) {
            console.error('Erreur rejet:', error);
            toast.error('Erreur lors du rejet');
        }
    };

    // Fonctions existantes (loadProjetsEnAttente, etc.)
    useEffect(() => {
        loadProjetsEnAttente();
    }, []);

    const loadProjetsEnAttente = async () => {
        try {
            setLoading(true);
            const response = await adminService.getProjetsEnAttente();
            setProjets(response.results || response);
        } catch (err) {
            console.error('Erreur chargement projets:', err);
            setError('Impossible de charger les projets en attente');
        } finally {
            setLoading(false);
        }
    };

    // ... toutes vos fonctions existantes ...

    // Loading/Error states
    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement des projets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button className="btn btn-outline-danger btn-sm ms-3" onClick={loadProjetsEnAttente}>
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4"> {/* ✅ AJOUT CONTAINER */}
            {/* ✅ BREADCRUMB NAVIGATION */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboard" className="text-decoration-none">
                            <i className="bi bi-house me-1"></i>
                            Dashboard
                        </Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/admin/dashboard" className="text-decoration-none">
                            Interface Admin
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Projets en attente
                    </li>
                </ol>
            </nav>

            {/* ✅ HEADER DIAPALSEN STYLE */}
            <div className="row align-items-center mb-4">
                <div className="col-md-8">
                    <div className="d-flex align-items-center">
                        <div className="bg-warning bg-gradient text-dark rounded-3 p-3 me-3 shadow-sm">
                            <i className="bi bi-hourglass-split fs-3"></i>
                        </div>
                        <div>
                            <h1 className="h3 mb-1 text-dark fw-bold">
                                Projets en attente de validation
                            </h1>
                            <p className="text-muted mb-0">
                                <span className="badge bg-warning text-dark fw-bold me-2">
                                    {projets.length}
                                </span>
                                projet{projets.length > 1 ? 's' : ''} nécessite{projets.length > 1 ? 'nt' : ''} votre attention
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 text-md-end">
                    <Link to="/admin/dashboard" className="btn btn-outline-primary">
                        <i className="bi bi-arrow-left me-2"></i>
                        Retour dashboard admin
                    </Link>
                </div>
            </div>

            {/* ✅ LISTE PROJETS AMÉLIORÉE */}
            {projets.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="bg-success bg-gradient rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style={{ width: '80px', height: '80px' }}>
                            <i className="bi bi-check-circle text-white fs-2"></i>
                        </div>
                        <h4 className="text-success mb-2">Excellent travail ! 🎉</h4>
                        <p className="text-muted mb-4">
                            Tous les projets soumis ont été traités avec succès.
                        </p>
                        <Link to="/admin/dashboard" className="btn btn-primary">
                            <i className="bi bi-speedometer2 me-2"></i>
                            Retour dashboard
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0 text-dark">
                                <i className="bi bi-list-check me-2 text-primary"></i>
                                Projets à traiter
                            </h5>
                            <div className="d-flex align-items-center">
                                <span className="badge bg-primary me-2">{projets.length} en attente</span>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={loadProjetsEnAttente}
                                    title="Actualiser"
                                >
                                    <i className="bi bi-arrow-clockwise"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 ps-4 fw-bold text-dark">Projet</th>
                                    <th className="border-0 fw-bold text-dark">Porteur</th>
                                    <th className="border-0 fw-bold text-dark">Catégorie</th>
                                    <th className="border-0 fw-bold text-dark">Objectif</th>
                                    <th className="border-0 fw-bold text-dark">Soumis le</th>
                                    <th className="border-0 text-center pe-4 fw-bold text-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projets.map(projet => (
                                    <tr key={projet.id} className="border-bottom">
                                        <td className="ps-4 py-3">
                                            <div>
                                                <h6 className="mb-1 fw-bold text-dark">{projet.titre}</h6>
                                                <p className="mb-1 text-muted small" style={{ maxWidth: '280px' }}>
                                                    {projet.description_courte?.substring(0, 85)}
                                                    {projet.description_courte?.length > 85 ? '...' : ''}
                                                </p>
                                                <div className="d-flex align-items-center text-muted small">
                                                    <i className="bi bi-geo-alt me-1 text-primary"></i>
                                                    <span>{projet.ville || 'N/A'}, {projet.region || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle bg-gradient bg-primary text-white d-flex align-items-center justify-content-center me-2 shadow-sm"
                                                    style={{ width: '40px', height: '40px', fontSize: '16px', fontWeight: 'bold' }}>
                                                    {(projet.porteur_nom || projet.porteur?.first_name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-medium text-dark">
                                                        {projet.porteur_nom || projet.porteur?.first_name || 'Utilisateur'}
                                                    </div>
                                                    <small className="text-muted">
                                                        {projet.porteur?.email || 'N/A'}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2" style={{ fontSize: '1.2rem' }}>
                                                    {projet.categorie_icone || '📂'}
                                                </span>
                                                <span className="text-dark fw-medium">
                                                    {projet.categorie_nom || projet.categorie?.nom || 'Non définie'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="text-success fw-bold">
                                                {(projet.montant_objectif || 0).toLocaleString()}
                                            </div>
                                            <small className="text-muted">FCFA</small>
                                        </td>
                                        <td className="py-3">
                                            <div className="text-dark">
                                                {new Date(projet.date_creation).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            <small className="text-muted">
                                                {new Date(projet.date_creation).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </small>
                                        </td>
                                        <td className="text-center pe-4 py-3">
                                            <div className="btn-group" role="group">
                                                <Link
                                                    to={`/admin/projets/${projet.id}/detail`}
                                                    className="btn btn-sm btn-info shadow-sm"
                                                    title="Voir les détails du projet"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-success shadow-sm"
                                                    onClick={() => ouvrirModalValidation(projet)}
                                                    title="Valider le projet"
                                                >
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-warning shadow-sm"
                                                    onClick={() => ouvrirModalInfos(projet)}
                                                    title="Demander des informations supplémentaires"
                                                >
                                                    <i className="bi bi-question-circle"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger shadow-sm"
                                                    onClick={() => ouvrirModalRejet(projet)}
                                                    title="Rejeter le projet"
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Vos modals existants... */}
            {showModalInfos && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-dark">
                                <h5 className="modal-title">
                                    <i className="bi bi-question-circle me-2"></i>
                                    Demander des informations : {projetSelectionne?.titre}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowModalInfos(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-info">
                                    <i className="bi bi-info-circle me-2"></i>
                                    <strong>Le porteur sera notifié</strong> et devra fournir les informations demandées avant une nouvelle validation.
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Informations requises *</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        value={infosForm.demande_informations}
                                        onChange={(e) => setInfosForm({
                                            demande_informations: e.target.value
                                        })}
                                        placeholder="Précisez les informations manquantes ou les clarifications nécessaires..."
                                    />
                                    <small className="text-muted">Soyez précis pour aider le porteur à compléter son dossier</small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModalInfos(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="btn btn-warning"
                                    onClick={demanderInfos}
                                    disabled={!infosForm.demande_informations.trim()}
                                >
                                    <i className="bi bi-send me-2"></i>
                                    Envoyer la demande
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS VALIDATION ET REJET (code existant...) */}
            {showModalValidation && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-check-lg me-2"></i>
                                    Valider le projet : {projetSelectionne?.titre}
                                </h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModalValidation(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Type de financement *</label>
                                    <select
                                        className="form-select"
                                        value={validationForm.type_financement}
                                        onChange={(e) => setValidationForm({
                                            ...validationForm,
                                            type_financement: e.target.value
                                        })}
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
                                        onChange={(e) => setValidationForm({
                                            ...validationForm,
                                            commentaire: e.target.value
                                        })}
                                        placeholder="Expliquez pourquoi ce projet est validé..."
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModalValidation(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={validerProjet}
                                    disabled={!validationForm.commentaire.trim()}
                                >
                                    <i className="bi bi-check-lg me-2"></i>
                                    Valider définitivement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL REJET (code existant) */}
            {showModalRejet && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-x-lg me-2"></i>
                                    Rejeter le projet : {projetSelectionne?.titre}
                                </h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModalRejet(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Motif de rejet *</label>
                                    <select
                                        className="form-select"
                                        value={rejetForm.motif_rejet}
                                        onChange={(e) => setRejetForm({
                                            ...rejetForm,
                                            motif_rejet: e.target.value
                                        })}
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
                                        onChange={(e) => setRejetForm({
                                            ...rejetForm,
                                            commentaire: e.target.value
                                        })}
                                        placeholder="Expliquez les raisons du rejet..."
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModalRejet(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={rejeterProjet}
                                    disabled={!rejetForm.motif_rejet || !rejetForm.commentaire.trim()}
                                >
                                    <i className="bi bi-x-lg me-2"></i>
                                    Rejeter définitivement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProjetsEnAttente;