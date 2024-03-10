export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        card: 'rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        layout: 'radial-gradient(circle at left top, #F8CEEC 20%, #E6EDF2 40%, transparent),\n' +
            'radial-gradient(circle at right top,#C3ADF6 30%, #E6EDF2 40%, transparent)',
        // card: 'rgba(255, 255, 255, 0.6)'
        // 'card': 'radial-gradient(100% 249.45% at 0% 2.78%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      colors: {
        gray: {
          DEFAULT: '#FFFFFF3D',
          200: '#5B7083'
        },
        blue: {
          DEFAULT: '#3672E9'
        },
        black: {
          DEFAULT: '#38414D'
        },
        red: {
          DEFAULT: '#C73333'
        }
      },
      boxShadow: {
        buttonPrimary: '0px 20px 50px 0px #3672E969',
        buttonSecondary: '0px 20px 50px 0px #F7F8FF69'
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}
