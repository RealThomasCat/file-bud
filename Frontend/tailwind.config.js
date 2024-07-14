/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#828FFF",
                bgCol: "#121212",
                glass: "#242424",
                borderCol: "#FFFFFF",
                textCol: "#EFEFEF",
                hoverCol: "#3B3B3B",
            },
        },
    },
    plugins: [],
};
