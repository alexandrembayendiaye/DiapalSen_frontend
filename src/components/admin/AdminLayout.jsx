// ✅ ÉTAPE 1 : AdminLayout.jsx
// Créez ce fichier : src/components/admin/AdminLayout.jsx

import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirection si pas admin
    React.useEffect(() => {
        if (!isAdmin()) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAdmin, navigate]);

    // Si pas admin, ne pas afficher
    if (!isAdmin()) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Menu sidebar admin
    const menuItems = [
        {
            path: '/dashboard',
            name: 'Dashboard',
            icon: '📊',
            description: 'Vue d\'ensemble'
        },
        {
            path: '/admin/projets/en-attente',
            name: 'Validation Projets',
            icon: '⏳',
            description: 'Projets à valider'
        },
        {
            path: '/admin/utilisateurs',
            name: 'Utilisateurs',
            icon: '👥',
            description: 'Gestion utilisateurs'
        },
        {
            path: '/admin/validations',
            name: 'Historique',
            icon: '📋',
            description: 'Historique validations'
        }
    ];

    return (
        <div className="admin-layout">
            {/* Header Admin */}
            <header className="admin-header bg-dark text-white">
                <div className="container-fluid">
                    <div className="row align-items-center py-2">
                        <div className="col-md-6">
                            <h4 className="mb-0">
                                <span className="text-warning">⚡</span> DiapalSen Admin
                            </h4>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <span className="me-3">👤 {user?.first_name} {user?.last_name}</span>
                            <Link
                                to="/dashboard"
                                className="btn btn-outline-light btn-sm me-2"
                            >
                                Retour Site
                            </Link>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleLogout}
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="admin-body d-flex">
                {/* Sidebar */}
                <nav className="admin-sidebar bg-light border-end">
                    <div className="sidebar-content p-3">
                        <div className="admin-info mb-4">
                            <div className="text-center">
                                <div className="admin-avatar bg-warning text-dark rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                                    style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                                    👨‍💼
                                </div>
                                <small className="text-muted">Administrateur</small>
                            </div>
                        </div>

                        <ul className="nav flex-column admin-menu">
                            {menuItems.map(item => (
                                <li className="nav-item mb-1" key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`nav-link d-flex align-items-center px-3 py-2 rounded ${location.pathname === item.path
                                            ? 'bg-primary text-white'
                                            : 'text-dark hover-bg-light'
                                            }`}
                                    >
                                        <span className="me-2 fs-5">{item.icon}</span>
                                        <div>
                                            <div className="fw-medium">{item.name}</div>
                                            <small className="text-muted">{item.description}</small>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Contenu principal */}
                <main className="admin-content flex-grow-1">
                    <div className="container-fluid p-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;