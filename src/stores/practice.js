import { defineStore } from 'pinia'

export const practiceStore = defineStore('practice', {
  state: () => {
    return {
      practiceNumPatients: 1,
      patients: [],    
      patientScenarios: {},       // The details of the scenarios
    }
  }
})
