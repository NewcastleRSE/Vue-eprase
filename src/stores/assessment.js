import { defineStore } from 'pinia'

export const assessmentStore = defineStore('assessment', {
  state: () => ({ 
    assessmentData: {
      assessmentId: null,
      assessmentState: 'Not started',
      patientType: 'Adult',
      system: {
        epService: '',
        otherEpService: '',
        localEpServiceName: '',
        epServiceImplemented: null,
        epServiceUpdated: null,
        numMaintainers: 1.0,
        epUsage: '',
        otherEpSystem: '',
        labResults: false,
        manResults: false,
        medHistory: false,
        diagnosisResults: false,
        penicillinDescription: '',
        penicillinDescriptionOther: '',
        penicillinResults: false,
        penicillinComment: '',
        highRiskMeds: [],
        clinicalAreas: [],
        otherClinicalArea: ''
      },
      patients: []
    }
  }),
  persist: true, 
  actions: {    
  }
})
