// src/pages/ErrorPage.jsx
import { Link, useNavigate } from 'react-router-dom';

/**
 * Page d'erreur 404 - Page non trouvée
 */
export const Error404 = () => {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 text-center">
                        <div className="mb-4">
                            <h1 className="display-1 fw-bold text-primary">404</h1>
                            <i className="bi bi-compass text-muted" style={{ fontSize: '5rem' }}></i>
                        </div>

                        <h2 className="h3 mb-3">Page introuvable</h2>
                        <p className="text-muted mb-4">
                            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                        </p>

                        <div className="d-flex gap-3 justify-content-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-outline-secondary"
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Retour
                            </button>
                            <Link to="/" className="btn btn-primary">
                                <i className="bi bi-house-door me-2"></i>
                                Accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Page d'erreur 500 - Erreur serveur
 */
export const Error500 = () => {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 text-center">
                        <div className="mb-4">
                            <h1 className="display-1 fw-bold text-danger">500</h1>
                            <i className="bi bi-server text-muted" style={{ fontSize: '5rem' }}></i>
                        </div>

                        <h2 className="h3 mb-3">Erreur serveur</h2>
                        <p className="text-muted mb-4">
                            Une erreur s'est produite sur nos serveurs.
                            Notre équipe a été notifiée et travaille à résoudre le problème.
                        </p>

                        <div className="d-flex gap-3 justify-content-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn btn-outline-secondary"
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Réessayer
                            </button>
                            <Link to="/" className="btn btn-primary">
                                <i className="bi bi-house-door me-2"></i>
                                Accueil
                            </Link>
                        </div>

                        <div className="mt-4">
                            <p className="small text-muted">
                                Si le problème persiste :
                                <a href="mailto:support@diapalsen.com" className="ms-1">
                                    support@diapalsen.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Page d'erreur 403 - Accès refusé
 */
export const Error403 = () => {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 text-center">
                        <div className="mb-4">
                            <h1 className="display-1 fw-bold text-warning">403</h1>
                            <i className="bi bi-shield-lock text-muted" style={{ fontSize: '5rem' }}></i>
                        </div>

                        <h2 className="h3 mb-3">Accès refusé</h2>
                        <p className="text-muted mb-4">
                            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        </p>

                        <div className="d-flex gap-3 justify-content-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-outline-secondary"
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Retour
                            </button>
                            <Link to="/dashboard" className="btn btn-primary">
                                <i className="bi bi-speedometer2 me-2"></i>
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export par défaut de Error404
export default Error404;
