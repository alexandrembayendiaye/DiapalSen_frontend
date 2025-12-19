import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminHistoriquePage = () => {
    const [validations, setValidations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtreDecision, setFiltreDecision] = useState('tous');

    useEffect(() => {
        loadHistorique();
    }, []);

    const loadHistorique = async () => {
        try {
            setLoading(true);
            const response = await adminService.getHistoriqueValidations();
            setValidations(response.validations || []);
        } catch (err) {
            console.error('Erreur chargement historique:', err);
            setError('Impossible de charger l\'historique des validations');
            toast.error('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    // Filtrer les validations
    const validationsFiltrees = validations.filter(v => {
        if (filtreDecision === 'tous') return true;
        return v.decision === filtreDecision;
    });

    // Badge couleur selon la décision
    const getBadgeClass = (decision) => {
        switch (decision) {
            case 'approuve':
                return 'bg-success';
            case 'rejete':
                return 'bg-danger';
            case 'infos_demandees':
                return 'bg-warning text-dark';
            default:
                return 'bg-secondary';
        }
    };

    // Icône selon la décision
    const getDecisionIcon = (decision) => {
        switch (decision) {
            case 'approuve':
                return 'bi-check-circle-fill text-success';
            case 'rejete':
                return 'bi-x-circle-fill text-danger';
            case 'infos_demandees':
                return 'bi-question-circle-fill text-warning';
            default:
                return 'bi-dash-circle';
        }
    };

    // Libellé de la décision
    const getDecisionLabel = (decision) => {
        switch (decision) {
            case 'approuve':
                return 'Approuvé';
            case 'rejete':
                return 'Rejeté';
            case 'infos_demandees':
                return 'Infos demandées';
            default:
                return decision;
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement de l'historique...</p>
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
                    <button className="btn btn-outline-danger btn-sm ms-3" onClick={loadHistorique}>
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboard" className="text-decoration-none">
                            <i className="bi bi-house me-1"></i>
                            Dashboard
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Historique des validations
                    </li>
                </ol>
            </nav>

            {/* Header */}
            <div className="row align-items-center mb-4">
                <div className="col-md-8">
                    <div className="d-flex align-items-center">
                        <div className="bg-info bg-gradient text-white rounded-3 p-3 me-3 shadow-sm">
                            <i className="bi bi-clock-history fs-3"></i>
                        </div>
                        <div>
                            <h1 className="h3 mb-1 text-dark fw-bold">
                                Historique des Validations
                            </h1>
                            <p className="text-muted mb-0">
                                <span className="badge bg-info me-2">{validations.length}</span>
                                action{validations.length > 1 ? 's' : ''} enregistrée{validations.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 text-md-end">
                    <Link to="/dashboard" className="btn btn-outline-primary">
                        <i className="bi bi-arrow-left me-2"></i>
                        Retour dashboard
                    </Link>
                </div>
            </div>

            {/* Filtres */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body py-3">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <label className="form-label mb-0 me-2 text-muted">
                                <i className="bi bi-funnel me-1"></i>
                                Filtrer par décision :
                            </label>
                        </div>
                        <div className="col-md-6">
                            <div className="btn-group w-100" role="group">
                                <button
                                    className={`btn ${filtreDecision === 'tous' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setFiltreDecision('tous')}
                                >
                                    Tous ({validations.length})
                                </button>
                                <button
                                    className={`btn ${filtreDecision === 'approuve' ? 'btn-success' : 'btn-outline-success'}`}
                                    onClick={() => setFiltreDecision('approuve')}
                                >
                                    <i className="bi bi-check-circle me-1"></i>
                                    Approuvés ({validations.filter(v => v.decision === 'approuve').length})
                                </button>
                                <button
                                    className={`btn ${filtreDecision === 'rejete' ? 'btn-danger' : 'btn-outline-danger'}`}
                                    onClick={() => setFiltreDecision('rejete')}
                                >
                                    <i className="bi bi-x-circle me-1"></i>
                                    Rejetés ({validations.filter(v => v.decision === 'rejete').length})
                                </button>
                                <button
                                    className={`btn ${filtreDecision === 'infos_demandees' ? 'btn-warning' : 'btn-outline-warning'}`}
                                    onClick={() => setFiltreDecision('infos_demandees')}
                                >
                                    <i className="bi bi-question-circle me-1"></i>
                                    Infos ({validations.filter(v => v.decision === 'infos_demandees').length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des validations */}
            {validationsFiltrees.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-inbox fs-1 text-muted"></i>
                        <h5 className="mt-3 text-muted">Aucune validation trouvée</h5>
                        <p className="text-muted">
                            {filtreDecision !== 'tous'
                                ? 'Aucune validation ne correspond à ce filtre'
                                : 'Aucune action de validation n\'a encore été effectuée'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-list-ul me-2 text-primary"></i>
                                Historique ({validationsFiltrees.length})
                            </h5>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={loadHistorique}
                                title="Actualiser"
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>

                    <div className="list-group list-group-flush">
                        {validationsFiltrees.map((validation) => (
                            <div key={validation.id} className="list-group-item py-3">
                                <div className="row align-items-center">
                                    {/* Icône décision */}
                                    <div className="col-auto">
                                        <div className="fs-3">
                                            <i className={`bi ${getDecisionIcon(validation.decision)}`}></i>
                                        </div>
                                    </div>

                                    {/* Infos principale */}
                                    <div className="col">
                                        <div className="d-flex align-items-center mb-1">
                                            <h6 className="mb-0 me-2 fw-bold">
                                                {validation.projet_titre || 'Projet inconnu'}
                                            </h6>
                                            <span className={`badge ${getBadgeClass(validation.decision)}`}>
                                                {getDecisionLabel(validation.decision)}
                                            </span>
                                        </div>
                                        <p className="mb-1 text-muted small">
                                            {validation.commentaire?.substring(0, 150)}
                                            {validation.commentaire?.length > 150 ? '...' : ''}
                                        </p>
                                        {validation.motif_rejet && (
                                            <p className="mb-0 text-danger small">
                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                Motif : {validation.motif_rejet}
                                            </p>
                                        )}
                                        {validation.type_financement_choisi && (
                                            <p className="mb-0 text-success small">
                                                <i className="bi bi-cash-stack me-1"></i>
                                                Type financement : {validation.type_financement_choisi}
                                            </p>
                                        )}
                                    </div>

                                    {/* Infos admin et date */}
                                    <div className="col-md-3 text-md-end">
                                        <div className="small text-muted">
                                            <div className="mb-1">
                                                <i className="bi bi-person-badge me-1"></i>
                                                {validation.administrateur_nom || 'Admin'}
                                            </div>
                                            <div>
                                                <i className="bi bi-calendar me-1"></i>
                                                {new Date(validation.date_validation).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="col-auto">
                                        <Link
                                            to={`/projets/${validation.projet}`}
                                            className="btn btn-sm btn-outline-info"
                                            title="Voir le projet"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Statistiques résumé */}
            <div className="row mt-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-success bg-opacity-10">
                        <div className="card-body text-center">
                            <h3 className="text-success mb-0">
                                {validations.filter(v => v.decision === 'approuve').length}
                            </h3>
                            <small className="text-muted">Projets approuvés</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-danger bg-opacity-10">
                        <div className="card-body text-center">
                            <h3 className="text-danger mb-0">
                                {validations.filter(v => v.decision === 'rejete').length}
                            </h3>
                            <small className="text-muted">Projets rejetés</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
                        <div className="card-body text-center">
                            <h3 className="text-warning mb-0">
                                {validations.filter(v => v.decision === 'infos_demandees').length}
                            </h3>
                            <small className="text-muted">Infos demandées</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHistoriquePage;
