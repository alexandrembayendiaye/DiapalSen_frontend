// src/pages/static/MentionsLegalesPage.jsx

const MentionsLegalesPage = () => {
    return (
        <div className="mentions-legales-page">
            {/* Header */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold">
                        <i className="bi bi-info-square me-3"></i>
                        Mentions Légales
                    </h1>
                    <p className="lead mb-0">
                        Informations légales de DiapalSen
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-5">
                                <h4 className="text-primary mb-3">Éditeur du site</h4>
                                <p className="text-muted mb-4">
                                    <strong>DiapalSen</strong><br />
                                    Plateforme de financement participatif<br />
                                    Dakar, Sénégal<br />
                                    Email : contact@diapalsen.com
                                </p>

                                <h4 className="text-primary mb-3">Directeur de la publication</h4>
                                <p className="text-muted mb-4">
                                    Le directeur de la publication est le représentant légal de DiapalSen.
                                </p>

                                <h4 className="text-primary mb-3">Hébergement</h4>
                                <p className="text-muted mb-4">
                                    Ce site est hébergé par des services d'hébergement professionnels
                                    garantissant la sécurité et la disponibilité de la plateforme.
                                </p>

                                <h4 className="text-primary mb-3">Propriété intellectuelle</h4>
                                <p className="text-muted mb-4">
                                    L'ensemble du contenu de ce site (textes, images, logos, vidéos)
                                    est protégé par le droit d'auteur. Toute reproduction non autorisée
                                    est strictement interdite.
                                </p>

                                <h4 className="text-primary mb-3">Responsabilité</h4>
                                <p className="text-muted mb-4">
                                    DiapalSen s'efforce d'assurer l'exactitude des informations diffusées
                                    sur ce site mais ne peut garantir leur exhaustivité. La plateforme
                                    décline toute responsabilité pour les dommages résultant de
                                    l'utilisation des informations fournies.
                                </p>

                                <h4 className="text-primary mb-3">Droit applicable</h4>
                                <p className="text-muted">
                                    Ce site est soumis au droit sénégalais. Tout litige relatif à
                                    son utilisation sera soumis aux tribunaux compétents de Dakar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MentionsLegalesPage
