module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'libre-caslon': ['var(--font-libre-caslon-text)', 'serif'],
                'poppins': ['var(--font-poppins)', 'sans-serif'],
            },
        },
    },
}