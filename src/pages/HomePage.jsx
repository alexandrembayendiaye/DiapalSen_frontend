// src/pages/HomePage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import projectsService from '../services/projectsService'
import { formatMontant } from '../utils/formatUtils'
import { getProjectListImage } from '../utils/imageUtils'

const HomePage = () => {
    const { isAuthenticated, user } = useAuth()
    const [stats, setStats] = useState({
        projets_finances: 0,
        total_contributeurs: 0,
        montant_total_collecte: 0,
        taux_reussite: 0
    })
    const [projetsRecents, setProjetsRecents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        chargerDonnees()
    }, [])

    const chargerDonnees = async () => {
        try {
            // Charger les statistiques globales
            const statsData = await projectsService.getStatsGlobales()
            setStats(statsData)

            // Charger les projets récents (3 derniers)
            const projetsData = await projectsService.getProjects()
            const projets = projetsData.results || []
            setProjetsRecents(projets.slice(0, 3))
        } catch (error) {
            console.error('Erreur chargement données accueil:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="home-page">

            {/* Hero Section Nouvelle Génération - Fond Blanc pour contraster avec la Navbar bleue */}
            <section className="position-relative" style={{
                background: '#ffffff',
                minHeight: '75vh',
                display: 'flex',
                alignItems: 'center',
                color: '#212529',
                overflow: 'hidden',
                borderBottom: '1px solid #eee'
            }}>
                {/* Décorations subtiles en arrière-plan */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(13, 110, 253, 0.05) 0%, transparent 70%)',
                    borderRadius: '50%'
                }}></div>

                <div className="container py-5 position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            {/* Badge revu */}
                            <span className="badge mb-4" style={{
                                background: 'rgba(13, 110, 253, 0.1)',
                                color: '#0d6efd',
                                padding: '10px 20px',
                                fontSize: '0.9rem',
                                borderRadius: '50px',
                                fontWeight: '600'
                            }}>
                                <i className="bi bi-star-fill me-2" style={{ color: '#ffc107' }}></i>
                                Plateforme N°1 de crowdfunding au Sénégal
                            </span>

                            <h1 className="display-3 fw-bold mb-4" style={{
                                color: '#0a2351',
                                letterSpacing: '-1.5px',
                                lineHeight: '1.1'
                            }}>
                                DiapalSen
                            </h1>

                            <h2 className="h3 mb-4 text-secondary fw-light">
                                Ensemble, construisons le Sénégal de demain
                            </h2>

                            <p className="lead mb-5 text-muted" style={{ lineHeight: '1.8' }}>
                                La première plateforme de crowdfunding dédiée aux entrepreneurs
                                et innovateurs sénégalais. Transformez vos idées en réalité
                                avec le soutien de contributeurs engagés du monde entier.
                            </p>

                            {!isAuthenticated ? (
                                <div className="d-flex gap-3 flex-wrap">
                                    <Link
                                        to="/register"
                                        className="btn btn-lg shadow-sm"
                                        style={{
                                            background: '#0d6efd',
                                            color: 'white',
                                            padding: '15px 35px',
                                            fontWeight: '600',
                                            borderRadius: '12px',
                                            border: 'none'
                                        }}
                                    >
                                        <i className="bi bi-rocket-takeoff me-2"></i>
                                        Lancer mon projet
                                    </Link>
                                    <Link
                                        to="/projets"
                                        className="btn btn-lg"
                                        style={{
                                            background: 'transparent',
                                            color: '#0d6efd',
                                            padding: '15px 35px',
                                            fontWeight: '600',
                                            border: '2px solid #0d6efd',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        Explorer les projets
                                    </Link>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center gap-3">
                                    <h4 className="fw-bold mb-0" style={{ color: '#0a2351' }}>
                                        <i className="bi bi-emoji-smile me-2 text-primary"></i>
                                        Bon retour, {user?.first_name} !
                                    </h4>
                                    <Link to="/dashboard" className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm">
                                        Mon tableau de bord
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Illustration à droite pour remplir le vide */}
                        <div className="col-lg-5 d-none d-lg-block text-center">
                            <i className="bi bi-rocket-takeoff" style={{
                                fontSize: '15rem',
                                color: '#0d6efd',
                                opacity: 0.1
                            }}></i>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Statistiques améliorée */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-12 mb-5">
                            <span className="text-primary text-uppercase" style={{
                                letterSpacing: '2px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}>
                                Nos résultats
                            </span>
                            <h2 className="display-5 fw-bold text-dark mt-2">
                                DiapalSen en chiffres
                            </h2>
                            <p className="text-muted lead">
                                Rejoignez une communauté grandissante d'innovateurs et de contributeurs
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-3 col-sm-6">
                            <div className="card border-0 h-100 text-center" style={{
                                background: 'white',
                                borderRadius: '15px',
                                padding: '30px 20px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    margin: '0 auto 20px',
                                    background: 'rgba(13, 110, 253, 0.1)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="bi bi-folder-fill text-primary" style={{ fontSize: '2rem' }}></i>
                                </div>
                                <h3 className="fw-bold text-primary mb-2" style={{ fontSize: '2.5rem' }}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        stats.projets_finances || 0
                                    )}
                                </h3>
                                <p className="text-muted mb-0">Projets actifs</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="card border-0 h-100 text-center" style={{
                                background: 'white',
                                borderRadius: '15px',
                                padding: '30px 20px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    margin: '0 auto 20px',
                                    background: 'rgba(25, 135, 84, 0.1)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="bi bi-people-fill text-success" style={{ fontSize: '2rem' }}></i>
                                </div>
                                <h3 className="fw-bold text-success mb-2" style={{ fontSize: '2.5rem' }}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        stats.total_contributeurs || 0
                                    )}
                                </h3>
                                <p className="text-muted mb-0">Contributeurs</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="card border-0 h-100 text-center" style={{
                                background: 'white',
                                borderRadius: '15px',
                                padding: '30px 20px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    margin: '0 auto 20px',
                                    background: 'rgba(255, 193, 7, 0.1)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="bi bi-cash-coin text-warning" style={{ fontSize: '2rem' }}></i>
                                </div>
                                <h3 className="fw-bold text-warning mb-2" style={{ fontSize: '2rem' }}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        formatMontant(stats.montant_total_collecte || 0)
                                    )}
                                </h3>
                                <p className="text-muted mb-0">FCFA collectés</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="card border-0 h-100 text-center" style={{
                                background: 'white',
                                borderRadius: '15px',
                                padding: '30px 20px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    margin: '0 auto 20px',
                                    background: 'rgba(13, 202, 240, 0.1)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="bi bi-graph-up-arrow text-info" style={{ fontSize: '2rem' }}></i>
                                </div>
                                <h3 className="fw-bold text-info mb-2" style={{ fontSize: '2.5rem' }}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        `${stats.taux_reussite || 0}%`
                                    )}
                                </h3>
                                <p className="text-muted mb-0">Taux de réussite</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Projets Récents améliorée */}
            {projetsRecents.length > 0 && (
                <section className="py-5 bg-white">
                    <div className="container">
                        <div className="row text-center mb-5">
                            <div className="col-12">
                                <span className="text-primary text-uppercase" style={{
                                    letterSpacing: '2px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    Découvrez
                                </span>
                                <h2 className="display-5 fw-bold text-dark mt-2">
                                    Projets à la une
                                </h2>
                                <p className="text-muted lead">
                                    Les derniers projets en cours de financement
                                </p>
                            </div>
                        </div>

                        <div className="row g-4">
                            {projetsRecents.map(projet => (
                                <div key={projet.id} className="col-lg-4 col-md-6">
                                    <div className="card border-0 h-100" style={{
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
                                            <img
                                                src={getProjectListImage(projet.image_principale, projet.titre)}
                                                className="w-100 h-100"
                                                alt={projet.titre}
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <span className="badge position-absolute" style={{
                                                top: '15px',
                                                left: '15px',
                                                background: 'rgba(255,255,255,0.95)',
                                                color: '#0d6efd',
                                                padding: '5px 15px',
                                                borderRadius: '20px',
                                                fontWeight: '600'
                                            }}>
                                                {projet.categorie_nom}
                                            </span>
                                        </div>

                                        <div className="card-body p-4">
                                            <h5 className="card-title fw-bold mb-3">{projet.titre}</h5>
                                            <p className="card-text text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                                                {projet.description_courte?.substring(0, 100)}...
                                            </p>

                                            {/* Barre de progression améliorée */}
                                            <div className="mb-4">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <small className="fw-bold text-primary">
                                                        {formatMontant(projet.montant_collecte)} FCFA
                                                    </small>
                                                    <small className="text-muted">
                                                        {projet.pourcentage_atteint}%
                                                    </small>
                                                </div>
                                                <div className="progress" style={{
                                                    height: '10px',
                                                    borderRadius: '10px',
                                                    background: '#e9ecef'
                                                }}>
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${Math.min(projet.pourcentage_atteint, 100)}%`,
                                                            background: 'linear-gradient(90deg, #0d6efd, #0dcaf0)',
                                                            borderRadius: '10px'
                                                        }}
                                                    ></div>
                                                </div>
                                                <small className="text-muted d-block mt-2">
                                                    Objectif: {formatMontant(projet.montant_objectif)} FCFA
                                                </small>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    <i className="bi bi-people-fill me-1"></i>
                                                    {projet.nombre_contributeurs || 0} contributeurs
                                                </small>
                                                <Link
                                                    to={`/projets/${projet.id}`}
                                                    className="btn btn-primary btn-sm"
                                                    style={{
                                                        borderRadius: '20px',
                                                        padding: '5px 20px'
                                                    }}
                                                >
                                                    Voir détails
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-5">
                            <Link to="/projets" className="btn btn-primary btn-lg" style={{
                                padding: '12px 40px',
                                borderRadius: '30px',
                                fontWeight: '600'
                            }}>
                                <i className="bi bi-grid-3x3-gap me-2"></i>
                                Voir tous les projets
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Fonctionnalités améliorée */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <span className="text-primary text-uppercase" style={{
                                letterSpacing: '2px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}>
                                Nos avantages
                            </span>
                            <h2 className="display-5 fw-bold text-dark mt-2">
                                Pourquoi choisir DiapalSen ?
                            </h2>
                            <p className="text-muted lead">
                                Une plateforme pensée pour l'écosystème entrepreneurial sénégalais
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 h-100" style={{
                                borderRadius: '15px',
                                padding: '30px',
                                background: 'white',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div className="text-center">
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        margin: '0 auto 20px',
                                        background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="bi bi-grid-3x3-gap-fill text-white" style={{ fontSize: '2.5rem' }}></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-3">12 Catégories</h4>
                                    <p className="text-muted">
                                        Agriculture, technologie, éducation, santé, artisanat...
                                        Tous les secteurs de l'innovation sénégalaise représentés.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 h-100" style={{
                                borderRadius: '15px',
                                padding: '30px',
                                background: 'white',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div className="text-center">
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        margin: '0 auto 20px',
                                        background: 'linear-gradient(135deg, #198754, #20c997)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="bi bi-cash-stack text-white" style={{ fontSize: '2.5rem' }}></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-3">3 Modèles de financement</h4>
                                    <p className="text-muted">
                                        Tout-ou-rien, flexible 50%, ou solidaire :
                                        chaque projet trouve son modèle optimal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 h-100" style={{
                                borderRadius: '15px',
                                padding: '30px',
                                background: 'white',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div className="text-center">
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        margin: '0 auto 20px',
                                        background: 'linear-gradient(135deg, #ffc107, #ff6b35)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="bi bi-phone-fill text-white" style={{ fontSize: '2.5rem' }}></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-3">Paiements locaux</h4>
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

            {/* Call to Action amélioré */}
            <section style={{
                background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                padding: '80px 0',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Motif décoratif */}
                <div style={{
                    position: 'absolute',
                    bottom: '-50%',
                    left: '-10%',
                    width: '60%',
                    height: '150%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    borderRadius: '50%'
                }}></div>

                <div className="container text-center position-relative">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="display-5 fw-bold mb-4">
                                Prêt à transformer votre idée en réalité ?
                            </h2>
                            <p className="lead mb-5" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                Rejoignez la communauté DiapalSen et donnez vie à vos projets
                                avec le soutien de la diaspora sénégalaise et des contributeurs du monde entier.
                            </p>

                            {!isAuthenticated ? (
                                <div className="d-flex justify-content-center gap-3 flex-wrap">
                                    <Link
                                        to="/register"
                                        className="btn btn-lg"
                                        style={{
                                            background: 'white',
                                            color: '#0d6efd',
                                            padding: '15px 40px',
                                            borderRadius: '30px',
                                            fontWeight: '600',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <i className="bi bi-person-plus-fill me-2"></i>
                                        Créer un compte gratuit
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="btn btn-lg"
                                        style={{
                                            background: 'transparent',
                                            color: 'white',
                                            padding: '15px 40px',
                                            borderRadius: '30px',
                                            fontWeight: '600',
                                            border: '2px solid white'
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        Se connecter
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    to="/projets/creer"
                                    className="btn btn-lg"
                                    style={{
                                        background: 'white',
                                        color: '#0d6efd',
                                        padding: '15px 40px',
                                        borderRadius: '30px',
                                        fontWeight: '600',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Créer mon projet maintenant
                                </Link>
                            )}

                            <div className="mt-5">
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0 }}>
                                    <i className="bi bi-check-circle me-2"></i>
                                    Inscription gratuite • Sans engagement • Accompagnement personnalisé
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage