// src/components/MaintenanceBanner.jsx
import { useState, useEffect, useCallback } from 'react';
import maintenanceService from '../services/maintenanceService';

/**
 * Overlay plein écran affiché quand le backend est indisponible.
 * Propose un bouton "Réessayer" qui fait un ping vers l'API.
 */
const MaintenanceBanner = () => {
    const [isVisible, setIsVisible] = useState(maintenanceService.isInMaintenance());
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        const unsubscribe = maintenanceService.onMaintenanceChange((inMaintenance) => {
            setIsVisible(inMaintenance);
        });
        return unsubscribe;
    }, []);

    const handleRetry = useCallback(async () => {
        setIsRetrying(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
            // Faire un simple ping vers l'API
            const response = await fetch(API_BASE_URL.replace('/api', '/api/'), {
                method: 'GET',
                mode: 'cors',
                signal: AbortSignal.timeout(8000),
            });
            // Si on reçoit une réponse (même une 404), le backend est up
            maintenanceService.reportSuccess();
        } catch (err) {
            // Toujours en maintenance
            console.warn('🔧 Backend toujours indisponible');
        } finally {
            setIsRetrying(false);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                {/* Icône */}
                <div style={styles.iconContainer}>
                    <i className="bi bi-wrench-adjustable" style={styles.icon}></i>
                </div>

                {/* Titre */}
                <h1 style={styles.title}>
                    Service temporairement indisponible
                </h1>

                {/* Message */}
                <p style={styles.message}>
                    Notre plateforme est actuellement en maintenance.
                    Nous travaillons pour rétablir le service dans les plus brefs délais.
                </p>

                <p style={styles.submessage}>
                    Merci de votre patience et de votre compréhension.
                </p>

                {/* Bouton Réessayer */}
                <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    style={{
                        ...styles.retryButton,
                        ...(isRetrying ? styles.retryButtonDisabled : {}),
                    }}
                    onMouseEnter={(e) => {
                        if (!isRetrying) {
                            e.target.style.backgroundColor = '#0b5ed7';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(13, 110, 253, 0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isRetrying) {
                            e.target.style.backgroundColor = '#0d6efd';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.3)';
                        }
                    }}
                >
                    {isRetrying ? (
                        <>
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            Vérification en cours...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Réessayer
                        </>
                    )}
                </button>

                {/* Info supplémentaire */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        <i className="bi bi-info-circle me-1"></i>
                        Si le problème persiste, contactez-nous à{' '}
                        <a href="mailto:support@diapalsen.com" style={styles.link}>
                            support@diapalsen.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

// ========== STYLES INLINE ==========
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f0f4f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    card: {
        background: '#ffffff',
        borderRadius: '16px',
        padding: '50px 40px',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
    },
    iconContainer: {
        marginBottom: '24px',
    },
    icon: {
        fontSize: '4.5rem',
        color: '#f59e0b',
        display: 'block',
    },
    title: {
        fontSize: '1.6rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '16px',
        lineHeight: '1.3',
    },
    message: {
        fontSize: '1.05rem',
        color: '#64748b',
        lineHeight: '1.6',
        marginBottom: '8px',
    },
    submessage: {
        fontSize: '0.95rem',
        color: '#94a3b8',
        marginBottom: '30px',
        fontStyle: 'italic',
    },
    retryButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 32px',
        fontSize: '1rem',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#0d6efd',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
        marginBottom: '30px',
    },
    retryButtonDisabled: {
        backgroundColor: '#93c5fd',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    footer: {
        borderTop: '1px solid #e2e8f0',
        paddingTop: '20px',
    },
    footerText: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        margin: 0,
    },
    link: {
        color: '#0d6efd',
        textDecoration: 'none',
    },
};

export default MaintenanceBanner;
