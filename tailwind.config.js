/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./public/index.html",
    ],
    plugins: [
        require("tailwindcss-animate"),
        require("tailwindcss"),
        require("autoprefixer"),
    ],
};
