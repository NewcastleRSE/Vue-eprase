import { defineStore } from 'pinia'

export const appSettingsStore = defineStore('appSettings', {
  state: () => {
    return {
      version: '2.5.3',
      debugMode: false,
      appOpen: true,
      year: new Date().getFullYear(),     
      passwordMinLength: 6,
      passwordMaxLength: 50,      
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
