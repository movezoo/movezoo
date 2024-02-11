/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        GreenBlue: '#0B60B0',
        CelestialBlue: '#40A2D8',
        Beige: '#F0EDCF'
      },
      fontFamily:{
        'Pixel':['DNFBitBitv2'],
        'Pretendard':['Pretendard-Black']
      },
    },
  },
  plugins: [],
}