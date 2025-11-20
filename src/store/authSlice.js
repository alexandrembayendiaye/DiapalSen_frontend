// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// État initial de l'authentification
const initialState = {
    user: null,              // Données utilisateur
    isAuthenticated: false,  // Statut de connexion
    loading: false,         // État de chargement
    error: null            // Messages d'erreur
};

// ====== ACTIONS ASYNCHRONES ======

// 📝 ACTION INSCRIPTION
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('🔄 Redux: Inscription en cours...', userData);
            const response = await authService.register(userData);

            // Récupérer immédiatement le profil après inscription
            const profile = await authService.getProfile();

            return {
                user: profile,
                tokens: response.tokens,
                message: response.message
            };
        } catch (error) {
            console.error('❌ Redux: Erreur inscription:', error);
            return rejectWithValue(error.message || 'Erreur lors de l\'inscription');
        }
    }
);

// 🔐 ACTION CONNEXION
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('🔄 Redux: Connexion en cours...', credentials.email);
            const response = await authService.login(credentials);

            // Récupérer le profil après connexion
            const profile = await authService.getProfile();

            return {
                user: profile,
                tokens: response.tokens,
                message: response.message
            };
        } catch (error) {
            console.error('❌ Redux: Erreur connexion:', error);
            return rejectWithValue(error.message || 'Erreur lors de la connexion');
        }
    }
);

// 👤 ACTION RÉCUPÉRER PROFIL
export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🔄 Redux: Récupération profil...');
            const profile = await authService.getProfile();
            return profile;
        } catch (error) {
            console.error('❌ Redux: Erreur profil:', error);
            return rejectWithValue(error.message || 'Erreur lors de la récupération du profil');
        }
    }
);
export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (_, { rejectWithValue }) => {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Aucun token trouvé');
            }

            console.log('🔄 Redux: Restauration session avec token...');
            const profile = await authService.getProfile();
            return profile;
        } catch (error) {
            console.error('❌ Redux: Session expirée:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return rejectWithValue('Session expirée');
        }
    }
);

// ====== SLICE REDUX ======

const authSlice = createSlice({
    name: 'auth',
    initialState,

    // Actions synchrones
    reducers: {
        // 🚪 DÉCONNEXION (juste mettre à jour l'état Redux)
        logout: (state) => {
            console.log('🔄 Redux: Déconnexion état...');
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            // ❌ NE PAS APPELER authService.logout() ici !
        },

        // 🧹 EFFACER ERREURS
        clearError: (state) => {
            state.error = null;
        },


    },

    // Actions asynchrones
    extraReducers: (builder) => {
        builder
            // === INSCRIPTION ===
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
                console.log('✅ Redux: Inscription réussie', action.payload.user);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })

            // === CONNEXION ===
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
                console.log('✅ Redux: Connexion réussie', action.payload.user);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })

            // === PROFIL ===
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                console.log('✅ Redux: Profil récupéré', action.payload);
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Si erreur profil, probablement token invalide
                state.isAuthenticated = false;
                state.user = null;
            })
            // === RESTAURER SESSION ===
            .addCase(restoreSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                console.log('✅ Redux: Session restaurée avec profil', action.payload);
            })
            .addCase(restoreSession.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                console.log('❌ Redux: Échec restauration session');
            });;
    }
});

// Export des actions
export const { logout, clearError } = authSlice.actions;

// Export du reducer
export default authSlice.reducer;