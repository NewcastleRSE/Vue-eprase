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
      assessmentNumPatients: 15 
    }
  }
})
