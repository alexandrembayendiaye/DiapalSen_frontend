// src/pages/static/AidePage.jsx
import { Link } from 'react-router-dom'

const AidePage = () => {
    const faq = [
        {
            question: "Comment créer un projet ?",
            answer: "Pour créer un projet, vous devez d'abord vous inscrire en tant que porteur de projet. Ensuite, cliquez sur 'Créer un projet' et remplissez le formulaire avec les détails de votre projet."
        },
        {
            question: "Comment contribuer à un projet ?",
            answer: "Inscrivez-vous en tant que contributeur, parcourez les projets disponibles et cliquez sur 'Soutenir ce projet'. Choisissez le montant et le moyen de paiement (Wave, Orange Money, Free Money)."
        },
        {
            question: "Quels sont les moyens de paiement acceptés ?",
            answer: "Nous acceptons Wave, Orange Money et Free Money pour faciliter les contributions depuis le Sénégal et la diaspora."
        },
        {
            question: "Que se passe-t-il si un projet n'atteint pas son objectif ?",
            answer: "Cela dépend du modèle de financement choisi. En mode 'Tout-ou-rien', les contributions sont remboursées. En mode 'Flexible', le porteur reçoit les fonds collectés."
        },
        {
            question: "Comment suivre mes contributions ?",
            answer: "Connectez-vous à votre compte et accédez à 'Mes contributions' dans votre tableau de bord pour voir l'historique et l'état de vos contributions."
        },
        {
            question: "Comment contacter le support ?",
            answer: "Envoyez-nous un email à contact@diapalsen.com ou utilisez le formulaire de contact. Notre équipe vous répondra dans les 24-48h."
        }
    ]

    return (
        <div className="aide-page">
            {/* Header */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold">
                        <i className="bi bi-question-circle me-3"></i>
                        Centre d'aide
                    </h1>
                    <p className="lead mb-0">
                        Trouvez les réponses à vos questions
                    </p>
                </div>
            </div>

            <div className="container py-5">
                {/* FAQ */}
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <h2 className="h4 text-primary mb-4">
                            <i className="bi bi-chat-dots me-2"></i>
                            Questions fréquentes
                        </h2>

                        <div className="accordion" id="faqAccordion">
                            {faq.map((item, index) => (
                                <div className="accordion-item" key={index}>
                                    <h2 className="accordion-header">
                                        <button
                                            className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#faq${index}`}
                                        >
                                            {item.question}
                                        </button>
                                    </h2>
                                    <div
                                        id={`faq${index}`}
                                        className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                        data-bs-parent="#faqAccordion"
                                    >
                                        <div className="accordion-body text-muted">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact */}
                        <div className="card border-0 shadow-sm mt-5">
                            <div className="card-body text-center p-5">
                                <i className="bi bi-headset text-primary" style={{ fontSize: '3rem' }}></i>
                                <h4 className="mt-3">Besoin d'aide supplémentaire ?</h4>
                                <p className="text-muted mb-4">
                                    Notre équipe est disponible pour répondre à vos questions
                                </p>
                                <Link to="/contact" className="btn btn-primary">
                                    <i className="bi bi-envelope me-2"></i>
                                    Nous contacter
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AidePage
