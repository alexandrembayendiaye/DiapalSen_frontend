// src/pages/static/ConfidentialitePage.jsx

const ConfidentialitePage = () => {
    return (
        <div className="confidentialite-page">
            {/* Header */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold">
                        <i className="bi bi-shield-check me-3"></i>
                        Politique de Confidentialité
                    </h1>
                    <p className="lead mb-0">
                        Protection de vos données personnelles
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-5">
                                <h4 className="text-primary mb-3">1. Collecte des données</h4>
                                <p className="text-muted mb-4">
                                    Nous collectons les données que vous nous fournissez lors de votre
                                    inscription et utilisation de la plateforme : nom, email, téléphone,
                                    informations de paiement et données de navigation.
                                </p>

                                <h4 className="text-primary mb-3">2. Utilisation des données</h4>
                                <p className="text-muted mb-4">
                                    Vos données sont utilisées pour :<br />
                                    • Gérer votre compte et vos transactions<br />
                                    • Vous envoyer des notifications importantes<br />
                                    • Améliorer nos services<br />
                                    • Respecter nos obligations légales
                                </p>

                                <h4 className="text-primary mb-3">3. Protection des données</h4>
                                <p className="text-muted mb-4">
                                    Nous mettons en œuvre des mesures de sécurité techniques et
                                    organisationnelles pour protéger vos données contre tout accès
                                    non autorisé, modification ou divulgation.
                                </p>

                                <h4 className="text-primary mb-3">4. Partage des données</h4>
                                <p className="text-muted mb-4">
                                    Nous ne vendons jamais vos données. Elles peuvent être partagées
                                    avec nos partenaires de paiement (Wave, Orange Money, Free Money)
                                    uniquement pour traiter vos transactions.
                                </p>

                                <h4 className="text-primary mb-3">5. Vos droits</h4>
                                <p className="text-muted mb-4">
                                    Vous disposez d'un droit d'accès, de rectification et de suppression
                                    de vos données. Contactez-nous pour exercer ces droits.
                                </p>

                                <h4 className="text-primary mb-3">6. Cookies</h4>
                                <p className="text-muted mb-4">
                                    Nous utilisons des cookies pour améliorer votre expérience sur
                                    la plateforme. Vous pouvez les désactiver dans les paramètres
                                    de votre navigateur.
                                </p>

                                <h4 className="text-primary mb-3">7. Contact</h4>
                                <p className="text-muted">
                                    Pour toute question relative à vos données :
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

export default ConfidentialitePage
