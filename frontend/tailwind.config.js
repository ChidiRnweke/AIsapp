/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', "./index.html", './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}', "./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}",
  ],
  plugins: [require('flowbite/plugin')],


  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      colors: {
        primary: '#1a73e8',
        secondary: '#0f62fe',
        accent: '#4db8ac',
        background: '#EDF3FD',
        'background-alt': '#FFFFFF',
        foreground: '#333333',
        subtle: '#606060',
        error: '#dc3545',
        'dark-primary': '#BB86FC',
        'dark-accent': '#03DAC5',
        'dark-secondary': '#C792EA',
        'dark-background': '#2C2C2C',
        'dark-background-alt': '#1F1B24',
        'dark-foreground': '#ffffff',
        'dark-subtle': '#b0b0b0',
        'dark-error': '#ff6b6b'
      },
    }
  }
}

