// src/utils/imageUtils.js
import noImageAvailable from '../assets/images/no-image-available.jpg'
import defaultListImage from '../assets/images/default-list-image.jpg' // ← votre nouvelle image

// Fonction pour la liste des projets
export const getProjectListImage = (imageUrl, titre = 'Projet') => {
    if (imageUrl && imageUrl.trim() !== '') {
        return imageUrl
    }
    return defaultListImage // ← utilise votre image pour la liste
}

// Fonction pour la page détail (garde l'ancienne)
export const getProjectDetailImage = (imageUrl, titre = 'Projet') => {
    if (imageUrl && imageUrl.trim() !== '') {
        return imageUrl
    }
    return noImageAvailable
}

// Fonction pour obtenir plusieurs images d'un projet (détail)
export const getProjectImages = (project) => {
    const mainImage = getProjectDetailImage(project.image_principale, project.titre)

    return [
        mainImage,
        project.image_2 || noImageAvailable,
        project.image_3 || noImageAvailable
    ]
}