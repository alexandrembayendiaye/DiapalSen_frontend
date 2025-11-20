// src/services/api.js
import axios from 'axios';

// URL de Django
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Création de l'instance Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 secondes de timeout
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requête
api.interceptors.request.use(
    (config) => {
        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        console.error('❌ API Error:', error.response?.status, error.config?.url);

        // Si token expiré (401), rediriger vers login
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;