/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#828FFF",
                bgCol: "#030015",
                glass: "#B094FF",
                borderCol: "#FFFFFF",
                textCol: "#FFFFFF",
            },
        },
    },
    plugins: [],
};
