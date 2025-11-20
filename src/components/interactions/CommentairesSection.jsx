// src/components/interactions/CommentairesSection.jsx
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext.jsx'
import interactionsService from '../../services/interactionsService'

const CommentairesSection = ({ projet }) => {
    const { user, isAuthenticated } = useAuth()
    const [commentaires, setCommentaires] = useState([])
    const [loading, setLoading] = useState(true)
    const [ajoutLoading, setAjoutLoading] = useState(false)
    const [commentaireParent, setCommentaireParent] = useState(null) // Pour les réponses

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            contenu: ''
        }
    })

    // Charger les commentaires au montage
    useEffect(() => {
        if (projet?.id) {
            chargerCommentaires()
        }
    }, [projet?.id])

    const chargerCommentaires = async () => {
        try {
            setLoading(true)
            const data = await interactionsService.getCommentairesProjet(projet.id)
            setCommentaires(data.results || data)
        } catch (error) {
            console.error('❌ Erreur chargement commentaires:', error)
            toast.error('Erreur lors du chargement des commentaires')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (formData) => {
        if (!isAuthenticated) {
            toast.error('Vous devez être connecté pour commenter')
            return
        }

        try {
            setAjoutLoading(true)

            const commentaireData = {
                contenu: formData.contenu,
                commentaire_parent: commentaireParent?.id || null
            }

            const result = await interactionsService.ajouterCommentaire(projet.id, commentaireData)

            toast.success(result.message || 'Commentaire ajouté avec succès !')

            // Recharger les commentaires
            await chargerCommentaires()

            // Reset formulaire
            reset()
            setCommentaireParent(null)

        } catch (error) {
            console.error('❌ Erreur ajout commentaire:', error)
            if (error?.contenu) {
                toast.error(error.contenu[0])
            } else {
                toast.error('Erreur lors de l\'ajout du commentaire')
            }
        } finally {
            setAjoutLoading(false)
        }
    }

    const repondreAuCommentaire = (commentaire) => {
        setCommentaireParent(commentaire)
        // Focus sur le textarea
        document.getElementById('nouveau-commentaire')?.focus()
    }

    const annulerReponse = () => {
        setCommentaireParent(null)
        reset()
    }

    // Formatage de la date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const contenuValue = watch('contenu')

    return (
        <div className="commentaires-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">
                    <i className="bi bi-chat-dots me-2 text-primary"></i>
                    Commentaires ({commentaires.length})
                </h5>
            </div>

            {/* Formulaire nouveau commentaire */}
            {isAuthenticated ? (
                <div className="mb-4">
                    <div className="card border-primary">
                        <div className="card-body">
                            {commentaireParent && (
                                <div className="bg-light rounded p-3 mb-3">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <small className="text-muted">
                                                <i className="bi bi-reply me-1"></i>
                                                Répondre à <strong>{commentaireParent.auteur_nom}</strong>
                                            </small>
                                            <div className="mt-1 small text-muted">
                                                "{commentaireParent.contenu.substring(0, 100)}..."
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={annulerReponse}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label htmlFor="nouveau-commentaire" className="form-label">
                                        {commentaireParent ? 'Votre réponse' : 'Votre commentaire'}
                                    </label>
                                    <textarea
                                        id="nouveau-commentaire"
                                        className={`form-control ${errors.contenu ? 'is-invalid' : ''}`}
                                        rows="4"
                                        placeholder={commentaireParent ? 'Rédigez votre réponse...' : 'Partagez votre avis sur ce projet...'}
                                        {...register('contenu', {
                                            required: 'Le commentaire ne peut pas être vide',
                                            minLength: {
                                                value: 10,
                                                message: 'Le commentaire doit faire au moins 10 caractères'
                                            },
                                            maxLength: {
                                                value: 1000,
                                                message: 'Le commentaire ne doit pas dépasser 1000 caractères'
                                            }
                                        })}
                                    />
                                    {errors.contenu && (
                                        <div className="invalid-feedback">
                                            {errors.contenu.message}
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between mt-2">
                                        <small className="text-muted">
                                            Soyez respectueux et constructif
                                        </small>
                                        <small className={`text-muted ${contenuValue?.length > 900 ? 'text-warning' : ''}`}>
                                            {contenuValue?.length || 0}/1000
                                        </small>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={ajoutLoading}
                                    >
                                        {ajoutLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Envoi...</span>
                                                </span>
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-send me-2"></i>
                                                {commentaireParent ? 'Répondre' : 'Commenter'}
                                            </>
                                        )}
                                    </button>

                                    {commentaireParent && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={annulerReponse}
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-info mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    <a href="/login" className="alert-link">Connectez-vous</a> pour laisser un commentaire et soutenir ce projet !
                </div>
            )}

            {/* Liste des commentaires */}
            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement des commentaires...</p>
                </div>
            ) : commentaires.length > 0 ? (
                <div className="commentaires-liste">
                    {commentaires.map((commentaire) => (
                        <div key={commentaire.id} className="commentaire-principal mb-4">
                            <div className="card border-light">
                                <div className="card-body">
                                    <div className="d-flex align-items-start">
                                        {/* Avatar */}
                                        <div className="me-3">
                                            {commentaire.auteur_photo ? (
                                                <img
                                                    src={commentaire.auteur_photo}
                                                    alt={commentaire.auteur_nom}
                                                    className="rounded-circle"
                                                    width="40"
                                                    height="40"
                                                />
                                            ) : (
                                                <div
                                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                    style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}
                                                >
                                                    {commentaire.auteur_nom.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow-1">
                                            {/* En-tête commentaire */}
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <strong className="text-dark">
                                                        {commentaire.auteur_nom}
                                                        {commentaire.est_reponse_porteur && (
                                                            <span className="badge bg-success ms-2 small">
                                                                Porteur de projet
                                                            </span>
                                                        )}
                                                    </strong>
                                                    <div className="small text-muted">
                                                        {formatDate(commentaire.date_creation)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contenu commentaire */}
                                            <div className="mb-3">
                                                <p className="mb-0">{commentaire.contenu}</p>
                                            </div>

                                            {/* Actions commentaire */}
                                            <div className="d-flex align-items-center gap-3">
                                                {commentaire.peut_repondre && isAuthenticated && (
                                                    <button
                                                        className="btn btn-link btn-sm p-0 text-muted"
                                                        onClick={() => repondreAuCommentaire(commentaire)}
                                                    >
                                                        <i className="bi bi-reply me-1"></i>
                                                        Répondre
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Réponses au commentaire */}
                                    {commentaire.reponses && commentaire.reponses.length > 0 && (
                                        <div className="mt-4 ps-5">
                                            <div className="border-start border-2 border-light ps-3">
                                                {commentaire.reponses.map((reponse) => (
                                                    <div key={reponse.id} className="mb-3">
                                                        <div className="d-flex align-items-start">
                                                            <div className="me-2">
                                                                {reponse.auteur_photo ? (
                                                                    <img
                                                                        src={reponse.auteur_photo}
                                                                        alt={reponse.auteur_nom}
                                                                        className="rounded-circle"
                                                                        width="32"
                                                                        height="32"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                                        style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}
                                                                    >
                                                                        {reponse.auteur_nom.charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="bg-light rounded p-2">
                                                                    <div className="small">
                                                                        <strong>
                                                                            {reponse.auteur_nom}
                                                                            {reponse.est_reponse_porteur && (
                                                                                <span className="badge bg-success ms-1 smaller">
                                                                                    Porteur
                                                                                </span>
                                                                            )}
                                                                        </strong>
                                                                    </div>
                                                                    <div className="mt-1">{reponse.contenu}</div>
                                                                </div>
                                                                <small className="text-muted ms-2">
                                                                    {formatDate(reponse.date_creation)}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="bi bi-chat-dots text-muted display-4"></i>
                    <h5 className="mt-3 text-muted">Aucun commentaire pour l'instant</h5>
                    <p className="text-muted">
                        Soyez le premier à donner votre avis sur ce projet !
                    </p>
                </div>
            )}
        </div>
    )
}

export default CommentairesSection