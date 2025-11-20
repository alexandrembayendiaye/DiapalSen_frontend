// src/components/auth/ProtectedRoute.jsx
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth()
    const hasTokens = !!localStorage.getItem('access_token')

    // Plus strict : TOUS les critères doivent être vrais
    const isReallyAuthenticated = isAuthenticated && user && hasTokens

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Vérification de votre session...</p>
                </div>
            </div>
        )
    }

    if (!isReallyAuthenticated) {
        console.log('🔒 ProtectedRoute: Redirection - Auth:', isAuthenticated, 'User:', !!user, 'Tokens:', hasTokens)
        return <Navigate to="/login" replace />
    }

    return children
}
export default ProtectedRoute