// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
    const { user, getFullName, getInitials } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const response = await adminService.getStats();
            setStats(response.stats);
        } catch (err) {
            console.error('Erreur chargement stats:', err);
            setError('Impossible de charger les statistiques');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button
                    className="btn btn-outline-danger btn-sm ms-3"
                    onClick={loadStats}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header Admin */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="bg-white rounded shadow-sm p-4">
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <div
                                    className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                    style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                                >
                                    👨‍💼
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h1 className="h3 mb-1">
                                    Dashboard Administrateur
                                </h1>
                                <p className="text-muted mb-0">
                                    Bienvenue {getFullName()} • Gestion DiapalSen
                                </p>
                            </div>
                            <div>
                                <span className="badge bg-warning text-dark fs-6">
                                    Administrateur
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiques principales */}
            <div className="row mb-4">
                {/* Projets */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="stat-icon bg-primary text-white mx-auto mb-3">
                                📊
                            </div>
                            <h3 className="text-primary mb-1">{stats?.projets?.total || 0}</h3>
                            <p className="text-muted mb-3">Projets total</p>
                            <div className="small">
                                <span className="badge bg-warning me-1">
                                    {stats?.projets?.en_attente || 0} en attente
                                </span>
                                <span className="badge bg-success">
                                    {stats?.projets?.actifs || 0} actifs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Utilisateurs */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="stat-icon bg-success text-white mx-auto mb-3">
                                👥
                            </div>
                            <h3 className="text-success mb-1">{stats?.utilisateurs?.total || 0}</h3>
                            <p className="text-muted mb-3">Utilisateurs</p>
                            <div className="small">
                                <span className="badge bg-info me-1">
                                    {stats?.utilisateurs?.contributeurs || 0} contributeurs
                                </span>
                                <span className="badge bg-primary">
                                    {stats?.utilisateurs?.porteurs || 0} porteurs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contributions */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="stat-icon bg-info text-white mx-auto mb-3">
                                💰
                            </div>
                            <h3 className="text-info mb-1">
                                {(stats?.contributions?.montant_total || 0).toLocaleString()} FCFA
                            </h3>
                            <p className="text-muted mb-3">Montant collecté</p>
                            <div className="small">
                                <span className="badge bg-success">
                                    {stats?.contributions?.total_contributions || 0} contributions
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nouveaux utilisateurs */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="stat-icon bg-warning text-white mx-auto mb-3">
                                ⭐
                            </div>
                            <h3 className="text-warning mb-1">{stats?.utilisateurs?.nouveaux_30j || 0}</h3>
                            <p className="text-muted mb-3">Nouveaux (30j)</p>
                            <div className="small">
                                <span className="badge bg-secondary">
                                    {stats?.contributions?.contributions_30j || 0} contributions
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions rapides admin */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-lightning me-2"></i>
                                Actions rapides
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6 col-lg-3">
                                    <Link to="/admin/projets/en-attente" className="btn btn-warning w-100 p-3">
                                        <i className="bi bi-clock me-2"></i>
                                        <div>
                                            <strong>Projets en attente</strong>
                                            <br />
                                            <small>{stats?.projets?.en_attente || 0} à valider</small>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <Link to="/admin/utilisateurs" className="btn btn-outline-primary w-100 p-3">
                                        <i className="bi bi-people me-2"></i>
                                        <div>
                                            <strong>Gestion utilisateurs</strong>
                                            <br />
                                            <small>Modération comptes</small>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <Link to="/admin/validations" className="btn btn-outline-info w-100 p-3">
                                        <i className="bi bi-file-earmark-text me-2"></i>
                                        <div>
                                            <strong>Historique</strong>
                                            <br />
                                            <small>Validations récentes</small>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <Link to="/dashboard" className="btn btn-outline-secondary w-100 p-3">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        <div>
                                            <strong>Retour site</strong>
                                            <br />
                                            <small>Interface utilisateur</small>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projets récents en attente */}
            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                Projets en attente de validation
                            </h5>
                            <Link to="/admin/projets/en-attente" className="btn btn-sm btn-outline-primary">
                                Voir tous
                            </Link>
                        </div>
                        <div className="card-body">
                            {stats?.projets_en_attente?.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Projet</th>
                                                <th>Porteur</th>
                                                <th>Objectif</th>
                                                <th>Soumis le</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.projets_en_attente.slice(0, 5).map(projet => (
                                                <tr key={projet.id}>
                                                    <td>
                                                        <strong>{projet.titre}</strong>
                                                        <br />
                                                        <small className="text-muted">{projet.categorie_nom}</small>
                                                    </td>
                                                    <td>{projet.porteur_nom}</td>
                                                    <td>{(projet.montant_objectif || 0).toLocaleString()} FCFA</td>
                                                    <td>
                                                        <small>
                                                            {new Date(projet.date_creation).toLocaleDateString('fr-FR')}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={`/admin/projets/en-attente`}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            Valider
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted mt-2">Aucun projet en attente !</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Catégories populaires */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-graph-up me-2"></i>
                                Catégories populaires
                            </h5>
                        </div>
                        <div className="card-body">
                            {stats?.categories_populaires?.length > 0 ? (
                                <div>
                                    {stats.categories_populaires.map((cat, index) => (
                                        <div key={cat.nom} className="d-flex align-items-center mb-3">
                                            <div className="me-3">
                                                <span style={{ fontSize: '1.5rem' }}>{cat.icone}</span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-medium">{cat.nom}</div>
                                                <small className="text-muted">{cat.nb_projets} projets</small>
                                            </div>
                                            <span className="badge bg-primary rounded-pill">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-center">Aucune donnée disponible</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dernière mise à jour */}
            <div className="row">
                <div className="col-12">
                    <div className="text-center text-muted">
                        <small>
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
                        </small>
                        <button
                            className="btn btn-link btn-sm p-0 ms-2"
                            onClick={loadStats}
                        >
                            Actualiser
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;