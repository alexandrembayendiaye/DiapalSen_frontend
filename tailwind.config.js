/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'diapal-blue': '#2563eb',
                'diapal-blue-dark': '#1d4ed8',
                'diapal-green': '#22c55e',
                'diapal-orange': '#f59e0b',
                'diapal-red': '#ef4444',
            },
        },
    },
    plugins: [],
}