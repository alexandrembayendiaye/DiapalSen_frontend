// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant ErrorBoundary pour capturer les erreurs JavaScript dans l'arbre de composants React
 * Affiche une page d'erreur gracieuse au lieu de faire crasher toute l'application
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Mettre à jour l'état pour afficher l'UI de fallback
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Logger l'erreur
        console.error('❌ ErrorBoundary caught an error:', error, errorInfo);

        // Sauvegarder les détails de l'erreur
        this.state = {
            hasError: true,
            error: error,
            errorInfo: errorInfo
        };

        // TODO: Envoyer l'erreur à un service de logging (Sentry, etc.)
        // if (window.Sentry) {
        //     window.Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        // Recharger la page
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body text-center p-5">
                                        {/* Icône d'erreur */}
                                        <div className="mb-4">
                                            <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '4rem' }}></i>
                                        </div>

                                        {/* Titre */}
                                        <h1 className="h3 mb-3 text-danger">Oups ! Une erreur est survenue</h1>

                                        {/* Message */}
                                        <p className="text-muted mb-4">
                                            Nous sommes désolés, quelque chose s'est mal passé.
                                            Notre équipe a été notifiée et travaille à résoudre le problème.
                                        </p>

                                        {/* Détails de l'erreur (en développement uniquement) */}
                                        {process.env.NODE_ENV === 'development' && this.state.error && (
                                            <div className="alert alert-danger text-start mb-4">
                                                <h6 className="alert-heading">Détails de l'erreur (dev only):</h6>
                                                <pre className="mb-0 small" style={{ maxHeight: '200px', overflow: 'auto' }}>
                                                    {this.state.error.toString()}
                                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                                            <button
                                                onClick={this.handleReset}
                                                className="btn btn-primary px-4"
                                            >
                                                <i className="bi bi-arrow-clockwise me-2"></i>
                                                Réessayer
                                            </button>

                                            <Link to="/" className="btn btn-outline-secondary px-4">
                                                <i className="bi bi-house-door me-2"></i>
                                                Retour à l'accueil
                                            </Link>
                                        </div>

                                        {/* Aide */}
                                        <div className="mt-4 pt-4 border-top">
                                            <p className="small text-muted mb-2">
                                                Si le problème persiste, contactez-nous :
                                            </p>
                                            <a href="mailto:support@diapalsen.com" className="text-decoration-none">
                                                <i className="bi bi-envelope me-1"></i>
                                                support@diapalsen.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
