// src/App.jsx - VERSION TEMPORAIRE
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import { useState, useEffect } from 'react'

// Import des composants layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ScrollToTop'

// Import des pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsListPage from './pages/projects/ProjectsListPage'
import ProjectDetailPage from './pages/projects/ProjectDetailPage'
import MesProjetsPage from './pages/projects/MesProjetsPage'
import CreerProjetPage from './pages/projects/CreerProjetPage'
import ModifierProjetPage from './pages/projects/ModifierProjetPage'
import ProjetCommentaireAdminPage from './pages/projects/ProjetCommentaireAdminPage'
import MesContributionsPage from './pages/contributions/MesContributionsPage'
import MesFavorisPage from './pages/favoris/MesFavorisPage'
import DashboardPorteurStats from './pages/porteur/DashboardPorteurStats'
import GestionContributeurs from './pages/porteur/GestionContributeurs'
import MesContributeursPage from './pages/porteur/MesContributeursPage'
import ProfilPage from './pages/user/ProfilPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import AdminProjetsEnAttente from './pages/admin/AdminProjetsEnAttente';
import AdminProjetDetail from './pages/admin/AdminProjetDetail';
import AdminUtilisateursPage from './pages/admin/AdminUtilisateursPage';
import AdminHistoriquePage from './pages/admin/AdminHistoriquePage';
import { Error404, Error500, Error403 } from './pages/ErrorPage';
// Pages statiques
import AidePage from './pages/static/AidePage'
import ContactPage from './pages/static/ContactPage'
import AProposPage from './pages/static/AProposPage'
import ConditionsPage from './pages/static/ConditionsPage'
import ConfidentialitePage from './pages/static/ConfidentialitePage'
import MentionsLegalesPage from './pages/static/MentionsLegalesPage'
import CommentCaMarchePage from './pages/static/CommentCaMarchePage'


// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/admin.css';

// ✅ AJOUTEZ ce composant de protection dans App.jsx

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Vérification des permissions...</span>
        </div>
      </div>
    );
  }

  // Si pas connecté → redirection login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté mais pas admin → redirection dashboard
  if (!isAdmin()) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>🚫 Accès refusé</h4>
          <p>Vous n'avez pas les permissions d'administrateur.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Si admin authentifié → accès autorisé
  return children;
};

function App() {
  const { isAuthenticated, user, loading } = useAuth()

  // Affichage de chargement global pendant la restauration de session
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <h5 className="text-muted">Chargement de DiapalSen...</h5>
          <p className="small text-muted">Vérification de votre session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="App d-flex flex-column min-vh-100">
      {/* Header avec navigation */}
      <Header />
      <ScrollToTop />

      {/* Contenu principal */}
      <main className="flex-grow-1" style={{ paddingTop: '56px' }}>
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<HomePage />} />

          {/* Pages d'authentification */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Pages projets */}
          <Route path="/projets" element={<ProjectsListPage />} />
          <Route path="/projets/:id" element={<ProjectDetailPage />} />
          <Route path="/mes-projets" element={<MesProjetsPage />} />
          <Route path="/mes-projets/:projectId" element={<Navigate to="/mes-projets" replace />} />
          <Route path="/projets/creer" element={<CreerProjetPage />} />
          <Route path="/projets/:projectId/modifier" element={<ModifierProjetPage />} />
          <Route path="/mes-projets/:projectId/commentaires" element={<ProjetCommentaireAdminPage />} />


          {/* Contributions */}
          <Route path="/mes-contributions" element={<MesContributionsPage />} />

          {/* Favoris */}
          <Route path="/mes-favoris" element={<MesFavorisPage />} />

          {/* Profil utilisateur */}
          <Route path="/profil" element={<ProfilPage />} />

          {/* Notifications */}
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Routes porteur */}
          <Route path="/mes-projets/:projectId/stats" element={<DashboardPorteurStats />} />
          <Route path="/mes-projets/:projectId/contributeurs" element={<GestionContributeurs />} />
          <Route path="/contributeurs" element={<MesContributeursPage />} />

          {/* ✅ ROUTES ADMIN */}
          <Route path="/admin/projets/en-attente" element={<AdminProjetsEnAttente />} />
          <Route path="/admin/projets/:projectId/detail" element={<AdminProjetDetail />} />
          <Route path="/admin/projets/:projectId/valider" element={<AdminProjetDetail />} />
          <Route path="/admin/utilisateurs" element={<AdminUtilisateursPage />} />
          <Route path="/admin/validations" element={<AdminHistoriquePage />} />
          {/* Pages statiques */}
          <Route path="/aide" element={<AidePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/a-propos" element={<AProposPage />} />
          <Route path="/conditions" element={<ConditionsPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/comment-ca-marche" element={<CommentCaMarchePage />} />

          {/* Route 404 - Doit être en dernier */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App