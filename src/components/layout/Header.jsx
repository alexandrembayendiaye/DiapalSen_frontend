// src/components/layout/Header.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth()

    const handleLogout = () => {
        logout()
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
            <div className="container">

                {/* Logo */}
                <Link className="navbar-brand fw-bold fs-3" to="/">
                    DiapalSen
                </Link>

                {/* Bouton mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu de navigation */}
                <div className="collapse navbar-collapse" id="navbarNav">

                    {/* Menu à gauche */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Accueil
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/projets">
                                Projets
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/categories">
                                Catégories
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/aide">
                                Aide
                            </Link>
                        </li>
                    </ul>

                    {/* Menu à droite */}
                    <ul className="navbar-nav">
                        {!isAuthenticated ? (
                            // Utilisateur non connecté
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i>
                                        Connexion
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-light ms-2" to="/register">
                                        S'inscrire
                                    </Link>
                                </li>
                            </>
                        ) : (
                            // Utilisateur connecté
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">
                                        <i className="bi bi-speedometer2 me-1"></i>
                                        Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link position-relative" to="/notifications">
                                        <i className="bi bi-bell me-1"></i>
                                        Notifications
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            3
                                            <span className="visually-hidden">notifications non lues</span>
                                        </span>
                                    </Link>
                                </li>

                                {/* Menu dropdown utilisateur */}
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-person-circle me-2 fs-5"></i>
                                        {user?.first_name || 'Utilisateur'}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <h6 className="dropdown-header">
                                                <strong>{user?.first_name} {user?.last_name}</strong>
                                                <br />
                                                <small className="text-muted">{user?.email}</small>
                                            </h6>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <Link className="dropdown-item" to="/profil">
                                                <i className="bi bi-person me-2"></i>
                                                Mon profil
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/mes-projets">
                                                <i className="bi bi-folder me-2"></i>
                                                Mes projets
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/mes-contributions">
                                                <i className="bi bi-wallet2 me-2"></i>
                                                Mes contributions
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/parametres">
                                                <i className="bi bi-gear me-2"></i>
                                                Paramètres
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={handleLogout}
                                            >
                                                <i className="bi bi-box-arrow-right me-2"></i>
                                                Déconnexion
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header