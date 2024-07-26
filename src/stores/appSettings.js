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
      numConfigError: 5,
      numPrescriptions: 45,
      epSystemOptions: [
        { value: 'Altera (Sunrise, Allscripts)', text: 'Altera (Sunrise, Allscripts)' },
        { value: 'Better', text: 'Better' },
        { value: 'Cerner', text: 'Cerner' },
        { value: 'CIS Chemocare', text: 'CIS Chemocare' },
        { value: 'Civica', text: 'Civica' },
        { value: 'CMM System C (JAC, Wellsky)', text: 'CMM System C (JAC, Wellsky)' },
        { value: 'Dedalus', text: 'Dedalus' },
        { value: 'EMIS', text: 'EMIS' },
        { value: 'EPIC', text: 'EPIC' },
        { value: 'InterSystems', text: 'InterSystems' },
        { value: 'Dedalus - Lorenzo', text: 'Dedalus - Lorenzo' },
        { value: 'Dedalus - Medchart', text: 'Dedalus - Medchart' },
        { value: 'Meditech', text: 'Meditech' },
        { value: 'Medchart', text: 'Medchart' },
        { value: 'NerveCentre', text: 'NerveCentre' },
        { value: 'Quadramed', text: 'Quadramed' },
        { value: 'Servelec', text: 'Servelec' },
        { value: 'TPP (SystmOne)', text: 'TPP (SystmOne)' },
        { value: 'Medway', text: 'Medway' },
        { value: 'Open EP ', text: 'Open EP ' },
        { value: 'Phillips ICCA', text: 'Phillips ICCA' },
        { value: 'Other', text: 'Own System/Other (please specify)' }
      ]
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
