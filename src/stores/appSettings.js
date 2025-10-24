import { defineStore } from 'pinia'

export const appSettingsStore = defineStore('appSettings', {
  state: () => {
    return {
      version: '3.0.7',
      debugMode: false,
      year: new Date().getFullYear(),     
      passwordMinLength: 6,
      passwordMaxLength: 50,
      assessmentNumPatients: 15 
    }
  }
})
