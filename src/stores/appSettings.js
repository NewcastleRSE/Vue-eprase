import { defineStore } from 'pinia'

// NOTE: 27/04/2026 David - the variables 'jwtLifespan' and 'sessionInactivityTimeout' reflect the quantities
// 'JWT_LIFESPAN'  and 'INACTIVITY_TIMEOUT' in the backend .env file.  If you change these here, make sure to
// change them in the backend config too, and vice-versa!

export const appSettingsStore = defineStore('appSettings', {
  state: () => {
    return {
      version: '3.1.7',
      debugMode: false,
      year: new Date().getFullYear(),
      jwtLifespan: 14400,                           // JWT lifespan in seconds (4 hours)    
      sessionInactivityTimeout: 120 * 60 * 1000,    // Sessions expire after this number of milliseconds (2 hours)
      sessionInactivityWarningAt: 119 * 60 * 1000,  // Warn the user of session expiry after this number of milliseconds 
      passwordMinLength: 6,
      passwordMaxLength: 50,
      assessmentNumPatients: 15,
      maxSelectableDsCategories: 2,                 // How many selectable categories for scenario with user intervention
      // Desperate stuff - have to hard code ePRaSE colours here as well as in _variables.module.css - the :export fails after Dart sass update
      // Any updates here need to be mirrored exactly in assets/_variables.module.css, and vice-versa - David 12/06/2026
      epraseTheme: {
        'primary': '#07818e',
        'success': '#35d635',
        'warning': '#ffbf00',
        'danger': '#ff3b33',
        'info': '#66b4ea',
        'light': '#dee2e6',
        'dark': '#2c3e50',
        'invalid': '#6f42c1'
      }
    }
  }
})
