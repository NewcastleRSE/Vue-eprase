import { defineStore } from 'pinia'
import { shuffle } from '../helpers/utils'
import { rootStore } from './root'
import { appSettingsStore } from './appSettings'
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
  penicillinDescription: [],
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
      patients: []
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
        console.debug('Response data from fetch assessments', response.data.data, 'this before', this)
        this.$patch((state) => { state.allPossibleAssessments = response.data.data })
        console.debug('this after', this)
        return true
      } else {
        return response.message
      }
    },
    resetSystemData() {
      this.$patch((state) => {
        state.assessmentData.system = EMPTY_SYSTEM
      })
    },
    async saveAssessmentForInstitution() {

      console.group('saveAssessmentForInstitution()')
      console.debug('Auth store values', authenticationStore())

      let ret = false

      if (this.assessmentData.assessmentId == null) {
        const response = await rootStore().apiCall('assessments', 'POST', {
          data: {
            state: this.assessmentData.assessmentState,
            patient_type: this.assessmentData.patientType,
            hospital: authenticationStore().hospital,
            institution: {
              connect: [authenticationStore().orgDocId]
            }
          }
        })
        if (response.status < 400) {
          console.debug('Save assessment response is', response)
          this.$patch((state) => { state.assessmentData.assessmentId = response.data.data.documentId })
          ret = true
        } else {
          ret = response.message
        }
      } else {
        ret = 'Cannot save new assessment as have existing ID', this.assessmentId
      } 

      console.groupEnd()
      return ret

    },
    async patientBuildList() {

      console.group('patientBuildList()')      

      if (this.patients.length == 0) {
        // Generate patient list
        const response = await rootStore().getPatientPool(this.patientType)
        if (response.status < 400) {
          const patientPool = response.data.data
          if (patientPool.length < appSettingsStore().assessmentNumPatients) {
            console.groupEnd()
            return `There are not enough suitable patients in the database to do a viable assessment for patient type : ${this.patientType}`
          }
          // Get those whose scenarios include a required one
          const requiredPatients = patientPool.filter(p => p.scenarios.filter(s => s.required === true).length > 0)
          const randomPool = patientPool.filter(p => p.scenarios.filter(s => s.required === true).length == 0)
          // All the required patients are included, choose correct number of additional non-required ones
          const numRemaining = appSettingsStore().assessmentNumPatients - requiredPatients.length
          const randoms = new Set()
          while (randoms.size !== numRemaining) {
            randoms.add(Math.floor(Math.random() * randomPool.length))
          }          
          for (const num of randoms) {
            requiredPatients.push(randomPool[num])
          }
          shuffle(requiredPatients)
          this.patients = requiredPatients
          console.debug('Generated new patient list', this.patients)
          console.groupEnd()
          return true
        } else {
          console.groupEnd()
          return response.message
        }                
      } else {
        // Fetch existing patient list
      }
    }
  }
})
