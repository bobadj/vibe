export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'layout': 'radial-gradient(circle at left top, #F8CEEC 20%, #E6EDF2 40%, transparent),\n' +
            'radial-gradient(circle at right top,#C3ADF6 30%, #E6EDF2 40%, transparent)'
      },
      colors: {
        blue: {
          DEFAULT: '#3672E9'
        },
        black: {
          DEFAULT: '#38414D'
        }
      },
      boxShadow: {
        'buttonPrimary': '0px 20px 50px 0px #3672E969',
        'buttonSecondary': '0px 20px 50px 0px #F7F8FF69'
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}
