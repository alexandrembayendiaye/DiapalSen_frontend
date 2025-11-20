// src/pages/admin/AdminProjetsEnAttente.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

const AdminProjetsEnAttente = () => {
    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // État pour les modals
    const [projetSelectionne, setProjetSelectionne] = useState(null);
    const [showModalValidation, setShowModalValidation] = useState(false);
    const [showModalRejet, setShowModalRejet] = useState(false);

    // États des formulaires
    const [validationForm, setValidationForm] = useState({
        type_financement: 'flexible_50',
        commentaire: ''
    });
    const [rejetForm, setRejetForm] = useState({
        motif_rejet: '',
        commentaire: ''
    });

    useEffect(() => {
        loadProjetsEnAttente();
    }, []);

    const loadProjetsEnAttente = async () => {
        try {
            setLoading(true);
            const response = await adminService.getProjetsEnAttente();
            setProjets(response.results || response); // Adaptation selon la structure API
        } catch (err) {
            console.error('Erreur chargement projets:', err);
            setError('Impossible de charger les projets en attente');
        } finally {
            setLoading(false);
        }
    };

    // Ouvrir modal validation
    const ouvrirModalValidation = (projet) => {
        setProjetSelectionne(projet);
        setValidationForm({
            type_financement: 'flexible_50',
            commentaire: ''
        });
        setShowModalValidation(true);
    };

    // Ouvrir modal rejet
    const ouvrirModalRejet = (projet) => {
        setProjetSelectionne(projet);
        setRejetForm({
            motif_rejet: '',
            commentaire: ''
        });
        setShowModalRejet(true);
    };

    // Valider projet
    const validerProjet = async () => {
        try {
            if (!validationForm.commentaire.trim()) {
                alert('Le commentaire est obligatoire');
                return;
            }

            await adminService.validerProjet(projetSelectionne.id, {
                decision: 'approuve',
                type_financement: validationForm.type_financement,
                commentaire: validationForm.commentaire
            });

            // Refresh la liste
            await loadProjetsEnAttente();

            // Fermer modal
            setShowModalValidation(false);
            setProjetSelectionne(null);

            alert('✅ Projet validé avec succès !');
        } catch (error) {
            console.error('Erreur validation:', error);
            alert('❌ Erreur lors de la validation');
        }
    };

    // Rejeter projet
    const rejeterProjet = async () => {
        try {
            if (!rejetForm.motif_rejet.trim() || !rejetForm.commentaire.trim()) {
                alert('Le motif de rejet et le commentaire sont obligatoires');
                return;
            }

            await adminService.validerProjet(projetSelectionne.id, {
                decision: 'rejete',
                motif_rejet: rejetForm.motif_rejet,
                commentaire: rejetForm.commentaire
            });

            // Refresh la liste
            await loadProjetsEnAttente();

            // Fermer modal
            setShowModalRejet(false);
            setProjetSelectionne(null);

            alert('✅ Projet rejeté');
        } catch (error) {
            console.error('Erreur rejet:', error);
            alert('❌ Erreur lors du rejet');
        }
    };

    // Loading state
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

    // Error state
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
        <div className="admin-projets-en-attente">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">⏳ Projets en attente de validation</h1>
                    <p className="text-muted mb-0">
                        {projets.length} projet{projets.length > 1 ? 's' : ''} à traiter
                    </p>
                </div>
                <Link to="/admin/dashboard" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour dashboard
                </Link>
            </div>

            {/* Liste des projets */}
            {projets.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                        <h4 className="mt-3">Aucun projet en attente !</h4>
                        <p className="text-muted">Tous les projets soumis ont été traités.</p>
                        <Link to="/admin/dashboard" className="btn btn-primary">
                            Retour dashboard
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {projets.map(projet => (
                        <div key={projet.id} className="col-lg-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">{projet.titre}</h5>
                                    <span className="badge bg-warning">En attente</span>
                                </div>

                                <div className="card-body">
                                    <div className="mb-3">
                                        <small className="text-muted">Porteur</small>
                                        <div className="fw-medium">{projet.porteur_nom}</div>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted">Catégorie</small>
                                        <div>
                                            <span className="me-1">{projet.categorie_icone}</span>
                                            {projet.categorie_nom}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted">Objectif de financement</small>
                                        <div className="fw-bold text-primary">
                                            {(projet.montant_objectif || 0).toLocaleString()} FCFA
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted">Localisation</small>
                                        <div>📍 {projet.ville}, {projet.region}</div>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted">Description</small>
                                        <p className="small">
                                            {projet.description_courte?.substring(0, 120)}
                                            {projet.description_courte?.length > 120 ? '...' : ''}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted">Soumis le</small>
                                        <div className="small">
                                            {new Date(projet.date_creation).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer bg-light">
                                    <div className="d-grid gap-2">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => ouvrirModalValidation(projet)}
                                        >
                                            <i className="bi bi-check-lg me-2"></i>
                                            Valider le projet
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => ouvrirModalRejet(projet)}
                                        >
                                            <i className="bi bi-x-lg me-2"></i>
                                            Rejeter le projet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Validation */}
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
                                    <small className="text-muted">Choisissez le type de financement approprié</small>
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
                                        placeholder="Expliquez pourquoi ce projet est validé et donnez des conseils au porteur..."
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

            {/* Modal Rejet */}
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
                                        placeholder="Expliquez en détail les raisons du rejet et donnez des conseils d'amélioration..."
                                    />
                                    <small className="text-muted">Soyez constructif pour aider le porteur à améliorer son projet</small>
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