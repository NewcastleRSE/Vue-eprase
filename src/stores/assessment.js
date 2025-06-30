import { defineStore } from 'pinia'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import humps from 'lodash-humps'
import createHumps from 'lodash-humps/lib/createHumps'
import { snakeCase } from 'lodash'
import { shuffle } from '../helpers/utils'
import { rootStore } from './root'
import { appSettingsStore } from './appSettings'
import { authenticationStore } from './authentication'

const ASSESSMENT_STATES = [
  {'Not started': 1},
  {'System started': 2},
  {'System complete': 3},
  {'Patient build started': 4},
  {'Patient build complete': 5},
  {'Scenarios started': 6},
  {'Scenarios complete': 7},
  {'Config errors started': 8},
  {'Config errors complete': 9}
]

const EMPTY_SYSTEM = {
  systemId: null,          
  addEpSystem: '',
  localEpSystemName: '',
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
  highRiskMeds: '',
  clinicalAreas: '',
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
      // Note: there are some redundant database calls in this store ('system' and 'patients' are retrieved separately) - the full call here was once:
      // assessments?filters[hospital][$eq]=${hospital}&populate[institution][filters][institution_code][$eq]=${instCode}&populate=ep_service&populate=system&populate=patients
      // If anyone can enlighten me on the "Invalid Key Error 2" this reliably gives unless one of the 'populate' or 'filter' terms is removed I (David) would be interested
      // Does not seems to matter which term goes, so it may be a Strapi bug or a query that's just too complex...
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

      let ret = true

      if (this.assessmentData.assessmentOption == 'new') {
        // New assessment
        console.debug('New assessment => save data')
        const response = await rootStore().apiCall('assessments', 'POST', {
          data: {
            state: this.assessmentData.assessmentState,
            patient_type: this.assessmentData.patientType,
            hospital: authenticationStore().hospital,
            institution: { connect: [authenticationStore().orgDocId] },
            ep_service: { connect: [this.assessmentData.epService.value] },
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
        } else {
          ret = response.message
        }
      } else if (this.assessmentData.assessmentOption == 'continue') {
        // Continuing existing assessment
        console.debug('Continuing assessment', this.assessmentData.assessmentId, '=> patch in data')
        const chosenAssessments = this.allPossibleAssessments.filter(a => a.documentId == this.assessmentData.assessmentId)
        if (chosenAssessments.length > 0) {
          this.$patch((state) => {
            state.assessmentData = Object.assign(state.assessmentData, {
              assessmentState: chosenAssessments[0].state,
              epService: {
                value: chosenAssessments[0].ep_service.documentId,
                label: chosenAssessments[0].ep_service.name
              },
              otherEpService: chosenAssessments[0].other_ep_service,
              hospital: authenticationStore().hospital,
              institution: authenticationStore().orgDocId,
              patientType: chosenAssessments[0].patient_type
            })
          })
          // Retrieve system data
          ret = await this.getSystemData()
          if (ret === true) {
            // Retrieve patient data
            ret = await this.getPatientList()
          }         
        } else {
          ret = `Assessment with id ${this.assessmentData.assessmentId} not found in list of assessments for this institution/hospital`
        }
      } 
      console.groupEnd()
      return ret

    },
    async getSystemData() {

      let ret = true

      console.group('getSystemData()')

      const currentState = ASSESSMENT_STATES[this.assessmentData.assessmentState]
      const requiredState = ASSESSMENT_STATES['System started']

      if (currentState >= requiredState) {
        // Retrieve stored system info
        const systemResponse = await rootStore().apiCall(`assessments/${this.assessmentData.assessmentId}?populate=system`, 'GET')
        if (systemResponse.status < 400) {
          // 'humps' converts from PostgreSQL underscore-based field names to camelCase keys...
          this.$patch((state) => {
            state.assessmentData.system = humps(systemResponse.data.data.system)
          })          
        } else {
          ret = `Failed to retrieve system data for assessment, error ${systemResponse}`
        }
      }
      console.groupEnd()
      return ret
    },
    async saveSystemData() {

      let ret = true

      console.group('saveSystemData()')

      const currentState = ASSESSMENT_STATES[this.assessmentData.assessmentState]
      const requiredState = ASSESSMENT_STATES['System started']

      // Save system info
      const snakes = createHumps(snakeCase)
      if (this.assessmentData.system.systemId != null) {
        // Update existing system data
        const response = await rootStore().apiCall(`systems/${this.assessmentData.system.systemId}`, 'PUT', { data: snakes(this.assessmentData.system) })
        if (response.status >= 400) {         
          ret = `Failed to update system data, error ${response.message}`
        }
      } else {
        // Save new system data
        const newSystem = Object.assign({}, snakes(this.assessmentData.system), {
          institution: { connect: [authenticationStore().orgDocId] },
          assessment: { connect: [this.assessmentData.assessmentId] }
        })
        delete newSystem.system_id  // Don't pass a null!
        const response = await rootStore().apiCall('systems', 'POST', { data: newSystem })
        if (response.status < 400) {
          this.$patch((state) => {
            state.assessmentData.system.systemId = response.data.data.documentId
          })
          this.updateAssessmentStatus('System complete')
        } else {
          ret = `Failed to save system data, error ${response.message}`
        }
      }        
      console.debug('Returning', ret)
      console.groupEnd()
      return ret
    },
    async updateAssessmentStatus(newStatus) {

      let ret = true

      console.group('updateAssessmentStatus()')
      console.debug('Set assessment status to', newStatus)

      if (this.assessmentData.assessmentId != null) {
        const updateStatusResponse = await rootStore().apiCall(`assessments/${this.assessmentData.assessmentId}`, 'PUT', { data: { state: newStatus }})
        if (updateStatusResponse.status < 400) {
          this.$patch((state) => {
            state.assessmentData.assessmentState = newStatus
          })
        } else {
          ret = `Failed to update assessment state to ${newStatus}`
        }        
      }         
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    async patientListBuild() {

      let ret = true

      console.group('patientListBuild()')      

      if (this.assessmentData.patients.length == 0 && this.assessmentData.assessmentState != 'Not started') {
        // Load patient list, if any
        const patientResponse = await rootStore().apiCall(`assessments/${this.assessmentData.assessmentId}?populate=patients`, 'GET')
        if (patientResponse.status < 400) {
          // API call ok 
          const patients = patientResponse.data.data.patients
          if (patients.length == 0) {
            // Generate patient list
            const response = await rootStore().getPatientPool(this.assessmentData.patientType)
            if (response.status < 400) {
              const patientPool = response.data.data
              if (patientPool.length < appSettingsStore().assessmentNumPatients) {
                console.warn(`Not enough patients of patient type : ${this.assessmentData.patientType} in database`)
                ret = `There are not enough suitable patients in the database to do a viable assessment for patient type : ${this.assessmentData.patientType}`
              } else {
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
                this.$patch((state) => {
                  state.assessmentData.patients = requiredPatients
                })
                console.debug('Generated new patient list', this.assessmentData.patients)
                // Save to assessment patient list
                const response = await rootStore().apiCall(`assessments/${this.assessmentData.assessmentId}`, 'PUT', {
                  data: {
                    patients: {
                      connect: this.assessmentData.patients.map(p => p.documentId)
                    }
                  }
                })         
                if (response.status >= 400) {
                  ret = `Failed to save patient list for assesssment : error was ${response.message}`
                } 
              }              
            } else {          
              ret = `Failed to retrieve data from patient table ${response.message}`
            }        
          } else {
            this.$patch((state) => {
              state.assessmentData.patients = patients
            })
          }
        } else {
          ret = `Error ${patientResponse.message} while retrieving patients for assessment`
        }
      }
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    }    
  }
})
