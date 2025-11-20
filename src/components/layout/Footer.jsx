// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-dark text-light mt-5">
            <div className="container py-5">

                {/* Contenu principal du footer */}
                <div className="row g-4">

                    {/* À propos */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="text-warning mb-3">DiapalSen</h5>
                        <p className="text-light-emphasis mb-3">
                            La plateforme de crowdfunding qui connecte les innovateurs
                            sénégalais avec les contributeurs du monde entier.
                        </p>
                        <p className="text-light-emphasis">
                            <strong>Mission :</strong> Soutenir l'entrepreneuriat local et
                            participer au développement économique du Sénégal.
                        </p>
                    </div>

                    {/* Liens rapides */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="text-warning mb-3">Navigation</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-house me-2"></i>Accueil
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/projets" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-folder me-2"></i>Projets
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/categories" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-grid me-2"></i>Catégories
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/aide" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-question-circle me-2"></i>Centre d'aide
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-warning mb-3">Services</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/creer-projet" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-plus-circle me-2"></i>Créer un projet
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/comment-ca-marche" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-info-circle me-2"></i>Comment ça marche
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/succes" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-star me-2"></i>Histoires de succès
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/contact" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-envelope me-2"></i>Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Informations légales et contact */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-warning mb-3">Informations</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/conditions" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-file-text me-2"></i>Conditions d'utilisation
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/confidentialite" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-shield-check me-2"></i>Confidentialité
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/mentions-legales" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-info-square me-2"></i>Mentions légales
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/a-propos" className="text-light-emphasis text-decoration-none">
                                    <i className="bi bi-people me-2"></i>À propos
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Séparateur */}
                <hr className="my-4 text-secondary" />

                {/* Bas du footer */}
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="text-light-emphasis mb-2 mb-md-0">
                            <strong>DiapalSen</strong> - Plateforme de crowdfunding sénégalaise
                        </p>
                    </div>

                    <div className="col-md-6 text-md-end">
                        <p className="text-light-emphasis mb-2 mb-md-0">
                            <i className="bi bi-c-circle me-1"></i>
                            2025 DiapalSen. Tous droits réservés.
                        </p>
                    </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="row mt-3">
                    <div className="col-12 text-center">
                        <small className="text-secondary">
                            <i className="bi bi-geo-alt me-1"></i>
                            Dakar, Sénégal
                            <span className="mx-2">|</span>
                            <i className="bi bi-envelope me-1"></i>
                            contact@diapalsen.com
                            <span className="mx-2">|</span>
                            <i className="bi bi-telephone me-1"></i>
                            +221 XX XXX XX XX
                        </small>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer