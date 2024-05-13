import { defineStore } from 'pinia'

export const appSettingsStore = defineStore('appSettings', {
  state: () => {
    return {
      version: '2.5.3',
      debugMode: true,
      appOpen: true,
      year: new Date().getFullYear(),     
      passwordMinLength: 6,
      passwordMaxLength: 50,
      assessmentNumPatients: 15,
      numConfigError: 2,
      numPrescriptions: 45
    }
  },
  actions: {
    setOpen: (isOpen) => {
      this.appOpen = isOpen
    },
    setDebug: (isDebug) => {
      this.debugMode = isDebug
    }
  }
})
