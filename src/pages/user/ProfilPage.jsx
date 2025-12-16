// src/pages/user/ProfilPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

// Régions avec clé (valeur backend) et label (affichage)
const REGIONS_SENEGAL = [
    { value: "dakar", label: "Dakar" },
    { value: "thies", label: "Thiès" },
    { value: "diourbel", label: "Diourbel" },
    { value: "fatick", label: "Fatick" },
    { value: "kaolack", label: "Kaolack" },
    { value: "kolda", label: "Kolda" },
    { value: "louga", label: "Louga" },
    { value: "matam", label: "Matam" },
    { value: "saint-louis", label: "Saint-Louis" },
    { value: "tambacounda", label: "Tambacounda" },
    { value: "ziguinchor", label: "Ziguinchor" },
    { value: "kaffrine", label: "Kaffrine" },
    { value: "kedougou", label: "Kédougou" },
    { value: "sedhiou", label: "Sédhiou" }
]

const ProfilPage = () => {
    const { user, updateUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        telephone: '',
        biographie: '',
        region: '',
        ville: ''
    })
    const [errors, setErrors] = useState({})
    const [photoPreview, setPhotoPreview] = useState(null)
    const [newPhoto, setNewPhoto] = useState(null)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            setLoading(true)
            const data = await authService.getProfile()
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                telephone: data.telephone || '',
                biographie: data.biographie || '',
                region: data.region || '',
                ville: data.ville || ''
            })
            if (data.photo_profil) {
                setPhotoPreview(data.photo_profil)
            }
            setErrors({})
        } catch (error) {
            console.error('Erreur chargement profil:', error)
            toast.error('Erreur lors du chargement du profil')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('La photo ne doit pas dépasser 5 Mo')
                return
            }

            // Tronquer le nom de fichier si trop long (max 80 caractères)
            let newFile = file
            if (file.name.length > 80) {
                const extension = file.name.split('.').pop()
                const baseName = file.name.substring(0, 70)
                const newName = `${baseName}.${extension}`
                newFile = new File([file], newName, { type: file.type })
            }

            setNewPhoto(newFile)
            setPhotoPreview(URL.createObjectURL(file))
            // Effacer l'erreur photo si présente
            if (errors.photo_profil) {
                setErrors(prev => ({ ...prev, photo_profil: null }))
            }
        }
    }

    // Formater le téléphone au format sénégalais
    const formatPhone = (phone) => {
        if (!phone) return ''
        // Supprimer tout sauf les chiffres et le +
        let cleaned = phone.replace(/[^\d+]/g, '')
        // Si commence par 0, le retirer
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1)
        }
        // Si n'a pas +221, l'ajouter si besoin
        if (cleaned.length === 9 && !cleaned.startsWith('+')) {
            cleaned = '+221' + cleaned
        }
        return cleaned
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        try {
            setSaving(true)

            const updateData = { ...formData }

            // Formater le téléphone
            if (updateData.telephone) {
                updateData.telephone = formatPhone(updateData.telephone)
            }

            if (newPhoto) {
                updateData.photo_profil = newPhoto
            }

            const result = await authService.updateProfile(updateData)

            // Mettre à jour le contexte
            if (updateUser && result.user) {
                updateUser(result.user)
            }

            toast.success('Profil mis à jour avec succès !')
            setEditMode(false)
            setNewPhoto(null)
        } catch (error) {
            console.error('Erreur mise à jour profil:', error)

            // Gérer les erreurs de validation du backend
            if (typeof error === 'object' && error !== null) {
                const fieldErrors = {}
                Object.keys(error).forEach(field => {
                    if (Array.isArray(error[field])) {
                        fieldErrors[field] = error[field][0]
                    } else if (typeof error[field] === 'string') {
                        fieldErrors[field] = error[field]
                    }
                })
                setErrors(fieldErrors)
                toast.error('Veuillez corriger les erreurs dans le formulaire')
            } else {
                toast.error(error.message || 'Erreur lors de la mise à jour')
            }
        } finally {
            setSaving(false)
        }
    }

    const cancelEdit = () => {
        setEditMode(false)
        setNewPhoto(null)
        setErrors({})
        loadProfile() // Recharger les données originales
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement du profil...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="profil-page">
            {/* Header */}
            <div className="bg-primary text-white py-4 mb-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <nav aria-label="breadcrumb" className="mb-2">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard" className="text-white">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active text-white-50">Mon profil</li>
                                </ol>
                            </nav>
                            <h1 className="h3 mb-0">
                                <i className="bi bi-person-circle me-2"></i>
                                Mon profil
                            </h1>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            {!editMode ? (
                                <button
                                    className="btn btn-light"
                                    onClick={() => setEditMode(true)}
                                >
                                    <i className="bi bi-pencil me-2"></i>
                                    Modifier
                                </button>
                            ) : (
                                <button
                                    className="btn btn-outline-light"
                                    onClick={cancelEdit}
                                >
                                    <i className="bi bi-x me-2"></i>
                                    Annuler
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    {/* Photo de profil */}
                    <div className="col-lg-4 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5">
                                <div className="position-relative d-inline-block mb-4">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Photo de profil"
                                            className="rounded-circle"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                            style={{ width: '150px', height: '150px' }}
                                        >
                                            <span className="text-white fs-1 fw-bold">
                                                {formData.first_name?.charAt(0) || user?.first_name?.charAt(0) || 'U'}
                                                {formData.last_name?.charAt(0) || user?.last_name?.charAt(0) || ''}
                                            </span>
                                        </div>
                                    )}

                                    {editMode && (
                                        <label
                                            className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle p-2"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className="bi bi-camera"></i>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="d-none"
                                                onChange={handlePhotoChange}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Erreur photo de profil */}
                                {errors.photo_profil && (
                                    <div className="alert alert-danger py-2 mt-2" role="alert">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {errors.photo_profil}
                                    </div>
                                )}

                                <h4 className="mb-1">
                                    {formData.first_name} {formData.last_name}
                                </h4>
                                <p className="text-muted mb-0">{user?.email}</p>

                                <hr className="my-4" />

                                <div className="text-start">
                                    <div className="mb-3">
                                        <small className="text-muted d-block">Type de compte</small>
                                        <span className="badge bg-primary">
                                            {user?.type_utilisateur === 'porteur' ? 'Porteur de projet' : 'Contributeur'}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted d-block">Membre depuis</small>
                                        <strong>
                                            {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulaire de profil */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-person-vcard me-2"></i>
                                    Informations personnelles
                                </h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted small mb-4">
                                    <span className="text-danger">*</span> Champs obligatoires
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">
                                                Prénom <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                required
                                            />
                                            {errors.first_name && (
                                                <div className="invalid-feedback">{errors.first_name}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">
                                                Nom <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                required
                                            />
                                            {errors.last_name && (
                                                <div className="invalid-feedback">{errors.last_name}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={user?.email || ''}
                                                disabled
                                            />
                                            <small className="text-muted">L'email ne peut pas être modifié</small>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Téléphone</label>
                                            <input
                                                type="tel"
                                                className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                                                name="telephone"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                placeholder="+221 77 123 45 67"
                                            />
                                            {errors.telephone ? (
                                                <div className="invalid-feedback">{errors.telephone}</div>
                                            ) : (
                                                <small className="text-muted">Format: +221XXXXXXXXX ou 77XXXXXXX</small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Région</label>
                                            <select
                                                className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                                                name="region"
                                                value={formData.region}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                            >
                                                <option value="">Sélectionner une région</option>
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
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Ville</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.ville ? 'is-invalid' : ''}`}
                                                name="ville"
                                                value={formData.ville}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                placeholder="Votre ville"
                                            />
                                            {errors.ville && (
                                                <div className="invalid-feedback">{errors.ville}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Biographie</label>
                                        <textarea
                                            className={`form-control ${errors.biographie ? 'is-invalid' : ''}`}
                                            name="biographie"
                                            rows="4"
                                            value={formData.biographie}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            placeholder="Parlez-nous de vous..."
                                        ></textarea>
                                        {errors.biographie && (
                                            <div className="invalid-feedback">{errors.biographie}</div>
                                        )}
                                    </div>

                                    {editMode && (
                                        <div className="d-flex gap-2 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Enregistrement...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-check-lg me-2"></i>
                                                        Enregistrer
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={cancelEdit}
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Section sécurité */}
                        <div className="card border-0 shadow-sm mt-4">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-shield-lock me-2"></i>
                                    Sécurité
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Mot de passe</strong>
                                        <p className="text-muted mb-0 small">
                                            Modifier votre mot de passe pour sécuriser votre compte
                                        </p>
                                    </div>
                                    <button className="btn btn-outline-primary btn-sm" disabled>
                                        <i className="bi bi-key me-1"></i>
                                        Changer (bientôt disponible)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilPage
