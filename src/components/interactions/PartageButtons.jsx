// src/components/interactions/PartageButtons.jsx
import { useState } from 'react'
import toast from 'react-hot-toast'
import interactionsService from '../../services/interactionsService'

const PartageButtons = ({ projet, variant = 'buttons', className = '' }) => {
    console.log('🔍 PartageButtons - Données reçues:', projet)
    console.log('🔍 PartageButtons - Variant:', variant)

    const [partageLoading, setPartageLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    console.log('🔍 Modal state:', showModal)


    // Construire l'URL complète du projet
    const projetUrl = `${window.location.origin}/projets/${projet.id}`

    // Messages de partage
    const getShareMessage = () => {
        return `🚀 Découvrez "${projet.titre}" sur DiapalSen !\n\n` +
            `${projet.description_courte}\n\n` +
            `💰 Objectif : ${Math.round(projet.montant_objectif / 1000000).toFixed(1)}M FCFA\n` +
            `✅ ${projet.pourcentage_atteint}% atteint\n` +
            `⏰ ${projet.jours_restants} jours restants\n\n` +
            `Soutenez l'innovation sénégalaise ! 🇸🇳\n${projetUrl}`
    }

    // Enregistrer le partage côté serveur
    const enregistrerPartage = async (plateforme) => {
        try {
            setPartageLoading(true)
            await interactionsService.partagerProjet(projet.id, plateforme)
            console.log(`✅ Partage ${plateforme} enregistré`)
        } catch (error) {
            console.error(`❌ Erreur enregistrement partage ${plateforme}:`, error)
        } finally {
            setPartageLoading(false)
        }
    }

    // Partager sur WhatsApp
    const partagerWhatsApp = async () => {
        const message = encodeURIComponent(getShareMessage())
        const whatsappUrl = `https://wa.me/?text=${message}`

        await enregistrerPartage('whatsapp')
        window.open(whatsappUrl, '_blank')
        toast.success('Partagé sur WhatsApp !')
    }

    // Partager sur Facebook
    const partagerFacebook = async () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projetUrl)}`

        await enregistrerPartage('facebook')
        window.open(facebookUrl, '_blank', 'width=600,height=400')
        toast.success('Partagé sur Facebook !')
    }

    // Partager sur Twitter
    const partagerTwitter = async () => {
        const message = `🚀 "${projet.titre}" sur @DiapalSen - ${projet.pourcentage_atteint}% financé ! Soutenez l'innovation 🇸🇳`
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(projetUrl)}`

        await enregistrerPartage('twitter')
        window.open(twitterUrl, '_blank', 'width=600,height=400')
        toast.success('Partagé sur Twitter !')
    }

    // Partager par email
    const partagerEmail = async () => {
        const sujet = `Découvrez "${projet.titre}" sur DiapalSen`
        const corps = getShareMessage()
        const emailUrl = `mailto:?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`

        await enregistrerPartage('email')
        window.location.href = emailUrl
        toast.success('Email de partage ouvert !')
    }

    // Copier le lien
    const copierLien = async () => {
        try {
            await navigator.clipboard.writeText(projetUrl)
            await enregistrerPartage('lien_copie')
            toast.success('Lien copié dans le presse-papier !')
        } catch (error) {
            // Fallback pour les navigateurs qui ne supportent pas clipboard
            const textArea = document.createElement('textarea')
            textArea.value = projetUrl
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)

            await enregistrerPartage('lien_copie')
            toast.success('Lien copié !')
        }
    }

    // Variante bouton simple
    if (variant === 'simple') {
        return (
            <button
                className={`btn btn-outline-secondary ${className}`}
                onClick={() => setShowModal(true)}
                disabled={partageLoading}
            >
                <i className="bi bi-share"></i>
                {partageLoading && <span className="spinner-border spinner-border-sm ms-1"></span>}
            </button>
        )
    }

    // Variante boutons multiples
    if (variant === 'buttons') {
        return (
            <div className={`partage-buttons d-flex gap-2 ${className}`}>
                <button
                    onClick={partagerWhatsApp}
                    className="btn btn-success btn-sm"
                    title="Partager sur WhatsApp"
                    disabled={partageLoading}
                >
                    <i className="bi bi-whatsapp"></i>
                </button>

                <button
                    onClick={partagerFacebook}
                    className="btn btn-primary btn-sm"
                    title="Partager sur Facebook"
                    disabled={partageLoading}
                >
                    <i className="bi bi-facebook"></i>
                </button>

                <button
                    onClick={partagerTwitter}
                    className="btn btn-info btn-sm"
                    title="Partager sur Twitter"
                    disabled={partageLoading}
                >
                    <i className="bi bi-twitter"></i>
                </button>

                <button
                    onClick={partagerEmail}
                    className="btn btn-warning btn-sm"
                    title="Partager par email"
                    disabled={partageLoading}
                >
                    <i className="bi bi-envelope"></i>
                </button>

                <button
                    onClick={copierLien}
                    className="btn btn-outline-secondary btn-sm"
                    title="Copier le lien"
                    disabled={partageLoading}
                >
                    <i className="bi bi-link-45deg"></i>
                </button>
            </div>
        )
    }

    // Variante modal complète
    return (
        <>
            <button
                className={`btn btn-outline-secondary ${className}`}
                onClick={() => {
                    console.log('🔍 Bouton partage cliqué !')
                    console.log('🔍 Avant setShowModal, showModal =', showModal)
                    setShowModal(true)
                    console.log('🔍 Après setShowModal')
                }}
                disabled={partageLoading}
            >
                <i className="bi bi-share me-2"></i>
                Partager
                {partageLoading && <span className="spinner-border spinner-border-sm ms-2"></span>}
            </button>

            {/* Modal de partage */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-share me-2"></i>
                                    Partager ce projet
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Preview du projet */}
                                <div className="bg-light rounded p-3 mb-4">
                                    <div className="d-flex align-items-center">
                                        {projet.image_principale && (
                                            <img
                                                src={projet.image_principale}
                                                alt={projet.titre}
                                                className="me-3 rounded"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div>
                                            <h6 className="mb-1">{projet.titre}</h6>
                                            <small className="text-muted">
                                                {projet.pourcentage_atteint}% financé • {projet.jours_restants} jours restants
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* Options de partage */}
                                <div className="row g-3">
                                    <div className="col-6">
                                        <button
                                            onClick={() => { partagerWhatsApp(); setShowModal(false); }}
                                            className="btn btn-outline-success w-100"
                                            disabled={partageLoading}
                                        >
                                            <i className="bi bi-whatsapp me-2"></i>
                                            WhatsApp
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            onClick={() => { partagerFacebook(); setShowModal(false); }}
                                            className="btn btn-outline-primary w-100"
                                            disabled={partageLoading}
                                        >
                                            <i className="bi bi-facebook me-2"></i>
                                            Facebook
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            onClick={() => { partagerTwitter(); setShowModal(false); }}
                                            className="btn btn-outline-info w-100"
                                            disabled={partageLoading}
                                        >
                                            <i className="bi bi-twitter me-2"></i>
                                            Twitter
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            onClick={() => { partagerEmail(); setShowModal(false); }}
                                            className="btn btn-outline-warning w-100"
                                            disabled={partageLoading}
                                        >
                                            <i className="bi bi-envelope me-2"></i>
                                            Email
                                        </button>
                                    </div>
                                </div>

                                {/* Copier le lien */}
                                <div className="mt-4">
                                    <label className="form-label small fw-medium">Ou copiez le lien :</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={projetUrl}
                                            readOnly
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => { copierLien(); setShowModal(false); }}
                                            disabled={partageLoading}
                                        >
                                            <i className="bi bi-clipboard"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PartageButtons