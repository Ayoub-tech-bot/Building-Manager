/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        habita: {
          bg: "#F6F5EE",
          sidebar: "#ECEAE0",
          card: "#FFFFFF",
          border: "#E2DFC9",
          "border-subtle": "#EDEAE0",
          primary: "#1E392A",
          "primary-hover": "#172E21",
          "primary-light": "#2E5A44",
          text: "#18201B",
          "text-muted": "#59655B",
          "text-light": "#879288",
        },
        badge: {
          late: {
            bg: "#FBEBE8",
            text: "#BA372A",
            border: "#F5CBC4",
          },
          partial: {
            bg: "#FBF1E6",
            text: "#9E621E",
            border: "#F5DFBF",
          },
          paid: {
            bg: "#E8F2EC",
            text: "#1F6B43",
            border: "#C6E2D1",
          },
          progress: {
            bg: "#EAF2F1",
            text: "#256660",
            border: "#C4E1DE",
          },
          pending: {
            bg: "#F8EFE4",
            text: "#8A5F26",
            border: "#EEDEC8",
          },
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'card': '0 2px 6px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}

