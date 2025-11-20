// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

// Créer le contexte
const AuthContext = createContext()

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Provider du contexte d'authentification
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState(null)

    // ====== UTILITAIRES ======

    // Vérifier le rôle de l'utilisateur
    const hasRole = (role) => {
        return user?.type_utilisateur === role
    }

    // Vérifier si c'est un porteur de projet
    const isPorteur = () => hasRole('porteur')

    // Vérifier si c'est un contributeur
    const isContributeur = () => hasRole('contributeur')

    // Vérifier si c'est un admin
    const isAdmin = () => user?.is_superuser === true || user?.type_utilisateur === 'admin'
    // Obtenir le nom complet
    const getFullName = () => {
        if (!user) return ''
        return `${user.first_name} ${user.last_name}`.trim()
    }

    // Obtenir les initiales pour avatar
    const getInitials = () => {
        if (!user) return ''
        const firstInitial = user.first_name?.charAt(0) || ''
        const lastInitial = user.last_name?.charAt(0) || ''
        return (firstInitial + lastInitial).toUpperCase()
    }

    // ====== ACTIONS ======

    // 📝 INSCRIPTION
    const register = async (userData) => {
        setLoading(true)
        setError(null)

        try {
            console.log('🔄 AuthContext: Inscription en cours...', userData)
            const response = await authService.register(userData)

            // Récupérer le profil après inscription
            const profile = await authService.getProfile()

            setUser(profile)
            setIsAuthenticated(true)
            console.log('✅ AuthContext: Inscription réussie', profile)

            return response
        } catch (error) {
            console.error('❌ AuthContext: Erreur inscription:', error)
            setError(error.message || 'Erreur lors de l\'inscription')
            setIsAuthenticated(false)
            setUser(null)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // 🔐 CONNEXION
    const login = async (credentials) => {
        setLoading(true)
        setError(null)

        try {
            console.log('🔄 AuthContext: Connexion en cours...', credentials.email)
            const response = await authService.login(credentials)

            // Récupérer le profil après connexion
            const profile = await authService.getProfile()

            setUser(profile)
            setIsAuthenticated(true)
            console.log('✅ AuthContext: Connexion réussie', profile)

            return response
        } catch (error) {
            console.error('❌ AuthContext: Erreur connexion:', error)
            setError(error.message || 'Erreur lors de la connexion')
            setIsAuthenticated(false)
            setUser(null)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // 🚪 DÉCONNEXION
    const logout = async () => {
        try {
            console.log('🔄 AuthContext: Déconnexion...')
            await authService.logout()
            console.log('✅ AuthContext: Déconnexion réussie')
        } catch (error) {
            console.warn('❌ AuthContext: Erreur API logout:', error)
        } finally {
            // Toujours nettoyer l'état local
            setUser(null)
            setIsAuthenticated(false)
            setError(null)
            console.log('🧹 AuthContext: État nettoyé')

            // Redirection vers la page de connexion
            window.location.href = '/login'
        }
    }

    // 👤 RÉCUPÉRER PROFIL
    const getProfile = async () => {
        setLoading(true)

        try {
            console.log('🔄 AuthContext: Récupération profil...')
            const profile = await authService.getProfile()

            setUser(profile)
            setIsAuthenticated(true)
            console.log('✅ AuthContext: Profil récupéré', profile)

            return profile
        } catch (error) {
            console.error('❌ AuthContext: Erreur profil:', error)
            setError(error.message || 'Erreur lors de la récupération du profil')
            setIsAuthenticated(false)
            setUser(null)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // 🔄 RESTAURER SESSION
    const restoreSession = async () => {
        setLoading(true)

        try {
            const token = authService.getToken()
            if (!token) {
                console.log('👤 AuthContext: Aucun token trouvé')
                return
            }

            console.log('🔄 AuthContext: Restauration session...')
            const profile = await authService.getProfile()

            setUser(profile)
            setIsAuthenticated(true)
            console.log('✅ AuthContext: Session restaurée', profile)
        } catch (error) {
            console.error('❌ AuthContext: Session expirée:', error)
            // Nettoyer si token invalide
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    // 🧹 EFFACER ERREUR
    const clearError = () => {
        setError(null)
    }

    // ====== EFFET DE RESTAURATION ======
    useEffect(() => {
        restoreSession()
    }, [])

    // ====== VALEUR DU CONTEXTE ======
    const value = {
        // État
        user,
        loading,
        isAuthenticated,
        error,

        // Actions
        login,
        register,
        logout,
        getProfile,
        clearError,
        restoreSession,

        // Utilitaires
        hasRole,
        isPorteur,
        isContributeur,
        isAdmin,
        getFullName,
        getInitials,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext