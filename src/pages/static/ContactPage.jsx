// src/pages/static/ContactPage.jsx
import { useState } from 'react'
import toast from 'react-hot-toast'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        sujet: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulation d'envoi
        setTimeout(() => {
            toast.success('Message envoyé avec succès ! Nous vous répondrons bientôt.')
            setFormData({ nom: '', email: '', sujet: '', message: '' })
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="contact-page">
            {/* Header */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold">
                        <i className="bi bi-envelope me-3"></i>
                        Contactez-nous
                    </h1>
                    <p className="lead mb-0">
                        Notre équipe est à votre écoute
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-5">
                    {/* Formulaire */}
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h4 className="text-primary mb-4">Envoyez-nous un message</h4>

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Nom complet *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email *</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Sujet *</label>
                                            <select
                                                className="form-select"
                                                value={formData.sujet}
                                                onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                                                required
                                            >
                                                <option value="">Choisir un sujet</option>
                                                <option value="projet">Question sur un projet</option>
                                                <option value="contribution">Problème de contribution</option>
                                                <option value="compte">Mon compte</option>
                                                <option value="partenariat">Partenariat</option>
                                                <option value="autre">Autre</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Message *</label>
                                            <textarea
                                                className="form-control"
                                                rows="5"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-send me-2"></i>
                                                        Envoyer le message
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Informations */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-4">
                                <h5 className="text-primary mb-4">Nos coordonnées</h5>

                                <div className="d-flex mb-3">
                                    <i className="bi bi-geo-alt text-primary fs-4 me-3"></i>
                                    <div>
                                        <strong>Adresse</strong>
                                        <p className="text-muted mb-0">Dakar, Sénégal</p>
                                    </div>
                                </div>

                                <div className="d-flex mb-3">
                                    <i className="bi bi-envelope text-primary fs-4 me-3"></i>
                                    <div>
                                        <strong>Email</strong>
                                        <p className="text-muted mb-0">contact@diapalsen.com</p>
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <i className="bi bi-telephone text-primary fs-4 me-3"></i>
                                    <div>
                                        <strong>Téléphone</strong>
                                        <p className="text-muted mb-0">+221 XX XXX XX XX</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm bg-light">
                            <div className="card-body p-4">
                                <h5 className="text-primary mb-3">Horaires d'ouverture</h5>
                                <p className="mb-1"><strong>Lundi - Vendredi:</strong> 8h - 18h</p>
                                <p className="mb-0"><strong>Samedi:</strong> 9h - 13h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage
