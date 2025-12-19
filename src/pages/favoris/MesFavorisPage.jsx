// src/pages/favoris/MesFavorisPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import interactionsService from '../../services/interactionsService'
import toast from 'react-hot-toast'

// URL de base de l'API pour les images
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const MesFavorisPage = () => {
    const { isAuthenticated } = useAuth()
    const [favoris, setFavoris] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isAuthenticated) {
            chargerFavoris()
        }
    }, [isAuthenticated])

    const chargerFavoris = async () => {
        try {
            setLoading(true)
            const data = await interactionsService.getMesFavoris()
            setFavoris(data.results || data.favoris || data || [])
        } catch (error) {
            console.error('Erreur chargement favoris:', error)
            toast.error('Erreur lors du chargement des favoris')
        } finally {
            setLoading(false)
        }
    }

    const retirerFavori = async (projetId) => {
        try {
            await interactionsService.retirerFavori(projetId)
            toast.success('Projet retiré des favoris')
            chargerFavoris()
        } catch (error) {
            console.error('Erreur retrait favori:', error)
            toast.error('Erreur lors du retrait du favori')
        }
    }

    // Construire l'URL complète de l'image
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        if (imagePath.startsWith('http')) return imagePath
        return `${API_URL}${imagePath}`
    }

    // Formatage des montants
    const formatMontant = (montant) => {
        if (!montant) return '0'
        const num = parseFloat(montant)
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(0)}K`
        }
        return num.toLocaleString('fr-FR')
    }

    // Calculer le pourcentage de financement
    const calculerPourcentage = (projet) => {
        if (!projet.montant_objectif || projet.montant_objectif === 0) return 0
        const pourcentage = (parseFloat(projet.montant_collecte || 0) / parseFloat(projet.montant_objectif)) * 100
        return Math.min(pourcentage, 100).toFixed(1)
    }

    // Couleur de la barre de progression
    const getProgressColor = (pourcentage) => {
        if (pourcentage >= 100) return 'bg-success'
        if (pourcentage >= 50) return 'bg-primary'
        if (pourcentage >= 25) return 'bg-warning'
        return 'bg-info'
    }

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: '56px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3 text-muted">Chargement de vos favoris...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mes-favoris-page min-vh-100">
            {/* Wrapper bleu pour englober le padding et le header */}
            <div className="bg-primary" style={{ paddingTop: '56px' }}>
                {/* Header - collé à la navbar */}
                <div className="text-white py-4">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col">
                                <h1 className="h2 mb-1">
                                    <i className="bi bi-heart-fill me-2"></i>
                                    Mes Favoris
                                </h1>
                                <p className="mb-0 opacity-75">
                                    Les projets que vous avez sauvegardés
                                </p>
                            </div>
                            <div className="col-auto">
                                <span className="badge bg-white text-primary fs-5 px-3 py-2">
                                    {favoris.length} projet{favoris.length > 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu de la page avec fond gris */}
            <div className="bg-light py-4">
                <div className="container">
                    {favoris.length === 0 ? (
                        // Message si aucun favori
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{ width: '100px', height: '100px' }}>
                                    <i className="bi bi-heart text-muted" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h4 className="mt-3">Aucun projet en favori</h4>
                                <p className="text-muted mb-4">
                                    Découvrez des projets intéressants et ajoutez-les à vos favoris en cliquant sur le cœur !
                                </p>
                                <Link to="/projets" className="btn btn-primary btn-lg">
                                    <i className="bi bi-search me-2"></i>
                                    Découvrir des projets
                                </Link>
                            </div>
                        </div>
                    ) : (
                        // Liste des favoris
                        <div className="row g-4">
                            {favoris.map((favori) => {
                                const projet = favori.projet || favori
                                const pourcentage = parseFloat(calculerPourcentage(projet))
                                const imageUrl = getImageUrl(projet.image_principale)

                                return (
                                    <div className="col-md-6 col-lg-4" key={favori.id || projet.id}>
                                        <div className="card h-100 border-0 shadow-sm">
                                            {/* Image du projet */}
                                            <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        className="w-100 h-100"
                                                        alt={projet.titre}
                                                        style={{ objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.onerror = null
                                                            e.target.style.display = 'none'
                                                            e.target.nextSibling.style.display = 'flex'
                                                        }}
                                                    />
                                                ) : null}
                                                {/* Placeholder affiché si pas d'image ou erreur */}
                                                <div
                                                    className="w-100 h-100 bg-gradient d-flex align-items-center justify-content-center"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                                                        display: imageUrl ? 'none' : 'flex'
                                                    }}
                                                >
                                                    <i className="bi bi-image text-white" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
                                                </div>

                                                {/* Overlay gradient */}
                                                <div className="position-absolute bottom-0 start-0 end-0"
                                                    style={{
                                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                                        height: '60%',
                                                        pointerEvents: 'none'
                                                    }}>
                                                </div>

                                                {/* Badge catégorie */}
                                                {projet.categorie_nom && (
                                                    <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
                                                        <i className="bi bi-tag me-1"></i>
                                                        {projet.categorie_nom}
                                                    </span>
                                                )}

                                                {/* Bouton retirer favori */}
                                                <button
                                                    className="position-absolute top-0 end-0 m-2 btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                    onClick={() => retirerFavori(projet.id)}
                                                    title="Retirer des favoris"
                                                    style={{ width: '36px', height: '36px' }}
                                                >
                                                    <i className="bi bi-heart-fill"></i>
                                                </button>

                                                {/* Titre sur l'image */}
                                                <h5 className="position-absolute bottom-0 start-0 m-3 text-white mb-0 fw-bold"
                                                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                                                    {projet.titre}
                                                </h5>
                                            </div>

                                            <div className="card-body">
                                                {/* Description */}
                                                <p className="card-text text-muted small mb-3">
                                                    {(projet.description_courte || projet.description)?.substring(0, 80)}
                                                    {(projet.description_courte || projet.description)?.length > 80 ? '...' : ''}
                                                </p>

                                                {/* Barre de progression */}
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="fw-bold text-success fs-5">
                                                            {formatMontant(projet.montant_collecte || 0)} FCFA
                                                        </span>
                                                        <span className={`badge ${pourcentage >= 100 ? 'bg-success' : 'bg-primary'}`}>
                                                            {pourcentage}%
                                                        </span>
                                                    </div>
                                                    <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                                                        <div
                                                            className={`progress-bar ${getProgressColor(pourcentage)}`}
                                                            role="progressbar"
                                                            style={{
                                                                width: `${pourcentage}%`,
                                                                borderRadius: '5px'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-1">
                                                        <small className="text-muted">
                                                            Objectif: {formatMontant(projet.montant_objectif || 0)} FCFA
                                                        </small>
                                                        <small className="text-muted">
                                                            <i className="bi bi-people me-1"></i>
                                                            {projet.nombre_contributeurs || 0}
                                                        </small>
                                                    </div>
                                                </div>

                                                {/* Info porteur */}
                                                <div className="d-flex align-items-center text-muted small border-top pt-2">
                                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                                        style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                                                        {projet.porteur_nom?.charAt(0)?.toUpperCase() || 'P'}
                                                    </div>
                                                    <span>{projet.porteur_nom || 'Porteur'}</span>
                                                </div>
                                            </div>

                                            <div className="card-footer bg-white border-top-0 pb-3">
                                                <div className="d-grid gap-2">
                                                    <Link
                                                        to={`/projets/${projet.id}`}
                                                        className="btn btn-outline-primary"
                                                    >
                                                        <i className="bi bi-eye me-2"></i>
                                                        Voir le projet
                                                    </Link>
                                                    <Link
                                                        to={`/projets/${projet.id}`}
                                                        className="btn btn-success"
                                                    >
                                                        <i className="bi bi-heart-fill me-2"></i>
                                                        Contribuer
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Bouton retour */}
                    <div className="text-center mt-5 pb-4">
                        <Link to="/projets" className="btn btn-outline-secondary btn-lg">
                            <i className="bi bi-arrow-left me-2"></i>
                            Retour aux projets
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MesFavorisPage
