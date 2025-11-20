// src/pages/porteur/DashboardPorteurStats.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import projectsService from '../../services/projectsService'
import contributionsService from '../../services/contributionsService'
import toast from 'react-hot-toast'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Registrer les composants Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

const DashboardPorteurStats = () => {
    const { projectId } = useParams()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [project, setProject] = useState(null)
    const [stats, setStats] = useState({
        contributions: [],
        contributeurs: [],
        vues: [],
        partages: {},
        commentaires: 0,
        favoris: 0
    })

    useEffect(() => {
        loadProjectStats()
    }, [projectId])

    const loadProjectStats = async () => {
        try {
            setLoading(true)

            // Charger les données du projet avec gestion d'erreur améliorée
            let projectData
            try {
                projectData = await projectsService.getMonProjet(projectId)

                // Vérifier que l'utilisateur est bien le porteur du projet
                if (projectData.porteur.id !== user.id) {
                    toast.error('Vous n\'avez pas accès aux statistiques de ce projet')
                    return
                }

                setProject(projectData)
            } catch (projectError) {
                console.error('❌ Erreur chargement projet:', projectError)

                if (projectError.status === 404) {
                    toast.error('Projet non trouvé')
                } else if (projectError.status === 403) {
                    toast.error('Accès refusé à ce projet')
                } else {
                    toast.error('Erreur lors du chargement du projet')
                }
                setProject(null)
                return
            }

            // Charger les statistiques seulement si le projet existe
            try {
                const [contributionsData, statsData] = await Promise.all([
                    contributionsService.getContributionsProjet(projectId),
                    // Utiliser une API simple ou simuler les stats pour l'instant
                    Promise.resolve({
                        vues: [],
                        partages: {},
                        commentaires: 0,
                        favoris: 0
                    })
                ])

                setStats({
                    contributions: contributionsData.results || [],
                    contributeurs: contributionsData.contributeurs || [],
                    vues: statsData.vues || [],
                    partages: statsData.partages || {},
                    commentaires: statsData.commentaires || 0,
                    favoris: statsData.favoris || 0
                })
            } catch (statsError) {
                console.warn('⚠️ Erreur chargement stats (non critique):', statsError)
                // Les stats ne sont pas critiques, on continue avec des données vides
                setStats({
                    contributions: [],
                    contributeurs: [],
                    vues: [],
                    partages: {},
                    commentaires: 0,
                    favoris: 0
                })
            }

        } catch (error) {
            console.error('❌ Erreur générale chargement stats:', error)
            toast.error('Erreur lors du chargement des statistiques')
            setProject(null)
        } finally {
            setLoading(false)
        }
    }

    // Préparer les données pour les graphiques
    const prepareContributionsChartData = () => {
        if (!stats.contributions.length) return { labels: [], datasets: [] }

        // Grouper les contributions par jour
        const contributionsByDay = {}
        stats.contributions.forEach(contribution => {
            const date = new Date(contribution.date_contribution).toLocaleDateString('fr-FR')
            contributionsByDay[date] = (contributionsByDay[date] || 0) + contribution.montant
        })

        const sortedDates = Object.keys(contributionsByDay).sort((a, b) =>
            new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-'))
        )

        let cumulativeAmount = 0
        const cumulativeData = sortedDates.map(date => {
            cumulativeAmount += contributionsByDay[date]
            return cumulativeAmount
        })

        return {
            labels: sortedDates,
            datasets: [
                {
                    label: 'Montant collecté (FCFA)',
                    data: cumulativeData,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Contributions par jour',
                    data: sortedDates.map(date => contributionsByDay[date]),
                    type: 'bar',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y1'
                }
            ]
        }
    }

    const prepareSourcesChartData = () => {
        const sources = {}
        stats.contributions.forEach(contribution => {
            const source = contribution.source || 'Direct'
            sources[source] = (sources[source] || 0) + 1
        })

        return {
            labels: Object.keys(sources),
            datasets: [{
                data: Object.values(sources),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        }
    }

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Évolution des contributions'
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            }
        }
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement des statistiques...</p>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h4>Projet non trouvé</h4>
                    <p>Le projet demandé n'existe pas ou vous n'y avez pas accès.</p>
                    <Link to="/dashboard" className="btn btn-primary">
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-porteur-stats">

            {/* En-tête */}
            <div className="bg-primary text-white py-4 mb-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <nav aria-label="breadcrumb" className="mb-2">
                                <ol className="breadcrumb breadcrumb-white mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard" className="text-white">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/mes-projets" className="text-white">Mes projets</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Statistiques</li>
                                </ol>
                            </nav>
                            <h1 className="h3 mb-1">{project.titre}</h1>
                            <p className="mb-0 opacity-75">
                                Tableau de bord et analyses détaillées
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            <Link
                                to={`/projets/${project.id}`}
                                className="btn btn-light me-2"
                            >
                                <i className="bi bi-eye me-1"></i>
                                Voir le projet
                            </Link>
                            <Link
                                to={`/mes-projets/${project.id}/edit`}
                                className="btn btn-outline-light"
                            >
                                <i className="bi bi-pencil me-1"></i>
                                Modifier
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">

                {/* Métriques principales */}
                <div className="row mb-4">
                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card bg-success text-white h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="card-title opacity-75">Montant collecté</h6>
                                        <h3 className="mb-0">
                                            {(project.montant_collecte / 1000000).toFixed(1)}M FCFA
                                        </h3>
                                        <small className="opacity-75">
                                            {project.pourcentage_atteint}% de l'objectif
                                        </small>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-cash-coin fs-1 opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card bg-primary text-white h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="card-title opacity-75">Contributeurs</h6>
                                        <h3 className="mb-0">{project.nombre_contributeurs}</h3>
                                        <small className="opacity-75">
                                            {stats.contributions.length} contributions
                                        </small>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-people fs-1 opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card bg-info text-white h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="card-title opacity-75">Vues du projet</h6>
                                        <h3 className="mb-0">{project.nombre_vues || 0}</h3>
                                        <small className="opacity-75">
                                            {stats.favoris} favoris
                                        </small>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-eye fs-1 opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <div className="card bg-warning text-white h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="card-title opacity-75">Engagement</h6>
                                        <h3 className="mb-0">{stats.commentaires}</h3>
                                        <small className="opacity-75">
                                            {Object.values(stats.partages).reduce((a, b) => a + b, 0)} partages
                                        </small>
                                    </div>
                                    <div className="align-self-center">
                                        <i className="bi bi-chat-dots fs-1 opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Graphiques */}
                <div className="row">

                    {/* Évolution des contributions */}
                    <div className="col-lg-8 mb-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-graph-up me-2"></i>
                                    Évolution des contributions
                                </h5>
                            </div>
                            <div className="card-body">
                                {stats.contributions.length > 0 ? (
                                    <Line
                                        data={prepareContributionsChartData()}
                                        options={chartOptions}
                                    />
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-graph-up fs-1 d-block mb-2"></i>
                                        <p>Aucune contribution pour le moment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sources de trafic */}
                    <div className="col-lg-4 mb-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-pie-chart me-2"></i>
                                    Sources de contributions
                                </h5>
                            </div>
                            <div className="card-body">
                                {stats.contributions.length > 0 ? (
                                    <Doughnut
                                        data={prepareSourcesChartData()}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom'
                                                }
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-pie-chart fs-1 d-block mb-2"></i>
                                        <p>Pas encore de données</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tableau des contributeurs récents */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-people me-2"></i>
                                    Dernières contributions
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                {stats.contributions.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Contributeur</th>
                                                    <th>Montant</th>
                                                    <th>Date</th>
                                                    <th>Message</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.contributions.slice(0, 10).map((contribution, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                                                                    style={{ width: '32px', height: '32px' }}>
                                                                    <span className="text-white small fw-bold">
                                                                        {contribution.contributeur_nom?.charAt(0) || 'A'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <strong className="d-block">
                                                                        {contribution.contributeur_nom || 'Anonyme'}
                                                                    </strong>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <strong className="text-success">
                                                                {contribution.montant.toLocaleString()} FCFA
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            {new Date(contribution.date_contribution).toLocaleDateString('fr-FR')}
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">
                                                                {contribution.message || 'Aucun message'}
                                                            </small>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-people fs-1 d-block mb-2"></i>
                                        <p>Aucune contribution pour le moment</p>
                                        <small>Partagez votre projet pour attirer des contributeurs !</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashboardPorteurStats