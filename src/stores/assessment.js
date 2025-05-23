import { defineStore } from 'pinia'
import { rootStore } from './root'
import { authenticationStore } from './authentication'

const EMPTY_SYSTEM = {        
  epService: '',
  otherEpService: '',
  addEpService: '',
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
}

export const assessmentStore = defineStore('assessment', {
  state: () => ({ 
    assessmentData: {
      assessmentId: null,
      assessmentState: 'Not started',
      assessmentOption: '',
      patientType: '',
      institution: '',   
      hospital: '',   
      system: EMPTY_SYSTEM,
      patients: [],
      test: ''      
    },
    allPossibleAssessments: []
  }),
  persist: true, 
  actions: {  
    async getAssessmentsForInstitution() {
      const instCode = authenticationStore().orgCode
      const hospital = authenticationStore().hospital
      const response = await rootStore().apiCall(`assessments?filters[hospital][$eq]=${hospital}&populate[institution][filters][institution_code][$eq]=${instCode}&populate=system&populate=patients`, 'GET')
      if (response.status < 400) {
        this.$patch({ allPossibleAssessments: response.data.data })
        return true
      } else {
        return response.message
      }
    },
    resetSystemData() {
      this.$patch((state) => {
        state.assessmentData.system = EMPTY_SYSTEM
      })
    }
  }
})
