// src/App.jsx - VERSION TEMPORAIRE
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import { useState, useEffect } from 'react'

// Import des composants layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Import des pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsListPage from './pages/projects/ProjectsListPage'
import ProjectDetailPage from './pages/projects/ProjectDetailPage'
import MesProjetsPage from './pages/projects/MesProjetsPage'
import CreerProjetPage from './pages/projects/CreerProjetPage'
import MesContributionsPage from './pages/contributions/MesContributionsPage'
import DashboardPorteurStats from './pages/porteur/DashboardPorteurStats'
import GestionContributeurs from './pages/porteur/GestionContributeurs'
import AdminProjetsEnAttente from './pages/admin/AdminProjetsEnAttente';


// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/admin.css';

// Page 404
const NotFoundPage = () => (
  <div className="container py-5">
    <div className="text-center">
      <h2>404 - Page introuvable</h2>
      <p>Cette page n'existe pas encore.</p>
    </div>
  </div>
)
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
// ✅ REMPLACEZ le composant AdminDashboard temporaire par :
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler des stats pour le moment
    setTimeout(() => {
      setStats({
        projets: { total: 12, en_attente: 3, actifs: 8, finances: 1 },
        utilisateurs: { total: 45, contributeurs: 30, porteurs: 12, nouveaux_30j: 8 },
        contributions: { montant_total: 2500000, total_contributions: 67 }
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 text-muted">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">📊 Dashboard Administrateur</h1>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-primary">{stats.projets.total}</h3>
              <p className="text-muted">Projets total</p>
              <span className="badge bg-warning">{stats.projets.en_attente} en attente</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">{stats.utilisateurs.total}</h3>
              <p className="text-muted">Utilisateurs</p>
              <span className="badge bg-info">{stats.utilisateurs.nouveaux_30j} nouveaux (30j)</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-info">{stats.contributions.montant_total.toLocaleString()} FCFA</h3>
              <p className="text-muted">Montant collecté</p>
              <span className="badge bg-success">{stats.contributions.total_contributions} contributions</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">{stats.projets.en_attente}</h3>
              <p className="text-muted">À valider</p>
              <a href="/admin/projets/en-attente" className="btn btn-sm btn-warning">Traiter</a>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <strong>🚧 Interface admin en développement</strong>
        <br />Prochaines étapes : Validation des projets, gestion utilisateurs, historique.
      </div>
    </div>
  );
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
          <Route path="/projets/creer" element={<CreerProjetPage />} />

          {/* Contributions */}
          <Route path="/mes-contributions" element={<MesContributionsPage />} />

          {/* Routes porteur */}
          <Route path="/mes-projets/:projectId/stats" element={<DashboardPorteurStats />} />
          <Route path="/mes-projets/:projectId/contributeurs" element={<GestionContributeurs />} />

          {/* ✅ ROUTES ADMIN SIMPLIFIÉES TEMPORAIRES */}
          {/* Routes admin PROTÉGÉES */}
          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          {/* Page 404 */}
          <Route path="*" element={<NotFoundPage />} />

          <Route path="/admin/projets/en-attente" element={<AdminProjetsEnAttente />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App