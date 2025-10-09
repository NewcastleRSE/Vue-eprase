import { defineStore } from 'pinia'

export const appSettingsStore = defineStore('appSettings', {
  state: () => {
    return {
      version: '4.0.0',
      debugMode: false,
      year: new Date().getFullYear(),     
      passwordMinLength: 6,
      passwordMaxLength: 50,
      assessmentNumPatients: 15,
      numConfigError: 5,
      numPrescriptions: 45,      
    }
  }
})
