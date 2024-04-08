/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
    theme: {
        extend: {
            colors: {
                logo: "#236B51",
                highlight: "#458579",
                edited: "#1FACC4",
                highlight_hover: "#245B72",
                background: "#51A98F",
                background_pastel: "#E8F4F0",
                required_red: "#FF0000",
            },
        },
    },
    plugins: [require("flowbite/plugin")],
};
