// src/pages/static/AProposPage.jsx

const AProposPage = () => {
    return (
        <div className="a-propos-page">
            {/* Header */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold">
                        <i className="bi bi-people me-3"></i>
                        À propos de DiapalSen
                    </h1>
                    <p className="lead mb-0">
                        La plateforme de financement participatif made in Sénégal
                    </p>
                </div>
            </div>

            <div className="container py-5">
                {/* Mission */}
                <div className="row mb-5">
                    <div className="col-lg-8 mx-auto">
                        <h2 className="text-primary mb-4">Notre Mission</h2>
                        <p className="lead text-muted">
                            DiapalSen est née de la volonté de créer un pont entre les innovateurs
                            sénégalais et les contributeurs du monde entier. Notre mission est de
                            démocratiser l'accès au financement pour les projets qui façonnent
                            l'avenir du Sénégal.
                        </p>
                    </div>
                </div>

                {/* Valeurs */}
                <div className="row g-4 mb-5">
                    <div className="col-12">
                        <h2 className="text-primary text-center mb-4">Nos Valeurs</h2>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 text-center p-4">
                            <i className="bi bi-hand-thumbs-up text-primary" style={{ fontSize: '3rem' }}></i>
                            <h4 className="mt-3">Confiance</h4>
                            <p className="text-muted">
                                Nous garantissons la transparence dans toutes les transactions
                                et la sécurité des données.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 text-center p-4">
                            <i className="bi bi-people text-success" style={{ fontSize: '3rem' }}></i>
                            <h4 className="mt-3">Solidarité</h4>
                            <p className="text-muted">
                                Nous croyons en la force de la communauté pour soutenir
                                les entrepreneurs locaux.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 text-center p-4">
                            <i className="bi bi-lightbulb text-warning" style={{ fontSize: '3rem' }}></i>
                            <h4 className="mt-3">Innovation</h4>
                            <p className="text-muted">
                                Nous soutenons les idées novatrices qui contribuent au
                                développement du Sénégal.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chiffres */}
                <div className="row bg-light rounded p-5 mb-5">
                    <div className="col-12 text-center mb-4">
                        <h2 className="text-primary">DiapalSen en chiffres</h2>
                    </div>
                    <div className="col-md-3 col-6 text-center mb-3">
                        <h3 className="text-primary display-6 fw-bold">12</h3>
                        <p className="text-muted">Catégories</p>
                    </div>
                    <div className="col-md-3 col-6 text-center mb-3">
                        <h3 className="text-success display-6 fw-bold">3</h3>
                        <p className="text-muted">Modes de paiement</p>
                    </div>
                    <div className="col-md-3 col-6 text-center mb-3">
                        <h3 className="text-warning display-6 fw-bold">14</h3>
                        <p className="text-muted">Régions couvertes</p>
                    </div>
                    <div className="col-md-3 col-6 text-center mb-3">
                        <h3 className="text-info display-6 fw-bold">24/7</h3>
                        <p className="text-muted">Disponibilité</p>
                    </div>
                </div>

                {/* Contact */}
                <div className="row">
                    <div className="col-lg-8 mx-auto text-center">
                        <h4 className="text-primary mb-3">Une question ?</h4>
                        <p className="text-muted mb-4">
                            N'hésitez pas à nous contacter pour en savoir plus sur DiapalSen
                        </p>
                        <a href="/contact" className="btn btn-primary btn-lg">
                            <i className="bi bi-envelope me-2"></i>
                            Nous contacter
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AProposPage
