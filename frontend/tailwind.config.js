/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // darkMode: false, // or 'media' or 'class'
  // content: [],
  theme: {
    fontFamily: {
      // Pretendard: ['Pretendard-regular'],
    },
    extend: {
      boxShadow: {
        modal: '0px 0px 5px 0 rgba(156,156,156,0.25)',
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
}

