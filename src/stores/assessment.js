import { defineStore } from 'pinia'
import { authenticationStore } from './authentication'

export const assessmentStore = defineStore('assessment', {
  state: () => ({ 
    assessmentData: {
      assessmentId: null,
      assessmentState: 'Not started',
      patientType: 'Adult',
      institution: '',
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
      patients: [],
      hospital: ''
    }
  }),
  persist: true, 
  actions: {  
    async getAssessmentsForInstitution() {
      const instCode = authenticationStore().orgCode
      const response = await this.apiCall(`assessments?populate=*&populate[institution][filters][code][$eq]=${instCode}`, 'GET')
      return response
    },  
  }
})
