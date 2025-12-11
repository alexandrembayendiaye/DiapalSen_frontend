import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import projectsService from '../../services/projectsService'
import toast from 'react-hot-toast'

// URL de base du backend pour les médias
const BACKEND_URL = 'http://127.0.0.1:8000'

// Helper pour construire l'URL complète des médias
const getMediaUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${BACKEND_URL}${path}`
}

const REGIONS_SENEGAL = [
    { value: 'dakar', label: 'Dakar' },
    { value: 'thies', label: 'Thiès' },
    { value: 'saint-louis', label: 'Saint-Louis' },
    { value: 'diourbel', label: 'Diourbel' },
    { value: 'louga', label: 'Louga' },
    { value: 'fatick', label: 'Fatick' },
    { value: 'kaolack', label: 'Kaolack' },
    { value: 'kolda', label: 'Kolda' },
    { value: 'matam', label: 'Matam' },
    { value: 'tambacounda', label: 'Tambacounda' },
    { value: 'kaffrine', label: 'Kaffrine' },
    { value: 'kedougou', label: 'Kédougou' },
    { value: 'sedhiou', label: 'Sédhiou' },
    { value: 'ziguinchor', label: 'Ziguinchor' }
]

const ModifierProjetPage = () => {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const { user, isPorteur } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [projet, setProjet] = useState(null)
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        titre: '',
        description_courte: '',
        description_complete: '',
        categorie: '',
        montant_objectif: '',
        region: '',
        ville: '',
        video_url: '',
        duree_campagne_jours: 30
    })
    const [imagePreview, setImagePreview] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [budgetFile, setBudgetFile] = useState(null)
    const [businessPlanFile, setBusinessPlanFile] = useState(null)
    const [errors, setErrors] = useState({})


    useEffect(() => {
        if (!isPorteur()) {
            toast.error('Accès réservé aux porteurs de projet')
            navigate('/dashboard')
            return
        }
        loadProjet()
        loadCategories()
    }, [projectId])
    useEffect(() => {
        if (projet) {
            validateForm()
        }
    }, [formData])

    const loadCategories = async () => {
        try {
            const data = await projectsService.getCategories()
            setCategories(data.results || [])
        } catch (error) {
            console.error('Erreur chargement catégories:', error)
        }
    }

    const loadProjet = async () => {
        try {
            setLoading(true)
            const data = await projectsService.getMonProjet(projectId)

            if (data.porteur.id !== user.id) {
                toast.error('Vous n\'êtes pas le porteur de ce projet')
                navigate('/mes-projets')
                return
            }

            if (data.statut === 'termine' || data.statut === 'rejete') {
                toast.error('Ce projet ne peut plus être modifié')
                navigate('/mes-projets')
                return
            }

            setProjet(data)
            setFormData({
                titre: data.titre || '',
                description_courte: data.description_courte || '',
                description_complete: data.description_complete || '',
                categorie: data.categorie?.id || '',
                montant_objectif: data.montant_objectif || '',
                region: data.region || '',
                ville: data.ville || '',
                video_url: data.video_url || '',
                duree_campagne_jours: data.duree_campagne_jours || 30
            })
        } catch (error) {
            console.error('Erreur chargement projet:', error)
            toast.error('Erreur lors du chargement du projet')
            navigate('/mes-projets')
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Fichier image invalide')
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image trop grande (max 5MB)')
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target.result)
            reader.readAsDataURL(file)
            setImageFile(file)
        }
    }

    const handleBudgetChange = (event) => {
        const file = event.target.files[0]
        if (file && file.type === 'application/pdf') {
            setBudgetFile(file)
        } else {
            toast.error('Seuls les fichiers PDF sont acceptés')
        }
    }

    const handleBusinessPlanChange = (event) => {
        const file = event.target.files[0]
        if (file && file.type === 'application/pdf') {
            setBusinessPlanFile(file)
        } else {
            toast.error('Seuls les fichiers PDF sont acceptés')
        }
    }
    const validateForm = () => {
        const newErrors = {}

        // Déterminer quels champs valider selon le statut
        const statut = projet?.statut || 'brouillon'

        // Projet actif : seulement description_complete
        if (statut === 'actif') {
            if (!formData.description_complete || formData.description_complete.length < 100) {
                newErrors.description_complete = 'La description complète doit contenir au moins 100 caractères'
            }
        }
        // Projet en_attente : description, région, ville
        else if (statut === 'en_attente') {
            if (!formData.description_courte || formData.description_courte.length < 20) {
                newErrors.description_courte = 'La description courte doit contenir au moins 20 caractères'
            }

            if (!formData.description_complete || formData.description_complete.length < 100) {
                newErrors.description_complete = 'La description complète doit contenir au moins 100 caractères'
            }

            if (!formData.region) {
                newErrors.region = 'La région est obligatoire'
            }

            if (!formData.ville || formData.ville.length < 2) {
                newErrors.ville = 'La ville est obligatoire'
            }
        }
        // Brouillon : tous les champs
        else {
            if (!formData.titre || formData.titre.length < 10) {
                newErrors.titre = 'Le titre doit contenir au moins 10 caractères'
            }

            if (!formData.description_courte || formData.description_courte.length < 20) {
                newErrors.description_courte = 'La description courte doit contenir au moins 20 caractères'
            }

            if (!formData.description_complete || formData.description_complete.length < 100) {
                newErrors.description_complete = 'La description complète doit contenir au moins 100 caractères'
            }

            if (!formData.categorie) {
                newErrors.categorie = 'La catégorie est obligatoire'
            }

            const montant = parseInt(formData.montant_objectif)
            if (!montant || montant < 100000) {
                newErrors.montant_objectif = 'Le montant minimum est 100 000 FCFA'
            }

            if (!formData.region) {
                newErrors.region = 'La région est obligatoire'
            }

            if (!formData.ville || formData.ville.length < 2) {
                newErrors.ville = 'La ville est obligatoire'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation avant soumission (seulement pour brouillon)
        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs avant de continuer')
            return
        }
        try {
            setSaving(true)

            // Préparer les données selon le statut du projet (objet simple, pas FormData)
            let projectData = {}

            if (projet.statut === 'actif') {
                // Projet actif : SEULEMENT description_complete et video_url
                projectData = {
                    description_complete: formData.description_complete,
                    video_url: formData.video_url || ''
                }
            } else if (projet.statut === 'en_attente') {
                // En attente : TOUT SAUF titre, montant, catégorie, dates, type_financement
                projectData = {
                    description_courte: formData.description_courte,
                    description_complete: formData.description_complete,
                    region: formData.region,
                    ville: formData.ville,
                    video_url: formData.video_url || ''
                }
            } else {
                // Brouillon : TOUS les champs
                projectData = {
                    titre: formData.titre,
                    description_courte: formData.description_courte,
                    description_complete: formData.description_complete,
                    categorie: parseInt(formData.categorie),
                    montant_objectif: parseInt(formData.montant_objectif),
                    region: formData.region,
                    ville: formData.ville,
                    video_url: formData.video_url || '',
                    duree_campagne_jours: parseInt(formData.duree_campagne_jours)
                }
            }

            console.log('🔄 Données à envoyer:', projectData)

            // Mettre à jour le projet (utilise PATCH pour mise à jour partielle)
            await projectsService.updateProjet(projectId, projectData)

            // Upload des fichiers SÉPARÉMENT (comme dans la création)
            if (imageFile) {
                try {
                    await projectsService.uploadImage(projectId, imageFile)
                    console.log('✅ Image uploadée')
                } catch (uploadError) {
                    console.warn('❌ Erreur upload image:', uploadError)
                    toast.error('Projet modifié mais erreur upload image')
                }
            }

            if (budgetFile) {
                try {
                    await projectsService.uploadDocument(projectId, budgetFile, 'budget')
                    console.log('✅ Document budget uploadé')
                } catch (uploadError) {
                    console.warn('❌ Erreur upload budget:', uploadError)
                    toast.error('Projet modifié mais erreur upload budget')
                }
            }

            if (businessPlanFile) {
                try {
                    await projectsService.uploadDocument(projectId, businessPlanFile, 'business_plan')
                    console.log('✅ Business plan uploadé')
                } catch (uploadError) {
                    console.warn('❌ Erreur upload business plan:', uploadError)
                    toast.error('Projet modifié mais erreur upload business plan')
                }
            }

            toast.success('Projet modifié avec succès !')
            navigate('/mes-projets')
        } catch (error) {
            console.error('Erreur modification projet:', error)

            // Gestion d'erreurs comme dans la création
            if (error.message) {
                toast.error(error.message)
            } else if (typeof error === 'object') {
                const firstError = Object.values(error)[0]
                if (Array.isArray(firstError)) {
                    toast.error(firstError[0])
                } else {
                    toast.error('Erreur lors de la modification du projet')
                }
            } else {
                toast.error('Erreur lors de la modification du projet')
            }
        } finally {
            setSaving(false)
        }
    }

    const isFieldDisabled = (fieldName) => {
        if (!projet) return false

        if (projet.statut === 'actif') {
            return !['description_complete', 'video_url', 'image_principale', 'document_budget', 'document_business_plan'].includes(fieldName)
        }

        if (projet.statut === 'en_attente') {
            return ['titre', 'montant_objectif', 'categorie', 'duree_campagne_jours'].includes(fieldName)
        }

        return false
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement du projet...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="modifier-projet-page bg-light min-vh-100 py-4">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/mes-projets">Mes projets</Link>
                                </li>
                                <li className="breadcrumb-item active">Modifier</li>
                            </ol>
                        </nav>
                        <h1 className="h2">
                            <i className="bi bi-pencil me-2 text-primary"></i>
                            Modifier le projet
                        </h1>
                        <p className="text-muted">{projet?.titre}</p>
                    </div>
                </div>

                {projet?.statut === 'actif' && (
                    <div className="alert alert-warning mb-4">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>Projet actif :</strong> Seules la description complète et la vidéo peuvent être modifiées.
                    </div>
                )}

                {projet?.statut === 'en_attente' && (
                    <div className="alert alert-info mb-4">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>En attente de validation :</strong> Certains champs ne peuvent plus être modifiés.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label className="form-label fw-bold">Titre du projet *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.titre ? 'is-invalid' : ''}`}
                                    value={formData.titre}
                                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                    disabled={isFieldDisabled('titre')}
                                    required
                                />
                                {errors.titre && (
                                    <div className="invalid-feedback">{errors.titre}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Description courte *</label>
                                <textarea
                                    className={`form-control ${errors.description_courte ? 'is-invalid' : ''}`}
                                    rows="2"
                                    value={formData.description_courte}
                                    onChange={(e) => setFormData({ ...formData, description_courte: e.target.value })}
                                    disabled={isFieldDisabled('description_courte')}
                                    required
                                />
                                {errors.description_courte && (
                                    <div className="invalid-feedback">{errors.description_courte}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Description complète *</label>
                                <textarea
                                    className={`form-control ${errors.description_complete ? 'is-invalid' : ''}`}
                                    rows="8"
                                    value={formData.description_complete}
                                    onChange={(e) => setFormData({ ...formData, description_complete: e.target.value })}
                                    disabled={isFieldDisabled('description_complete')}
                                    required
                                />
                                {errors.description_complete && (
                                    <div className="invalid-feedback">{errors.description_complete}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Catégorie *</label>
                                <select
                                    className={`form-select ${errors.categorie ? 'is-invalid' : ''}`}
                                    value={formData.categorie}
                                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                                    disabled={isFieldDisabled('categorie')}
                                    required
                                >
                                    <option value="">Sélectionnez une catégorie</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icone} {cat.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.categorie && (
                                    <div className="invalid-feedback">{errors.categorie}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Montant objectif (FCFA) *</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.montant_objectif ? 'is-invalid' : ''}`}
                                    value={formData.montant_objectif}
                                    onChange={(e) => setFormData({ ...formData, montant_objectif: e.target.value })}
                                    disabled={isFieldDisabled('montant_objectif')}
                                    min="100000"
                                    max="10000000"
                                    required
                                />
                                {errors.montant_objectif && (
                                    <div className="invalid-feedback">{errors.montant_objectif}</div>
                                )}
                                <small className="text-muted">Minimum: 100 000 FCFA - Maximum: 10 000 000 FCFA</small>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Durée de la campagne (jours) *</label>
                                <select
                                    className="form-select"
                                    value={formData.duree_campagne_jours}
                                    onChange={(e) => setFormData({ ...formData, duree_campagne_jours: e.target.value })}
                                    disabled={isFieldDisabled('duree_campagne_jours')}
                                >
                                    <option value="15">15 jours</option>
                                    <option value="30">30 jours</option>
                                    <option value="45">45 jours</option>
                                    <option value="60">60 jours</option>
                                    <option value="90">90 jours</option>
                                </select>
                                <small className="text-muted">Durée pendant laquelle votre projet sera en financement</small>
                            </div>


                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Région *</label>
                                    <select
                                        className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        disabled={isFieldDisabled('region')}
                                        required
                                    >
                                        <option value="">Sélectionnez une région</option>
                                        {REGIONS_SENEGAL.map(region => (
                                            <option key={region.value} value={region.value}>
                                                {region.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.region && (
                                        <div className="invalid-feedback">{errors.region}</div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Ville *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.ville ? 'is-invalid' : ''}`}
                                        value={formData.ville}
                                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                        disabled={isFieldDisabled('ville')}
                                        required
                                    />
                                    {errors.ville && (
                                        <div className="invalid-feedback">{errors.ville}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Vidéo YouTube (optionnel)</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={formData.video_url}
                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                    disabled={isFieldDisabled('video_url')}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Image principale</label>
                                {projet?.image_principale && !imagePreview && (
                                    <div className="mb-2">
                                        <img
                                            src={getMediaUrl(projet.image_principale)}
                                            alt="Image actuelle"
                                            className="img-thumbnail"
                                            style={{ maxHeight: '200px' }}
                                        />
                                        <p className="text-muted small mt-1">Image actuelle</p>
                                    </div>
                                )}
                                {imagePreview && (
                                    <div className="mb-2">
                                        <img
                                            src={imagePreview}
                                            alt="Nouvelle image"
                                            className="img-thumbnail"
                                            style={{ maxHeight: '200px' }}
                                        />
                                        <p className="text-success small mt-1">Nouvelle image sélectionnée</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isFieldDisabled('image_principale')}
                                />
                                <small className="text-muted">Format: JPG, PNG. Max: 5MB</small>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Document Budget (PDF)</label>
                                {projet?.document_budget && (
                                    <div className="mb-2">
                                        <a href={getMediaUrl(projet.document_budget)} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                            <i className="bi bi-file-pdf me-2"></i>
                                            Voir le document actuel
                                        </a>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf"
                                    onChange={handleBudgetChange}
                                    disabled={isFieldDisabled('document_budget')}
                                />
                                <small className="text-muted">Format: PDF uniquement</small>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Business Plan (PDF)</label>
                                {projet?.document_business_plan && (
                                    <div className="mb-2">
                                        <a href={getMediaUrl(projet.document_business_plan)} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                            <i className="bi bi-file-pdf me-2"></i>
                                            Voir le document actuel
                                        </a>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf"
                                    onChange={handleBusinessPlanChange}
                                    disabled={isFieldDisabled('document_business_plan')}
                                />
                                <small className="text-muted">Format: PDF uniquement</small>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top d-flex justify-content-between">
                            <Link to="/mes-projets" className="btn btn-outline-secondary">
                                <i className="bi bi-x-circle me-2"></i>
                                Annuler
                            </Link>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-2"></i>
                                        Enregistrer les modifications
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModifierProjetPage