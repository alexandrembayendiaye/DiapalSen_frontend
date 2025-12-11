// src/pages/projects/CreerProjetPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import projectsService from '../../services/projectsService'

const CreerProjetPage = () => {
    const navigate = useNavigate()
    const { user, isPorteur } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]) // ← AJOUTER CETTE LIGNE
    const [imagePreview, setImagePreview] = useState(null)


    // État global du formulaire
    const [formData, setFormData] = useState({
        // Étape 1 : Informations de base
        titre: '',
        categorie: '',
        region: '',
        ville: '',
        description_courte: '',
        // Étape 2 : Description détaillée
        description_complete: '',
        // Étape 3 : Budget et financement
        montant_objectif: '',
        duree_campagne: 30,
        // Étape 4 : Médias
        image_principale: null,
        video_url: '',  // ✅ Renommé de video_presentation
        images_supplementaires: []
    })

    // Configuration du formulaire
    const { register, handleSubmit, formState: { errors }, trigger, setValue, watch } = useForm({
        defaultValues: formData,
        mode: 'onChange'
    })


    const regions = [
        { value: '', label: 'Sélectionnez une région' },
        { value: 'dakar', label: 'Dakar' },
        { value: 'thies', label: 'Thiès' },
        { value: 'saint-louis', label: 'Saint-Louis' },
        { value: 'diourbel', label: 'Diourbel' },
        { value: 'louga', label: 'Louga' },
        { value: 'tambacounda', label: 'Tambacounda' },
        { value: 'kaolack', label: 'Kaolack' },
        { value: 'ziguinchor', label: 'Ziguinchor' },
        { value: 'fatick', label: 'Fatick' },
        { value: 'kolda', label: 'Kolda' },
        { value: 'matam', label: 'Matam' },
        { value: 'kaffrine', label: 'Kaffrine' },
        { value: 'kedougou', label: 'Kédougou' },
        { value: 'sedhiou', label: 'Sédhiou' }
    ]

    // Validation par étape
    const stepValidation = {
        1: ['titre', 'categorie', 'region', 'ville', 'description_courte'],
        2: ['description_complete'],
        3: ['montant_objectif'],
        4: [] // Étape médias optionnelle
    }
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await projectsService.getCategories()
                setCategories([
                    { value: '', label: 'Sélectionnez une catégorie' },
                    ...cats.results.map(cat => ({
                        value: cat.id,
                        label: `${cat.icone} ${cat.nom}`
                    }))
                ])
            } catch (error) {
                console.error('Erreur chargement catégories:', error)
                // En cas d'erreur, garder les catégories par défaut
                setCategories([
                    { value: '', label: 'Sélectionnez une catégorie' },
                    { value: 1, label: '🌾 Agriculture & Élevage' },
                    { value: 2, label: '💻 Technologie' },
                    { value: 3, label: '📚 Éducation' },
                    { value: 4, label: '🏥 Santé' },
                    { value: 5, label: '🎨 Artisanat' },
                    { value: 6, label: '🌱 Environnement' },
                    { value: 7, label: '🛍️ Commerce' }
                ])
            }
        }
        loadCategories()
    }, [])
    // Fonction pour convertir en ID
    const getCategorieId = (categorieValue) => {
        return parseInt(categorieValue) || 1
    }
    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            // Vérifier le type de fichier
            if (!file.type.startsWith('image/')) {
                toast.error('Veuillez sélectionner un fichier image valide')
                return
            }

            // Vérifier la taille (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('L\'image ne doit pas dépasser 5 MB')
                return
            }

            // Créer l'aperçu
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result)
            }
            reader.readAsDataURL(file)

            // Mettre à jour le formulaire
            setValue('image_principale', event.target.files)
        }
    }

    // Fonction pour supprimer l'image
    const removeImage = () => {
        setImagePreview(null)
        setValue('image_principale', null)
        // Reset le input file
        document.getElementById('image_principale').value = ''
    }

    // Navigation entre étapes
    const nextStep = async () => {
        const fieldsToValidate = stepValidation[currentStep]
        const isValid = await trigger(fieldsToValidate)

        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, 5))
        } else {
            toast.error('Veuillez corriger les erreurs avant de continuer')
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    // Soumission finale
    const onSubmit = async (data) => {
        try {
            setLoading(true)
            console.log('🚀 Soumission projet:', data)

            // Préparer les données pour l'API Django
            const projectData = {
                titre: data.titre,
                description_courte: data.description_courte,
                description_complete: data.description_complete,
                categorie: getCategorieId(data.categorie), // ← Convertir en ID
                montant_objectif: parseInt(data.montant_objectif),
                duree_campagne_jours: parseInt(data.duree_campagne), //
                ville: data.ville,
                region: data.region,
                impact_social: data.impact_social,
                equipe_projet: data.equipe_projet || '',
                budget_detaille: data.budget_detaille,
                risques_defis: data.risques_defis || '',
                video_url: data.video_url || ''
            }


            // Appeler l'API de création
            const result = await projectsService.createProject(projectData)
            console.log('🔍 RÉPONSE COMPLÈTE:', result) // ← AJOUTER
            console.log('🔍 result.id:', result?.id) // ← AJOUTER
            console.log('🔍 typeof result:', typeof result) // ← AJOUTER
            // Upload de l'image si présente
            if (data.image_principale && data.image_principale[0]) {
                try {
                    await projectsService.uploadImage(result.id, data.image_principale[0])
                    console.log('✅ Image uploadée avec succès')
                } catch (uploadError) {
                    console.warn('❌ Erreur upload image:', uploadError)
                    toast.error('Projet créé mais erreur upload image')
                }
            }

            toast.success('Projet créé avec succès ! En attente de validation.')
            navigate('/mes-projets')
        } catch (error) {
            console.error('❌ Erreur création projet:', error)

            // Afficher l'erreur spécifique si disponible
            if (error.message) {
                toast.error(error.message)
            } else if (typeof error === 'object') {
                // Afficher les erreurs de validation
                const firstError = Object.values(error)[0]
                if (Array.isArray(firstError)) {
                    toast.error(firstError[0])
                } else {
                    toast.error('Erreur lors de la création du projet')
                }
            } else {
                toast.error('Erreur lors de la création du projet')
            }
        } finally {
            setLoading(false)
        }

    }

    // Vérification des droits
    if (!isPorteur()) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <h2>Accès refusé</h2>
                    <p>Cette page est réservée aux porteurs de projet.</p>
                    <button onClick={() => navigate(-1)} className="btn btn-primary">
                        Retour
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="creer-projet-page bg-light min-vh-100">
            <div className="container py-4">

                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-3">
                            <button
                                onClick={() => navigate('/mes-projets')}
                                className="btn btn-outline-secondary me-3"
                            >
                                <i className="bi bi-arrow-left"></i>
                            </button>
                            <div>
                                <h1 className="h3 mb-1">Créer un nouveau projet</h1>
                                <p className="text-muted mb-0">
                                    Présentez votre innovation et lancez votre campagne de financement
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="progress mb-4" style={{ height: '8px' }}>
                            <div
                                className="progress-bar bg-success"
                                style={{ width: `${(currentStep / 5) * 100}%` }}
                                role="progressbar"
                            />
                        </div>

                        {/* Indicateurs d'étapes */}
                        <div className="row text-center mb-4">
                            {[
                                { step: 1, title: 'Informations', icon: 'bi-info-circle' },
                                { step: 2, title: 'Description', icon: 'bi-file-text' },
                                { step: 3, title: 'Budget', icon: 'bi-calculator' },
                                { step: 4, title: 'Médias', icon: 'bi-image' },
                                { step: 5, title: 'Révision', icon: 'bi-check-circle' }
                            ].map(({ step, title, icon }) => (
                                <div key={step} className="col">
                                    <div className={`d-flex flex-column align-items-center ${currentStep >= step ? 'text-success' : 'text-muted'
                                        }`}>
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${currentStep >= step ? 'bg-success text-white' : 'bg-light'
                                            }`} style={{ width: '40px', height: '40px' }}>
                                            <i className={icon}></i>
                                        </div>
                                        <small className="fw-medium">{title}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">

                                    {/* ÉTAPE 1 : Informations de base */}
                                    {currentStep === 1 && (
                                        <div className="step-content">
                                            <h4 className="mb-4">
                                                <i className="bi bi-info-circle text-primary me-2"></i>
                                                Informations de base
                                            </h4>

                                            <div className="mb-3">
                                                <label htmlFor="titre" className="form-label fw-medium">
                                                    Titre du projet *
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.titre ? 'is-invalid' : ''}`}
                                                    id="titre"
                                                    placeholder="Ex: Application mobile pour l'agriculture"
                                                    {...register('titre', {
                                                        required: 'Le titre est obligatoire',
                                                        minLength: {
                                                            value: 10,
                                                            message: 'Le titre doit contenir au moins 10 caractères'
                                                        },
                                                        maxLength: {
                                                            value: 100,
                                                            message: 'Le titre ne peut pas dépasser 100 caractères'
                                                        }
                                                    })}
                                                />
                                                {errors.titre && (
                                                    <div className="invalid-feedback">{errors.titre.message}</div>
                                                )}
                                                <div className="form-text">
                                                    Choisissez un titre accrocheur et descriptif (10-100 caractères)
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="categorie" className="form-label fw-medium">
                                                        Catégorie *
                                                    </label>
                                                    <select
                                                        className={`form-select ${errors.categorie ? 'is-invalid' : ''}`}
                                                        id="categorie"
                                                        {...register('categorie', {
                                                            required: 'La catégorie est obligatoire'
                                                        })}
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat.value} value={cat.value}>
                                                                {cat.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.categorie && (
                                                        <div className="invalid-feedback">{errors.categorie.message}</div>
                                                    )}
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="region" className="form-label fw-medium">
                                                        Région *
                                                    </label>
                                                    <select
                                                        className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                                                        id="region"
                                                        {...register('region', {
                                                            required: 'La région est obligatoire'
                                                        })}
                                                    >
                                                        {regions.map(region => (
                                                            <option key={region.value} value={region.value}>
                                                                {region.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.region && (
                                                        <div className="invalid-feedback">{errors.region.message}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="ville" className="form-label fw-medium">
                                                    Ville *
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.ville ? 'is-invalid' : ''}`}
                                                    id="ville"
                                                    placeholder="Ex: Dakar, Thiès, Saint-Louis..."
                                                    {...register('ville', {
                                                        required: 'La ville est obligatoire',
                                                        minLength: {
                                                            value: 2,
                                                            message: 'La ville doit contenir au moins 2 caractères'
                                                        }
                                                    })}
                                                />
                                                {errors.ville && (
                                                    <div className="invalid-feedback">{errors.ville.message}</div>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="description_courte" className="form-label fw-medium">
                                                    Description courte *
                                                </label>
                                                <textarea
                                                    className={`form-control ${errors.description_courte ? 'is-invalid' : ''}`}
                                                    id="description_courte"
                                                    rows="3"
                                                    placeholder="Résumez votre projet en quelques phrases..."
                                                    maxLength="200"
                                                    {...register('description_courte', {
                                                        required: 'La description courte est obligatoire',
                                                        minLength: {
                                                            value: 20,
                                                            message: 'La description doit contenir au moins 20 caractères'
                                                        },
                                                        maxLength: {
                                                            value: 200,
                                                            message: 'La description ne peut pas dépasser 200 caractères'
                                                        }
                                                    })}
                                                />
                                                {errors.description_courte && (
                                                    <div className="invalid-feedback">{errors.description_courte.message}</div>
                                                )}
                                                <div className="form-text">
                                                    Cette description apparaîtra sur les cartes de projets (20-200 caractères)
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ÉTAPE 2 : Description détaillée */}
                                    {currentStep === 2 && (
                                        <div className="step-content">
                                            <h4 className="mb-4">
                                                <i className="bi bi-file-text text-primary me-2"></i>
                                                Description détaillée
                                            </h4>

                                            <div className="mb-3">
                                                <label htmlFor="description_complete" className="form-label fw-medium">
                                                    Description complète du projet *
                                                </label>
                                                <textarea
                                                    className={`form-control ${errors.description_complete ? 'is-invalid' : ''}`}
                                                    id="description_complete"
                                                    rows="8"
                                                    placeholder="Décrivez en détail votre projet, son fonctionnement, ses objectifs..."
                                                    {...register('description_complete', {
                                                        required: 'La description complète est obligatoire',
                                                        minLength: {
                                                            value: 100,
                                                            message: 'La description doit contenir au moins 100 caractères'
                                                        }
                                                    })}
                                                />
                                                {errors.description_complete && (
                                                    <div className="invalid-feedback">{errors.description_complete.message}</div>
                                                )}
                                                <div className="form-text">
                                                    Expliquez clairement votre innovation, comment elle fonctionne et pourquoi elle est importante
                                                </div>
                                            </div>

                                        </div>
                                    )}

                                    {/* ÉTAPE 3 : Budget et financement */}
                                    {currentStep === 3 && (
                                        <div className="step-content">
                                            <h4 className="mb-4">
                                                <i className="bi bi-calculator text-primary me-2"></i>
                                                Budget et financement
                                            </h4>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="montant_objectif" className="form-label fw-medium">
                                                        Objectif de financement (FCFA) *
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">FCFA</span>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${errors.montant_objectif ? 'is-invalid' : ''}`}
                                                            id="montant_objectif"
                                                            placeholder="500000"
                                                            min="100000"
                                                            step="50000"
                                                            {...register('montant_objectif', {
                                                                required: 'L\'objectif de financement est obligatoire',
                                                                min: {
                                                                    value: 100000,
                                                                    message: 'Le montant minimum est de 100 000 FCFA'
                                                                },
                                                                max: {
                                                                    value: 50000000,
                                                                    message: 'Le montant maximum est de 50 000 000 FCFA'
                                                                }
                                                            })}
                                                        />
                                                        {errors.montant_objectif && (
                                                            <div className="invalid-feedback">{errors.montant_objectif.message}</div>
                                                        )}
                                                    </div>
                                                    <div className="form-text">
                                                        Entre 100 000 et 50 000 000 FCFA
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="duree_campagne" className="form-label fw-medium">
                                                        Durée de la campagne (jours) *
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        id="duree_campagne"
                                                        {...register('duree_campagne')}
                                                    >
                                                        <option value="15">15 jours</option>
                                                        <option value="30">30 jours</option>
                                                        <option value="45">45 jours</option>
                                                        <option value="60">60 jours</option>
                                                        <option value="90">90 jours</option>
                                                    </select>
                                                    <div className="form-text">
                                                        Durée pendant laquelle votre projet sera en financement
                                                    </div>
                                                </div>
                                            </div>



                                        </div>
                                    )}

                                    {/* ÉTAPE 4 : Médias */}
                                    {currentStep === 4 && (
                                        <div className="step-content">
                                            <h4 className="mb-4">
                                                <i className="bi bi-image text-primary me-2"></i>
                                                Médias et présentation
                                            </h4>

                                            <div className="mb-4">
                                                <label className="form-label fw-medium">
                                                    Image principale du projet
                                                </label>

                                                {!imagePreview ? (
                                                    // Zone de drop/upload
                                                    <div
                                                        className="border-2 border-dashed border-secondary rounded p-4 text-center bg-light position-relative"
                                                        style={{ minHeight: '200px', cursor: 'pointer' }}
                                                        onClick={() => document.getElementById('image_principale').click()}
                                                        onDragOver={(e) => {
                                                            e.preventDefault()
                                                            e.currentTarget.classList.add('border-primary', 'bg-primary-subtle')
                                                        }}
                                                        onDragLeave={(e) => {
                                                            e.preventDefault()
                                                            e.currentTarget.classList.remove('border-primary', 'bg-primary-subtle')
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault()
                                                            e.currentTarget.classList.remove('border-primary', 'bg-primary-subtle')
                                                            const files = e.dataTransfer.files
                                                            if (files.length > 0) {
                                                                const event = { target: { files } }
                                                                handleImageChange(event)
                                                            }
                                                        }}
                                                    >
                                                        <i className="bi bi-cloud-upload display-1 text-muted mb-3"></i>
                                                        <h5>Glissez votre image ici</h5>
                                                        <p className="text-muted mb-3">
                                                            ou <span className="text-primary">cliquez pour parcourir</span>
                                                        </p>
                                                        <div className="btn btn-outline-primary">
                                                            <i className="bi bi-plus-circle me-2"></i>
                                                            Choisir une image
                                                        </div>
                                                        <div className="form-text mt-3">
                                                            Format recommandé : JPG, PNG. Taille max : 5 MB. Dimensions : 800x400px
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Aperçu de l'image
                                                    <div className="position-relative">
                                                        <div className="border rounded p-2 bg-white">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Aperçu"
                                                                className="img-fluid rounded"
                                                                style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                        <div className="position-absolute top-0 end-0 p-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm rounded-circle"
                                                                onClick={removeImage}
                                                                title="Supprimer l'image"
                                                            >
                                                                <i className="bi bi-x"></i>
                                                            </button>
                                                        </div>
                                                        <div className="mt-2 text-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-sm me-2"
                                                                onClick={() => document.getElementById('image_principale').click()}
                                                            >
                                                                <i className="bi bi-arrow-repeat me-1"></i>
                                                                Changer l'image
                                                            </button>
                                                            <small className="text-muted">
                                                                Cliquez sur ✕ pour supprimer ou sur "Changer" pour sélectionner une autre image
                                                            </small>
                                                        </div>
                                                    </div>
                                                )}

                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    id="image_principale"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="video_presentation" className="form-label fw-medium">
                                                    Vidéo de présentation (optionnel)
                                                </label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    id="video_presentation"
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    {...register('video_url')}
                                                />
                                                <div className="form-text">
                                                    Lien YouTube, Vimeo ou autre plateforme vidéo
                                                </div>
                                            </div>

                                            <div className="alert alert-info">
                                                <i className="bi bi-info-circle me-2"></i>
                                                <strong>Conseils pour de bons visuels :</strong>
                                                <ul className="mb-0 mt-2">
                                                    <li>Utilisez des images de haute qualité qui illustrent votre projet</li>
                                                    <li>Montrez votre équipe, vos prototypes ou votre environnement de travail</li>
                                                    <li>Une vidéo de 2-3 minutes augmente significativement vos chances de financement</li>
                                                    <li>Évitez les images stock, privilégiez l'authenticité</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* ÉTAPE 5 : Révision */}
                                    {currentStep === 5 && (
                                        <div className="step-content">
                                            <h4 className="mb-4">
                                                <i className="bi bi-check-circle text-primary me-2"></i>
                                                Révision et soumission
                                            </h4>

                                            <div className="alert alert-warning">
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                <strong>Vérification finale :</strong> Une fois soumis, votre projet sera examiné par notre équipe.
                                                Vous pourrez le modifier tant qu'il est en statut "brouillon".
                                            </div>

                                            {/* Récapitulatif */}
                                            <div className="card bg-light border-0 mb-4">
                                                <div className="card-body">
                                                    <h5>Récapitulatif de votre projet</h5>

                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <strong>Titre :</strong> {watch('titre')}<br />
                                                            <strong>Catégorie :</strong> {watch('categorie')}<br />
                                                            <strong>Localisation :</strong> {watch('ville')}, {watch('region')}<br />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <strong>Objectif :</strong> {parseInt(watch('montant_objectif') || 0).toLocaleString()} FCFA<br />
                                                            <strong>Durée :</strong> {watch('duree_campagne')} jours<br />
                                                        </div>
                                                    </div>

                                                    <div className="mt-3">
                                                        <strong>Description courte :</strong><br />
                                                        <em>{watch('description_courte')}</em>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-check mb-4">
                                                <input className="form-check-input" type="checkbox" id="accepter_conditions" required />
                                                <label className="form-check-label" htmlFor="accepter_conditions">
                                                    J'accepte les <a href="#" className="text-primary">conditions d'utilisation</a> et
                                                    la <a href="#" className="text-primary">charte des porteurs de projet</a> de DiapalSen *
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="d-flex justify-content-between mt-4 pt-4 border-top">
                                        {currentStep > 1 ? (
                                            <button type="button" onClick={prevStep} className="btn btn-outline-secondary">
                                                <i className="bi bi-arrow-left me-2"></i>
                                                Précédent
                                            </button>
                                        ) : (
                                            <div></div>
                                        )}

                                        {currentStep < 5 ? (
                                            <button type="button" onClick={nextStep} className="btn btn-primary">
                                                Suivant
                                                <i className="bi bi-arrow-right ms-2"></i>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-send me-2"></i>
                                                        Soumettre le projet
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreerProjetPage