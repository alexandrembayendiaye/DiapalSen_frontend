// src/components/contributions/ContributionModal.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal, Button } from 'react-bootstrap'
import toast from 'react-hot-toast'
import contributionsService from '../../services/contributionsService'
import { useAuth } from '../../contexts/AuthContext.jsx'

const ContributionModal = ({ show, onHide, project, onSuccess }) => {
    const { user, isAuthenticated } = useAuth()
    const [loading, setLoading] = useState(false)
    const [simulationLoading, setSimulationLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            montant: '',
            message_soutien: '',
            est_anonyme: false,
            moyen_paiement: 'wave'
        }
    })

    const montantValue = watch('montant')

    // Options des moyens de paiement
    const moyensPaiement = [
        { value: 'wave', label: 'Wave', fees: '1%', color: '#ff6b35' },
        { value: 'orange_money', label: 'Orange Money', fees: '1.5%', color: '#ff8800' },
        { value: 'free_money', label: 'Free Money', fees: '0.8%', color: '#00b4d8' }
    ]

    // Calculer les frais
    const calculerFrais = (montant, moyenPaiement) => {
        if (!montant) return 0
        const pourcentage = moyensPaiement.find(m => m.value === moyenPaiement)?.fees || '1%'
        const taux = parseFloat(pourcentage.replace('%', '')) / 100
        return Math.round(montant * taux)
    }

    const montantAvecFrais = parseInt(montantValue) || 0
    const frais = calculerFrais(montantAvecFrais, watch('moyen_paiement'))
    const montantTotal = montantAvecFrais + frais

    // Nouveau pourcentage du projet après contribution
    const nouveauPourcentage = project ?
        ((parseInt(project.montant_collecte) + montantAvecFrais) / parseInt(project.montant_objectif) * 100).toFixed(1) : 0

    const onSubmit = async (data) => {
        if (!isAuthenticated) {
            toast.error('Vous devez être connecté pour contribuer')
            return
        }

        try {
            setLoading(true)
            setSimulationLoading(true)

            // Préparer les données
            const contributionData = {
                projet: project.id,
                montant: parseInt(data.montant),
                message_soutien: data.message_soutien || '',
                est_anonyme: data.est_anonyme,
                moyen_paiement: data.moyen_paiement
            }

            console.log('🔄 Soumission contribution:', contributionData)
            console.log('📋 Données envoyées:', contributionData)
            console.log('📋 Projet ID:', project.id)
            console.log('📋 URL complète:', `/contributions/projet/${project.id}/contribuer/`)


            // Appeler l'API de contribution
            const result = await contributionsService.contribuer(project.id, contributionData)

            console.log('🔍 STRUCTURE COMPLÈTE result:', JSON.stringify(result, null, 2))


            // Simuler le délai de paiement pour UX réaliste
            setTimeout(() => {
                setSimulationLoading(false)

                // ✅ Vérifier le bon champ selon la réponse Django
                if (result.message === "Paiement traité avec succès") {
                    toast.success(`Contribution de ${contributionData.montant.toLocaleString()} FCFA réussie ! 🎉`)

                    // Fermer modal et notifier parent
                    reset()
                    onHide()
                    if (onSuccess) {
                        onSuccess(result)
                    }
                } else {
                    toast.error('Le paiement a échoué. Veuillez réessayer.')
                }

                setLoading(false)
            }, 2000)
        } catch (error) {
            console.error('❌ Erreur contribution:', error)
            setSimulationLoading(false)
            setLoading(false)

            if (error?.message) {
                toast.error(error.message)
            } else {
                toast.error('Erreur lors de la contribution')
            }
        }
    }

    const handleClose = () => {
        if (!loading) {
            reset()
            onHide()
        }
    }

    if (!project) return null

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="text-primary">
                    <i className="bi bi-heart-fill me-2"></i>
                    Soutenir ce projet
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-4">
                {/* Info projet */}
                <div className="bg-light rounded p-3 mb-4">
                    <h6 className="fw-bold mb-2">{project.titre}</h6>
                    <div className="row text-center">
                        <div className="col-4">
                            <div className="text-success fw-bold">
                                {parseInt(project.montant_collecte).toLocaleString()} FCFA                            </div>
                            <small className="text-muted">collectés</small>
                        </div>
                        <div className="col-4">
                            <div className="text-primary fw-bold">{project.nombre_contributeurs}</div>
                            <small className="text-muted">contributeurs</small>
                        </div>
                        <div className="col-4">
                            <div className="text-warning fw-bold">{project.jours_restants}</div>
                            <small className="text-muted">jours restants</small>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    {/* Montant */}
                    <div className="mb-3">
                        <label htmlFor="montant" className="form-label fw-medium">
                            Montant de votre contribution (FCFA) *
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">FCFA</span>
                            <input
                                type="number"
                                className={`form-control ${errors.montant ? 'is-invalid' : ''}`}
                                id="montant"
                                placeholder="1000"
                                min="1000"
                                step="500"
                                {...register('montant', {
                                    required: 'Le montant est obligatoire',
                                    min: {
                                        value: 1000,
                                        message: 'Le montant minimum est de 1 000 FCFA'
                                    }
                                })}
                            />
                            {errors.montant && (
                                <div className="invalid-feedback">
                                    {errors.montant.message}
                                </div>
                            )}
                        </div>
                        <small className="text-muted">Montant minimum : 1 000 FCFA</small>
                    </div>

                    {/* Message de soutien */}
                    <div className="mb-3">
                        <label htmlFor="message_soutien" className="form-label fw-medium">
                            Message de soutien (optionnel)
                        </label>
                        <textarea
                            className="form-control"
                            id="message_soutien"
                            rows="3"
                            placeholder="Encouragez le porteur de projet..."
                            maxLength="500"
                            {...register('message_soutien')}
                        />
                        <small className="text-muted">Maximum 500 caractères</small>
                    </div>

                    {/* Moyen de paiement */}
                    <div className="mb-3">
                        <label className="form-label fw-medium">Moyen de paiement *</label>
                        <div className="row g-2">
                            {moyensPaiement.map(moyen => (
                                <div key={moyen.value} className="col-4">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        id={`payment_${moyen.value}`}
                                        value={moyen.value}
                                        {...register('moyen_paiement')}
                                    />
                                    <label
                                        className="btn btn-outline-primary w-100 p-3"
                                        htmlFor={`payment_${moyen.value}`}
                                        style={{ borderColor: moyen.color }}
                                    >
                                        <div className="fw-bold">{moyen.label}</div>
                                        <small>Frais: {moyen.fees}</small>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Anonymat */}
                    <div className="form-check mb-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="est_anonyme"
                            {...register('est_anonyme')}
                        />
                        <label className="form-check-label" htmlFor="est_anonyme">
                            Contribution anonyme
                            <br />
                            <small className="text-muted">Votre nom ne sera pas affiché publiquement</small>
                        </label>
                    </div>

                    {/* Récapitulatif */}
                    {montantValue && (
                        <div className="bg-light rounded p-3 mb-3">
                            <h6 className="fw-bold mb-2">Récapitulatif de votre contribution</h6>
                            <div className="d-flex justify-content-between mb-1">
                                <span>Montant de base :</span>
                                <span>{parseInt(montantValue || 0).toLocaleString()} FCFA</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                                <span>Frais de transaction :</span>
                                <span>{frais.toLocaleString()} FCFA</span>
                            </div>
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total à payer :</span>
                                <span className="text-primary">{montantTotal.toLocaleString()} FCFA</span>
                            </div>

                            <div className="mt-3 pt-3 border-top">
                                <small className="text-muted">
                                    <strong>Impact de votre contribution :</strong><br />
                                    Le projet passera de {project.pourcentage_atteint}% à {nouveauPourcentage}% de financement
                                </small>
                            </div>
                        </div>
                    )}
                </form>
            </Modal.Body>

            <Modal.Footer className="border-0">
                <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
                    Annuler
                </Button>
                <Button
                    variant="success"
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading || !montantValue}
                >
                    {simulationLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Traitement...</span>
                            </span>
                            Traitement du paiement...
                        </>
                    ) : loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </span>
                            Envoi en cours...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-credit-card me-2"></i>
                            Contribuer {montantTotal > 0 ? montantTotal.toLocaleString() + ' FCFA' : ''}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ContributionModal