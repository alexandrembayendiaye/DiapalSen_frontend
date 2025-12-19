// src/pages/static/ConditionsPage.jsx

const ConditionsPage = () => {
    return (
        <div className="conditions-page">
            {/* Header */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold">
                        <i className="bi bi-file-text me-3"></i>
                        Conditions Générales d'Utilisation
                    </h1>
                    <p className="lead mb-0">
                        Dernière mise à jour : Décembre 2024
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-5">
                                <h4 className="text-primary mb-3">1. Objet</h4>
                                <p className="text-muted mb-4">
                                    Les présentes conditions générales d'utilisation régissent l'accès
                                    et l'utilisation de la plateforme DiapalSen, service de financement
                                    participatif dédié aux projets sénégalais.
                                </p>

                                <h4 className="text-primary mb-3">2. Inscription</h4>
                                <p className="text-muted mb-4">
                                    Pour utiliser nos services, vous devez créer un compte en fournissant
                                    des informations exactes et à jour. Vous êtes responsable de la
                                    confidentialité de vos identifiants de connexion.
                                </p>

                                <h4 className="text-primary mb-3">3. Types de comptes</h4>
                                <p className="text-muted mb-4">
                                    <strong>Contributeur :</strong> Peut soutenir financièrement les projets.<br />
                                    <strong>Porteur de projet :</strong> Peut créer et gérer des campagnes de financement.
                                </p>

                                <h4 className="text-primary mb-3">4. Contributions</h4>
                                <p className="text-muted mb-4">
                                    Les contributions sont effectuées via Wave, Orange Money ou Free Money.
                                    Les conditions de remboursement dépendent du modèle de financement choisi
                                    par le porteur de projet.
                                </p>

                                <h4 className="text-primary mb-3">5. Responsabilités</h4>
                                <p className="text-muted mb-4">
                                    DiapalSen agit en tant qu'intermédiaire et ne garantit pas le succès
                                    des projets. Les porteurs de projet sont responsables de l'exécution
                                    de leurs engagements envers les contributeurs.
                                </p>

                                <h4 className="text-primary mb-3">6. Propriété intellectuelle</h4>
                                <p className="text-muted mb-4">
                                    Le contenu de la plateforme est protégé par le droit d'auteur.
                                    Les utilisateurs conservent les droits sur leurs propres contenus
                                    mais accordent à DiapalSen une licence d'utilisation.
                                </p>

                                <h4 className="text-primary mb-3">7. Modification des CGU</h4>
                                <p className="text-muted mb-4">
                                    DiapalSen se réserve le droit de modifier ces conditions. Les
                                    utilisateurs seront informés des changements significatifs.
                                </p>

                                <h4 className="text-primary mb-3">8. Contact</h4>
                                <p className="text-muted">
                                    Pour toute question concernant ces conditions, contactez-nous à :
                                    <strong> contact@diapalsen.com</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConditionsPage
