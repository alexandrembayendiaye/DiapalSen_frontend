// src/pages/static/CommentCaMarchePage.jsx
import { Link } from 'react-router-dom'

const CommentCaMarchePage = () => {
    return (
        <div className="comment-ca-marche-page">
            {/* Header */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold">
                        <i className="bi bi-info-circle me-3"></i>
                        Comment ça marche ?
                    </h1>
                    <p className="lead mb-0">
                        Découvrez le fonctionnement de DiapalSen en quelques étapes
                    </p>
                </div>
            </div>

            <div className="container py-5">
                {/* Pour les porteurs */}
                <div className="row mb-5">
                    <div className="col-12 mb-4">
                        <h2 className="text-primary text-center">
                            <i className="bi bi-lightbulb me-2"></i>
                            Pour les porteurs de projet
                        </h2>
                    </div>

                    <div className="col-md-3 text-center mb-4">
                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <span className="fs-4 fw-bold">1</span>
                        </div>
                        <h5>Inscrivez-vous</h5>
                        <p className="text-muted">Créez votre compte en tant que porteur de projet</p>
                    </div>

                    <div className="col-md-3 text-center mb-4">
                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <span className="fs-4 fw-bold">2</span>
                        </div>
                        <h5>Créez votre projet</h5>
                        <p className="text-muted">Remplissez le formulaire avec les détails de votre projet</p>
                    </div>

                    <div className="col-md-3 text-center mb-4">
                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <span className="fs-4 fw-bold">3</span>
                        </div>
                        <h5>Validation</h5>
                        <p className="text-muted">Notre équipe valide votre projet sous 48h</p>
                    </div>

                    <div className="col-md-3 text-center mb-4">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <span className="fs-4 fw-bold">4</span>
                        </div>
                        <h5>Collectez !</h5>
                        <p className="text-muted">Recevez les contributions et réalisez votre projet</p>
                    </div>
                </div>

                <hr className="my-5" />

                {/* Pour les contributeurs */}
                <div className="row mb-5">
                    <div className="col-12 mb-4">
                        <h2 className="text-success text-center">
                            <i className="bi bi-heart me-2"></i>
                            Pour les contributeurs
                        </h2>
                    </div>

                    <div className="col-md-4 text-center mb-4">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <span className="fs-4 fw-bold">1</span>
                        </div>
                        <h5>Explorez</h5>
                        <p className="text-muted">Parcourez les projets et trouvez ceux qui vous inspirent</p>
                    </div>

                    <div className="col-md-4 text-center mb-4">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <span className="fs-4 fw-bold">2</span>
                        </div>
                        <h5>Contribuez</h5>
                        <p className="text-muted">Choisissez le montant et payez via Wave, Orange Money ou Free Money</p>
                    </div>

                    <div className="col-md-4 text-center mb-4">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <span className="fs-4 fw-bold">3</span>
                        </div>
                        <h5>Suivez</h5>
                        <p className="text-muted">Restez informé de l'avancement du projet que vous soutenez</p>
                    </div>
                </div>

                {/* Modèles de financement */}
                <div className="row bg-light rounded p-5 mb-5">
                    <div className="col-12 mb-4">
                        <h2 className="text-primary text-center">Les modèles de financement</h2>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <i className="bi bi-bullseye text-primary" style={{ fontSize: '2.5rem' }}></i>
                                <h5 className="mt-3">Tout-ou-rien</h5>
                                <p className="text-muted small">
                                    Le projet doit atteindre 100% de son objectif. Sinon, les contributions sont remboursées.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <i className="bi bi-percent text-warning" style={{ fontSize: '2.5rem' }}></i>
                                <h5 className="mt-3">Flexible 50%</h5>
                                <p className="text-muted small">
                                    Le porteur reçoit les fonds si au moins 50% de l'objectif est atteint.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <i className="bi bi-heart text-danger" style={{ fontSize: '2.5rem' }}></i>
                                <h5 className="mt-3">Solidaire</h5>
                                <p className="text-muted small">
                                    Le porteur reçoit tous les fonds collectés, quel que soit le montant.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h4 className="mb-4">Prêt à commencer ?</h4>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/projets" className="btn btn-primary btn-lg">
                            <i className="bi bi-search me-2"></i>
                            Découvrir les projets
                        </Link>
                        <Link to="/register" className="btn btn-outline-primary btn-lg">
                            <i className="bi bi-person-plus me-2"></i>
                            Créer un compte
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentCaMarchePage
