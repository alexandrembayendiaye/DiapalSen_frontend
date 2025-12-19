// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext.jsx'

const LoginPage = () => {
    const navigate = useNavigate()
    const { login, loading, error, isAuthenticated, clearError } = useAuth()

    // Gestion du formulaire avec react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    // Redirection si déjà connecté (sans toast pour éviter les doublons)
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    // Effacer les erreurs au chargement
    useEffect(() => {
        clearError()
    }, [clearError])

    // Soumission du formulaire
    const onSubmit = async (data) => {
        try {
            console.log('🔄 LoginPage: Tentative de connexion...', data.email)

            const result = await login({
                email: data.email,
                password: data.password
            })

            // Succès de la connexion
            toast.success(`Bienvenue ${result.user.first_name} !`)

            // Redirection vers dashboard
            navigate('/dashboard')

        } catch (error) {
            console.error('❌ LoginPage: Erreur connexion:', error)

            // Gestion des erreurs spécifiques
            if (error?.message) {
                toast.error(error.message)
            } else {
                toast.error('Erreur de connexion. Vérifiez vos identifiants.')
            }
        }
    }

    return (
        <div className="login-page bg-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">

                        {/* Carte principale */}
                        <div className="card shadow border-0">
                            <div className="card-body p-5">

                                {/* Header */}
                                <div className="text-center mb-4">
                                    <h1 className="h3 text-primary fw-bold mb-2">
                                        Connexion
                                    </h1>
                                    <p className="text-muted">
                                        Connectez-vous à votre compte DiapalSen
                                    </p>
                                </div>

                                {/* Affichage des erreurs globales */}
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        <div>
                                            {typeof error === 'string' ? error : 'Erreur de connexion'}
                                        </div>
                                    </div>
                                )}

                                {/* Formulaire */}
                                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                                    {/* Email */}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-medium">
                                            Email
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-envelope"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                placeholder="votre@email.com"
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
                                    </div>

                                    {/* Mot de passe */}
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label fw-medium">
                                            Mot de passe
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-lock"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                placeholder="Votre mot de passe"
                                                {...register('password', {
                                                    required: 'Le mot de passe est obligatoire',
                                                    minLength: {
                                                        value: 6,
                                                        message: 'Le mot de passe doit contenir au moins 6 caractères'
                                                    }
                                                })}
                                            />
                                            {errors.password && (
                                                <div className="invalid-feedback">
                                                    {errors.password.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="row mb-4">
                                        <div className="col-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="rememberMe"
                                                />
                                                <label className="form-check-label small" htmlFor="rememberMe">
                                                    Se souvenir de moi
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6 text-end">
                                            <Link
                                                to="/mot-de-passe-oublie"
                                                className="text-decoration-none small"
                                            >
                                                Mot de passe oublié ?
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Bouton de connexion */}
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
                                                    Connexion en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                                    Se connecter
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Lien vers inscription */}
                                    <div className="text-center">
                                        <p className="text-muted mb-0">
                                            Pas encore de compte ?{' '}
                                            <Link
                                                to="/register"
                                                className="text-decoration-none fw-medium"
                                            >
                                                Créer un compte
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Informations supplémentaires */}
                        <div className="text-center mt-4">
                            <small className="text-muted">
                                <i className="bi bi-shield-check me-1"></i>
                                Connexion sécurisée avec chiffrement
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage