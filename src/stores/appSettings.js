import { defineStore } from 'pinia'

export const appSettingsStore = defineStore('appSettings', {
  state: () => {
    return {
      version: '3.1.7',
      debugMode: false,
      year: new Date().getFullYear(),
      sessionTimeoutAfter: 14400,     
      passwordMinLength: 6,
      passwordMaxLength: 50,
      assessmentNumPatients: 15 
    }
  }
})
