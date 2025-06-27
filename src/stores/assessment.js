import { defineStore } from 'pinia'
import { shuffle } from '../helpers/utils'
import { rootStore } from './root'
import { appSettingsStore } from './appSettings'
import { authenticationStore } from './authentication'

const ASSESSMENT_STATES = [
  'Not started',
  'System complete',
  'Patient build complete',
  'Scenarios complete'
]

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

const EMPTY_DATA = {
  assessmentId: null,
  assessmentState: 'Not started',
  assessmentOption: '',
  institution: '',   
  hospital: '',
  epService: {},
  otherEpService: '',
  patientType: '',     
  system: EMPTY_SYSTEM,
  patients: []
}

export const assessmentStore = defineStore('assessment', {
  state: () => ({ 
    assessmentData: EMPTY_DATA,
    allPossibleAssessments: [],
    assessmentStates: ASSESSMENT_STATES
  }),
  persist: true,   
  actions: {  
    async getAssessmentsForInstitution() {
      const instCode = authenticationStore().orgCode
      const hospital = authenticationStore().hospital
      const response = await rootStore().apiCall(`assessments?filters[hospital][$eq]=${hospital}&populate[institution][filters][institution_code][$eq]=${instCode}&populate=ep_service`, 'GET')
      if (response.status < 400) {
        console.debug('Response data from fetch assessments', response.data.data)
        this.$patch((state) => { state.allPossibleAssessments = response.data.data })
        return true
      } else {
        return response.message
      }
    },
    reset() {
      console.group('reset() on assessment store')
      this.$patch((state) => {
        state.assessmentData = EMPTY_DATA
      })
      console.debug(this.assessmentData)
      console.groupEnd()
    },
    resetSystemData() {
      this.$patch((state) => {
        state.assessmentData.system = EMPTY_SYSTEM
      })
    },
    async selectAssessment() {

      console.group('selectAssessment()')

      let ret = false

      if (this.assessmentData.assessmentOption == 'new') {
        // New assessment
        console.debug('New assessment => save data')
        const response = await rootStore().apiCall('assessments', 'POST', {
          data: {
            state: this.assessmentData.assessmentState,
            patient_type: this.assessmentData.patientType,
            hospital: authenticationStore().hospital,
            institution: {
              connect: [authenticationStore().orgDocId]
            },
            ep_service: {
              connect: [this.assessmentData.epService.value]
            },
            other_ep_service: this.assessmentData.otherEpService
          }
        })
        if (response.status < 400) {
          console.debug('Save assessment response is', response)
          this.$patch((state) => { 
            state.assessmentData = Object.assign(state.assessmentData, {
              assessmentId: response.data.data.documentId,
              hospital: authenticationStore().hospital,
              institution: authenticationStore().orgDocId
            })
          })
          ret = true
        } else {
          ret = response.message
        }
      } else if (this.assessmentData.assessmentOption == 'continue') {
        // Continuing existing assessment
        console.debug('Continuing assessment', this.assessmentData.assessmentId, '=> patch in data')
        const chosenAssessment = this.allPossibleAssessments.filter(a => a.documentId == this.assessmentData.assessmentId)
        if (chosenAssessment.length > 0) {
          this.$patch((state) => {
            state.assessmentData = {
              assessmentState: chosenAssessment.state,
              epService: {
                value: chosenAssessment.ep_service.documentId,
                label: chosenAssessment.epService.name
              },
              otherEpService: chosenAssessment.other_ep_service,
              hospital: authenticationStore().hospital,
              institution: authenticationStore().orgDocId,
              patientType: chosenAssessment.patient_type
            }
          })
        } else {
          ret = `Assessment with id ${this.assessmentData.assessmentId} not found in list of assessments for this institution/hospital`
        }
      } 

      console.groupEnd()
      return ret

    },
    async patientBuildList() {

      let ret = false

      console.group('patientBuildList()')      

      if (this.assessmentData.patients.length == 0) {
        // Load any patient list 
        // Generate patient list
        const response = await rootStore().getPatientPool(this.assessmentData.patientType)
        if (response.status < 400) {
          const patientPool = response.data.data
          if (patientPool.length < appSettingsStore().assessmentNumPatients) {
            console.groupEnd()
            return `There are not enough suitable patients in the database to do a viable assessment for patient type : ${this.assessmentData.patientType}`
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
          this.assessmentData.patients = requiredPatients
          console.debug('Generated new patient list', this.assessmentData.patients)
          // Save to assessment patient list
          const response = await rootStore().apiCall(`assessments/${this.assessmentData.assessmentId}`, 'PUT', {
            data: {
              patients: {
                connect: this.assessmentData.patients.map(p => p.documentId)
              }
            }
          })         
          ret = response.status < 400 ? true : response.message
        } else {          
          ret = response.message
        }                
      } else {
        // Fetch existing patient list
      }
      console.debug('Returning', ret)
      console.groupEnd()
    }    
  }
})
