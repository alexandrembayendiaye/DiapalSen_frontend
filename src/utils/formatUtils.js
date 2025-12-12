// src/utils/formatUtils.js

/**
 * Formate un montant en format lisible (K, M)
 * @param {number} montant - Le montant à formater
 * @param {boolean} showCurrency - Afficher "FCFA" à la fin
 * @returns {string} Le montant formaté
 * 
 * Exemples:
 * - 500 → "500"
 * - 1500 → "1.5K"
 * - 15000 → "15K"
 * - 150000 → "150K"
 * - 1500000 → "1.5M"
 * - 15000000 → "15M"
 */
export const formatMontant = (montant, showCurrency = true) => {
    if (montant === null || montant === undefined) return '0' + (showCurrency ? ' FCFA' : '')

    const num = parseFloat(montant)
    let formatted = ''

    if (num >= 1000000) {
        // Millions
        const millions = num / 1000000
        formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)
        formatted += 'M'
    } else if (num >= 1000) {
        // Milliers
        const milliers = num / 1000
        formatted = milliers % 1 === 0 ? milliers.toFixed(0) : milliers.toFixed(1)
        formatted += 'K'
    } else {
        formatted = num.toFixed(0)
    }

    // Supprimer les .0 inutiles
    formatted = formatted.replace('.0K', 'K').replace('.0M', 'M')

    return formatted + (showCurrency ? ' FCFA' : '')
}

/**
 * Formate un montant complet avec séparateur de milliers
 * @param {number} montant - Le montant à formater
 * @returns {string} Le montant formaté avec séparateurs
 * 
 * Exemple: 1500000 → "1 500 000 FCFA"
 */
export const formatMontantComplet = (montant) => {
    if (montant === null || montant === undefined) return '0 FCFA'
    return new Intl.NumberFormat('fr-FR').format(Math.round(montant)) + ' FCFA'
}

/**
 * Formate un pourcentage
 * @param {number} pourcentage - Le pourcentage
 * @returns {string} Le pourcentage formaté
 */
export const formatPourcentage = (pourcentage) => {
    if (pourcentage === null || pourcentage === undefined) return '0%'
    return Math.round(pourcentage) + '%'
}

export default {
    formatMontant,
    formatMontantComplet,
    formatPourcentage
}
