// src/pages/HomePage.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const HomePage = () => {
    const { isAuthenticated, user } = useAuth()

    return (
        <div className="home-page">

            {/* Hero Section - fond clair au lieu de bleu */}
            <section className="bg-light py-5">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4 text-primary">
                                DiapalSen
                            </h1>
                            <h2 className="h4 mb-4 text-secondary">
                                La plateforme de crowdfunding sénégalaise
                            </h2>
                            <p className="lead mb-4 text-dark">
                                Connectez les innovateurs sénégalais avec les contributeurs
                                du monde entier. Soutenez l'entrepreneuriat local et participez
                                au développement du Sénégal.
                            </p>

                            {!isAuthenticated ? (
                                <div className="d-flex gap-3 flex-wrap">
                                    <Link
                                        to="/register"
                                        className="btn btn-primary btn-lg px-4"
                                    >
                                        <i className="bi bi-person-plus me-2"></i>
                                        Rejoindre DiapalSen
                                    </Link>
                                    <Link
                                        to="/projets"
                                        className="btn btn-outline-primary btn-lg px-4"
                                    >
                                        <i className="bi bi-search me-2"></i>
                                        Découvrir les projets
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="mb-3 text-success">
                                        Bon retour, {user?.first_name} !
                                    </h4>
                                    <Link
                                        to="/dashboard"
                                        className="btn btn-primary btn-lg px-4"
                                    >
                                        <i className="bi bi-speedometer2 me-2"></i>
                                        Mon tableau de bord
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="col-lg-6 text-center">
                            <div className="mt-5 mt-lg-0">
                                <i className="bi bi-globe text-primary" style={{ fontSize: '8rem' }}></i>
                                <p className="mt-3 text-muted">
                                    Innovation • Collaboration • Impact
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Statistiques */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-12 mb-5">
                            <h2 className="display-6 fw-bold text-primary">
                                DiapalSen en chiffres
                            </h2>
                            <p className="text-muted">
                                Rejoignez une communauté grandissante d'innovateurs
                            </p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <i className="bi bi-folder text-primary" style={{ fontSize: '3rem' }}></i>
                                    <h3 className="fw-bold text-primary mt-3">0+</h3>
                                    <p className="text-muted mb-0">Projets financés</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <i className="bi bi-people text-success" style={{ fontSize: '3rem' }}></i>
                                    <h3 className="fw-bold text-success mt-3">0</h3>
                                    <p className="text-muted mb-0">Contributeurs</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <i className="bi bi-currency-exchange text-warning" style={{ fontSize: '3rem' }}></i>
                                    <h3 className="fw-bold text-warning mt-3">0 FCFA</h3>
                                    <p className="text-muted mb-0">Collectés</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <i className="bi bi-graph-up text-info" style={{ fontSize: '3rem' }}></i>
                                    <h3 className="fw-bold text-info mt-3">95%</h3>
                                    <p className="text-muted mb-0">Taux de réussite</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Fonctionnalités */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <h2 className="display-6 fw-bold text-primary">
                                Pourquoi choisir DiapalSen ?
                            </h2>
                            <p className="text-muted">
                                Une plateforme pensée pour l'écosystème entrepreneurial sénégalais
                            </p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <i className="bi bi-grid-3x3 text-primary" style={{ fontSize: '3rem' }}></i>
                                    <h4 className="text-primary mt-3">12 Catégories</h4>
                                    <p className="text-muted">
                                        Agriculture, technologie, éducation, santé, artisanat...
                                        Tous les secteurs de l'innovation sénégalaise représentés.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <i className="bi bi-cash-stack text-success" style={{ fontSize: '3rem' }}></i>
                                    <h4 className="text-success mt-3">3 Modèles de financement</h4>
                                    <p className="text-muted">
                                        Tout-ou-rien, flexible 50%, ou solidaire :
                                        chaque projet trouve son modèle optimal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <i className="bi bi-phone text-warning" style={{ fontSize: '3rem' }}></i>
                                    <h4 className="text-warning mt-3">Paiements locaux</h4>
                                    <p className="text-muted">
                                        Wave, Orange Money, Free Money :
                                        contribuez avec vos moyens de paiement habituels.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action - gardé en bleu pour contraste */}
            <section className="bg-primary text-white py-5">
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="display-6 fw-bold mb-4">
                                Prêt à transformer votre idée en réalité ?
                            </h2>
                            <p className="lead mb-4">
                                Rejoignez la communauté DiapalSen et donnez vie à vos projets
                                avec le soutien de la diaspora sénégalaise.
                            </p>

                            {!isAuthenticated ? (
                                <div className="d-flex justify-content-center gap-3 flex-wrap">
                                    <Link
                                        to="/register"
                                        className="btn btn-light btn-lg px-5"
                                    >
                                        <i className="bi bi-person-plus me-2"></i>
                                        Créer un compte
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="btn btn-outline-light btn-lg px-5"
                                    >
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        Se connecter
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    to="/creer-projet"
                                    className="btn btn-light btn-lg px-5"
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Créer mon projet
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage