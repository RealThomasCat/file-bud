/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#828FFF",
                bgCol: "#151515",
                glass: "#2A2A2A",
                borderCol: "#FFFFFF",
                textCol: "#EFEFEF",
            },
        },
    },
    plugins: [],
};
