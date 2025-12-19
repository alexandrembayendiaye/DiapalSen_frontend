// src/pages/admin/AdminUtilisateursPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { getMediaUrl } from '../../services/api';

const AdminUtilisateursPage = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtres, setFiltres] = useState({
        search: '',
        type: '',
        statut: ''
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToToggle, setUserToToggle] = useState(null);

    useEffect(() => {
        loadUtilisateurs();
    }, []);

    const loadUtilisateurs = async () => {
        try {
            setLoading(true);
            const data = await adminService.getUtilisateurs();
            setUtilisateurs(data.users || data.results || data || []);
        } catch (err) {
            console.error('Erreur chargement utilisateurs:', err);
            setError('Impossible de charger les utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    // Filtrer les utilisateurs
    const utilisateursFiltres = utilisateurs.filter(user => {
        const matchSearch = !filtres.search ||
            user.email?.toLowerCase().includes(filtres.search.toLowerCase()) ||
            user.nom_complet?.toLowerCase().includes(filtres.search.toLowerCase()) ||
            user.first_name?.toLowerCase().includes(filtres.search.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(filtres.search.toLowerCase()) ||
            user.username?.toLowerCase().includes(filtres.search.toLowerCase());

        const matchType = !filtres.type || user.type_utilisateur === filtres.type;
        const matchStatut = !filtres.statut ||
            (filtres.statut === 'actif' && user.is_active) ||
            (filtres.statut === 'inactif' && !user.is_active);

        return matchSearch && matchType && matchStatut;
    });

    const openConfirmModal = (user) => {
        setUserToToggle(user);
        setShowConfirmModal(true);
    };

    const handleToggleStatut = async () => {
        if (!userToToggle) return;

        const user = userToToggle;
        const newStatut = !user.is_active;

        try {
            await adminService.toggleUtilisateurStatut(user.id, newStatut ? 'actif' : 'suspendu');
            toast.success(`Compte ${newStatut ? 'activé' : 'suspendu'} avec succès`);
            loadUtilisateurs();
        } catch (err) {
            console.error('Erreur modification statut:', err);
            toast.error('Erreur lors de la modification du statut');
        } finally {
            setShowConfirmModal(false);
            setUserToToggle(null);
        }
    };

    const openUserDetails = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'porteur':
                return <span className="badge bg-success">Porteur</span>;
            case 'contributeur':
                return <span className="badge bg-info">Contributeur</span>;
            case 'admin':
                return <span className="badge bg-warning text-dark">Admin</span>;
            default:
                return <span className="badge bg-secondary">{type}</span>;
        }
    };

    const getStatutBadge = (isActive) => {
        return isActive
            ? <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Actif</span>
            : <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Suspendu</span>;
    };

    const getDefaultAvatar = (user) => {
        // Utiliser nom_complet en priorité, sinon fallback sur email/username
        const name = user.nom_complet || user.email?.split('@')[0] || user.username || 'U';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0066cc&color=fff&size=40`;
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Chargement des utilisateurs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button className="btn btn-outline-danger btn-sm ms-3" onClick={loadUtilisateurs}>
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="admin-utilisateurs container py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">
                        <i className="bi bi-people me-2"></i>
                        Gestion des Utilisateurs
                    </h2>
                    <p className="text-muted mb-0">
                        {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''} inscrit{utilisateurs.length > 1 ? 's' : ''}
                    </p>
                </div>
                <button className="btn btn-outline-primary" onClick={loadUtilisateurs}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Actualiser
                </button>
            </div>

            {/* Filtres */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Rechercher un utilisateur..."
                                    value={filtres.search}
                                    onChange={(e) => setFiltres({ ...filtres, search: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filtres.type}
                                onChange={(e) => setFiltres({ ...filtres, type: e.target.value })}
                            >
                                <option value="">Tous les types</option>
                                <option value="porteur">Porteurs</option>
                                <option value="contributeur">Contributeurs</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filtres.statut}
                                onChange={(e) => setFiltres({ ...filtres, statut: e.target.value })}
                            >
                                <option value="">Tous les statuts</option>
                                <option value="actif">Actifs</option>
                                <option value="inactif">Suspendus</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => setFiltres({ search: '', type: '', statut: '' })}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des utilisateurs */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                        <i className="bi bi-list-ul me-2"></i>
                        Liste ({utilisateursFiltres.length})
                    </h5>
                </div>
                <div className="card-body p-0">
                    {utilisateursFiltres.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Utilisateur</th>
                                        <th>Email</th>
                                        <th>Type</th>
                                        <th>Région</th>
                                        <th>Inscrit le</th>
                                        <th>Statut</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {utilisateursFiltres.map(user => (
                                        <tr key={user.id} className="align-middle">
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={getMediaUrl(user.photo_profil) || getDefaultAvatar(user)}
                                                        alt={user.first_name}
                                                        className="rounded-circle me-2"
                                                        width="40"
                                                        height="40"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                    <div>
                                                        <strong>{user.nom_complet || `${user.first_name} ${user.last_name}`}</strong>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{getTypeBadge(user.type_utilisateur)}</td>
                                            <td>
                                                <small>{user.region || '-'}</small>
                                            </td>
                                            <td>
                                                <small>
                                                    {new Date(user.date_inscription).toLocaleDateString('fr-FR')}
                                                </small>
                                            </td>
                                            <td>{getStatutBadge(user.is_active)}</td>
                                            <td className="text-end">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => openUserDetails(user)}
                                                        title="Voir détails"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    {user.type_utilisateur !== 'admin' && (
                                                        <button
                                                            className={`btn ${user.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                            onClick={() => openConfirmModal(user)}
                                                            title={user.is_active ? 'Suspendre' : 'Activer'}
                                                        >
                                                            <i className={`bi ${user.is_active ? 'bi-person-x' : 'bi-person-check'}`}></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-people display-1 text-muted"></i>
                            <p className="text-muted mt-3">Aucun utilisateur trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal détails utilisateur */}
            {showModal && selectedUser && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-person-badge me-2"></i>
                                    Détails de l'utilisateur
                                </h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-4 text-center mb-3">
                                        <img
                                            src={getMediaUrl(selectedUser.photo_profil) || getDefaultAvatar(selectedUser)}
                                            alt={selectedUser.first_name}
                                            className="rounded-circle mb-3"
                                            width="120"
                                            height="120"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <h5>{selectedUser.nom_complet || `${selectedUser.first_name} ${selectedUser.last_name}`}</h5>
                                        {getTypeBadge(selectedUser.type_utilisateur)}
                                        <span className="ms-2">{getStatutBadge(selectedUser.is_active)}</span>
                                    </div>
                                    <div className="col-md-8">
                                        <table className="table table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted" width="40%">Email</td>
                                                    <td><strong>{selectedUser.email}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Téléphone</td>
                                                    <td>{selectedUser.telephone || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Région</td>
                                                    <td>{selectedUser.region || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Ville</td>
                                                    <td>{selectedUser.ville || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Inscrit le</td>
                                                    <td>{new Date(selectedUser.date_inscription).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Dernière connexion</td>
                                                    <td>{selectedUser.derniere_connexion
                                                        ? new Date(selectedUser.derniere_connexion).toLocaleDateString('fr-FR')
                                                        : 'Jamais'}</td>
                                                </tr>
                                                {selectedUser.bio && (
                                                    <tr>
                                                        <td className="text-muted">Bio</td>
                                                        <td>{selectedUser.bio}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Fermer
                                </button>
                                {selectedUser.type_utilisateur !== 'admin' && (
                                    <button
                                        className={`btn ${selectedUser.is_active ? 'btn-danger' : 'btn-success'}`}
                                        onClick={() => {
                                            openConfirmModal(selectedUser);
                                            setShowModal(false);
                                        }}
                                    >
                                        <i className={`bi ${selectedUser.is_active ? 'bi-person-x' : 'bi-person-check'} me-2`}></i>
                                        {selectedUser.is_active ? 'Suspendre le compte' : 'Activer le compte'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmation */}
            {showConfirmModal && userToToggle && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className={`modal-header ${userToToggle.is_active ? 'bg-danger' : 'bg-success'} text-white`}>
                                <h5 className="modal-title">
                                    <i className={`bi ${userToToggle.is_active ? 'bi-person-x' : 'bi-person-check'} me-2`}></i>
                                    {userToToggle.is_active ? 'Suspendre le compte' : 'Activer le compte'}
                                </h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowConfirmModal(false)}></button>
                            </div>
                            <div className="modal-body text-center py-4">
                                <i className={`bi ${userToToggle.is_active ? 'bi-exclamation-triangle text-danger' : 'bi-check-circle text-success'}`} style={{ fontSize: '3rem' }}></i>
                                <p className="mt-3 mb-0">
                                    Voulez-vous vraiment <strong>{userToToggle.is_active ? 'suspendre' : 'activer'}</strong> le compte de :
                                </p>
                                <p className="fw-bold fs-5 mt-2">
                                    {userToToggle.nom_complet || userToToggle.email}
                                </p>
                                {userToToggle.is_active && (
                                    <p className="text-muted small">
                                        L'utilisateur ne pourra plus se connecter à la plateforme.
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                                    Annuler
                                </button>
                                <button
                                    className={`btn ${userToToggle.is_active ? 'btn-danger' : 'btn-success'}`}
                                    onClick={handleToggleStatut}
                                >
                                    <i className={`bi ${userToToggle.is_active ? 'bi-person-x' : 'bi-person-check'} me-2`}></i>
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUtilisateursPage;
