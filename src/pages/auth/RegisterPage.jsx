// src/pages/auth/RegisterPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext.jsx'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register: registerUser, loading, error, isAuthenticated, clearError } = useAuth()

  // Gestion du formulaire
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  // Surveiller le mot de passe pour la confirmation
  const password = watch('password')

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Vous êtes déjà connecté !')
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Effacer les erreurs
  useEffect(() => {
    clearError()
  }, [clearError])

  // Options pour les select
  const regionsOptions = [
    { value: 'dakar', label: 'Dakar' },
    { value: 'thies', label: 'Thiès' },
    { value: 'saint_louis', label: 'Saint-Louis' },
    { value: 'diourbel', label: 'Diourbel' },
    { value: 'louga', label: 'Louga' },
    { value: 'fatick', label: 'Fatick' },
    { value: 'kaolack', label: 'Kaolack' },
    { value: 'kaffrine', label: 'Kaffrine' },
    { value: 'tambacounda', label: 'Tambacounda' },
    { value: 'kedougou', label: 'Kédougou' },
    { value: 'kolda', label: 'Kolda' },
    { value: 'sedhiou', label: 'Sédhiou' },
    { value: 'ziguinchor', label: 'Ziguinchor' },
    { value: 'matam', label: 'Matam' },
    { value: 'diaspora', label: 'Diaspora' }
  ]

  // Soumission du formulaire
  const onSubmit = async (data) => {
    try {
      console.log('🔄 RegisterPage: Tentative d\'inscription...', data)

      // Préparer les données selon le modèle Django
      const userData = {
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        password_confirm: data.password_confirm,
        telephone: data.telephone || '',
        type_utilisateur: data.type_utilisateur,
        region: data.region,
        ville: data.ville || ''
      }

      const result = await registerUser(userData)

      // Succès de l'inscription
      toast.success(`Bienvenue sur DiapalSen, ${result.user.first_name} !`)

      // Redirection vers dashboard
      navigate('/dashboard')

    } catch (error) {
      console.error('❌ RegisterPage: Erreur inscription:', error)

      // Gestion des erreurs spécifiques
      if (error?.email) {
        toast.error('Cet email est déjà utilisé')
      } else if (error?.username) {
        toast.error('Ce nom d\'utilisateur est déjà pris')
      } else {
        toast.error(error?.message || 'Erreur lors de l\'inscription')
      }
    }
  }

  return (
    <div className="register-page bg-light min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="card shadow border-0">
              <div className="card-body p-5">

                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className="h3 text-primary fw-bold mb-2">
                    Inscription
                  </h1>
                  <p className="text-muted">
                    Rejoignez la communauté DiapalSen dès aujourd'hui
                  </p>
                </div>

                {/* Affichage des erreurs globales */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>
                      {typeof error === 'string' ? error : 'Erreur lors de l\'inscription'}
                    </div>
                  </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                  {/* Type d'utilisateur */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      Type de compte *
                    </label>
                    <div className="row g-2">
                      <div className="col-12">
                        <input
                          type="radio"
                          className="btn-check"
                          id="type_contributeur"
                          value="contributeur"
                          {...register('type_utilisateur', {
                            required: 'Veuillez choisir un type de compte'
                          })}
                        />
                        <label
                          className="btn btn-outline-primary w-100 text-start p-3"
                          htmlFor="type_contributeur"
                        >
                          <i className="bi bi-wallet2 me-2"></i>
                          <strong>Contributeur</strong> - Je souhaite soutenir des projets
                        </label>
                      </div>
                      <div className="col-12">
                        <input
                          type="radio"
                          className="btn-check"
                          id="type_porteur"
                          value="porteur"
                          {...register('type_utilisateur', {
                            required: 'Veuillez choisir un type de compte'
                          })}
                        />
                        <label
                          className="btn btn-outline-success w-100 text-start p-3"
                          htmlFor="type_porteur"
                        >
                          <i className="bi bi-lightbulb me-2"></i>
                          <strong>Porteur de projet</strong> - Je veux créer des projets
                        </label>
                      </div>
                    </div>
                    {errors.type_utilisateur && (
                      <div className="text-danger mt-2">
                        <small>{errors.type_utilisateur.message}</small>
                      </div>
                    )}
                  </div>

                  {/* Informations personnelles */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="first_name" className="form-label fw-medium">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                        id="first_name"
                        placeholder="Amadou"
                        {...register('first_name', {
                          required: 'Le prénom est obligatoire',
                          minLength: {
                            value: 2,
                            message: 'Le prénom doit contenir au moins 2 caractères'
                          }
                        })}
                      />
                      {errors.first_name && (
                        <div className="invalid-feedback">
                          {errors.first_name.message}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="last_name" className="form-label fw-medium">
                        Nom *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                        id="last_name"
                        placeholder="Diallo"
                        {...register('last_name', {
                          required: 'Le nom est obligatoire',
                          minLength: {
                            value: 2,
                            message: 'Le nom doit contenir au moins 2 caractères'
                          }
                        })}
                      />
                      {errors.last_name && (
                        <div className="invalid-feedback">
                          {errors.last_name.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informations de compte */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-medium">
                        Email *
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="amadou@example.com"
                        {...register('email', {
                          required: 'L\'email est obligatoire',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Format d\'email invalide'
                          }
                        })}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="username" className="form-label fw-medium">
                        Nom d'utilisateur *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        id="username"
                        placeholder="amadou_diallo"
                        {...register('username', {
                          required: 'Le nom d\'utilisateur est obligatoire',
                          minLength: {
                            value: 3,
                            message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Seules les lettres, chiffres et _ sont autorisés'
                          }
                        })}
                      />
                      {errors.username && (
                        <div className="invalid-feedback">
                          {errors.username.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="password" className="form-label fw-medium">
                        Mot de passe *
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        placeholder="Min. 8 caractères"
                        {...register('password', {
                          required: 'Le mot de passe est obligatoire',
                          minLength: {
                            value: 8,
                            message: 'Le mot de passe doit contenir au moins 8 caractères'
                          }
                        })}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password.message}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="password_confirm" className="form-label fw-medium">
                        Confirmer mot de passe *
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errors.password_confirm ? 'is-invalid' : ''}`}
                        id="password_confirm"
                        placeholder="Retapez votre mot de passe"
                        {...register('password_confirm', {
                          required: 'Veuillez confirmer votre mot de passe',
                          validate: (value) =>
                            value === password || 'Les mots de passe ne correspondent pas'
                        })}
                      />
                      {errors.password_confirm && (
                        <div className="invalid-feedback">
                          {errors.password_confirm.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact et localisation */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label htmlFor="telephone" className="form-label fw-medium">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                        id="telephone"
                        placeholder="+221771234567"
                        {...register('telephone', {
                          pattern: {
                            value: /^\+?[0-9]{9,15}$/,
                            message: 'Format de téléphone invalide'
                          }
                        })}
                      />
                      {errors.telephone && (
                        <div className="invalid-feedback">
                          {errors.telephone.message}
                        </div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="region" className="form-label fw-medium">
                        Région *
                      </label>
                      <select
                        className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                        id="region"
                        {...register('region', {
                          required: 'Veuillez choisir une région'
                        })}
                      >
                        <option value="">Choisir une région</option>
                        {regionsOptions.map((region) => (
                          <option key={region.value} value={region.value}>
                            {region.label}
                          </option>
                        ))}
                      </select>
                      {errors.region && (
                        <div className="invalid-feedback">
                          {errors.region.message}
                        </div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="ville" className="form-label fw-medium">
                        Ville
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="ville"
                        placeholder="Pikine"
                        {...register('ville')}
                      />
                    </div>
                  </div>

                  {/* Acceptation des conditions */}
                  <div className="form-check mb-4">
                    <input
                      className={`form-check-input ${errors.acceptConditions ? 'is-invalid' : ''}`}
                      type="checkbox"
                      id="acceptConditions"
                      {...register('acceptConditions', {
                        required: 'Vous devez accepter les conditions d\'utilisation'
                      })}
                    />
                    <label className="form-check-label" htmlFor="acceptConditions">
                      J'accepte les{' '}
                      <Link to="/conditions" className="text-decoration-none">
                        conditions d'utilisation
                      </Link>
                      {' '}et la{' '}
                      <Link to="/confidentialite" className="text-decoration-none">
                        politique de confidentialité
                      </Link>
                    </label>
                    {errors.acceptConditions && (
                      <div className="invalid-feedback d-block">
                        {errors.acceptConditions.message}
                      </div>
                    )}
                  </div>

                  {/* Bouton d'inscription */}
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Chargement...</span>
                          </span>
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Créer mon compte
                        </>
                      )}
                    </button>
                  </div>

                  {/* Lien vers connexion */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Déjà un compte ?{' '}
                      <Link
                        to="/login"
                        className="text-decoration-none fw-medium"
                      >
                        Se connecter
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage