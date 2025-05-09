import { defineStore } from 'pinia'
import { rootStore } from './root'
import { authenticationStore } from './authentication'

export const assessmentStore = defineStore('assessment', {
  state: () => ({ 
    assessmentData: {
      assessmentId: null,
      assessmentState: 'Not started',
      assessmentOption: '',
      patientType: '',
      institution: '',   
      hospital: '',   
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
    },
    allPossibleAssessments: []
  }),
  persist: true, 
  actions: {  
    async getAssessmentsForInstitution() {
      const response = await rootStore().apiCall(`assessments??populate[institution][filters][code][$eq]=${authenticationStore().orgCode}&populate=system&populate=patients`, 'GET')
      if (response.status < 400) {
        this.$patch({ allPossibleAssessments: response.data.data })
        return true
      } else {
        return response.message
      }
    },
    updateAssessmentData(newData) {
      //TODO - extract anything in sub-objects like 'system' based on the name e.g. 'system.epService' and $patch
    }
  }
})
