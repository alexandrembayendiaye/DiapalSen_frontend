// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Configuration du store Redux
const store = configureStore({
    reducer: {
        auth: authReducer,
        // Ici on ajoutera d'autres reducers plus tard :
        // projects: projectsReducer,
        // notifications: notificationsReducer,
    },

    // Configuration pour le développement
    devTools: process.env.NODE_ENV !== 'production',

    // Middleware par défaut (inclut redux-thunk)
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});



export default store;