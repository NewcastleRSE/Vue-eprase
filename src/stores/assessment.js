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

const ASSESSMENT_STATES = {
  'Not started': 1,
  'System complete': 2,
  'Patient build complete': 3,
  'Scenarios complete': 4,
  'Config errors complete': 5,
  'Assessment complete': 6
}

const OMIT_SYSTEM_FIELDS = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt']

const EMPTY_SYSTEM = {
  systemId: null, 
  // Removed 28/07/2025 David, following meeting with Steph & Ellie at which it was agreed these were confusing and redundant
  // addEpSystem: '',
  // localEpSystemName: '',
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
  antiMicReviewTime: false,
  antiMicInterpretResults: false,
  antiMicReviewComments: '',
  antiMicInterpretComments: '',
  highRiskMeds: [],
  clinicalAreas: [],
  otherClinicalArea: ''
  // Removed 28/07/2025 David, following meeting with Steph & Ellie at which it was agreed this is redundant
  //timeTaken: null
}

const EMPTY_CONFIG_DATA = {
  configQuestionResults: []
}

const EMPTY_SELECTION = {
  assessmentId: null,
  assessmentOption: '',
  epService: {},
  otherEpService: '',
  patientType: '',  
  shareTrustsOptOut: false,
  shareSuppliersOptOut: false   
}

const ARRAY_FIELDS_HUMPS = ['penicillinDescription', 'highRiskMeds', 'clinicalAreas']
const ARRAY_FIELDS_SNAKES = ['penicillin_description', 'high_risk_meds', 'clinical_areas']

const EMPTY_DATA = {  
  assessmentState: 'Not started',  
  institution: '',   
  hospital: '',  
  selection: EMPTY_SELECTION,
  system: EMPTY_SYSTEM,
  config: EMPTY_CONFIG_DATA,
  patients: [],  
  completedPatients: '',
  numCompletedPatients: 0
}

export const assessmentStore = defineStore('assessment', {
  state: () => ({ 
    assessmentData: EMPTY_DATA,
    allPossibleAssessments: [],
    assessmentStates: ASSESSMENT_STATES,
    dataReady: false,
    loggingOut: false
  }),
  persist: true, 
  actions: {
    setDataReady(readyStatus) {
      this.$patch((state) => {
        state.dataReady = readyStatus
      })
    },
    setLoggingOut(logoutStatus) {
      this.$patch((state) => {
        state.loggingOut = logoutStatus
      })
    },
    assessmentStateIndex() {
      return ASSESSMENT_STATES[this.assessmentData.assessmentState]
    },
    async getAssessmentsForInstitution() {

      let ret = true

      console.group('getAssessmentsForInstitution()')

      this.setDataReady(false)

      const instCode = authenticationStore().orgCode
      const hospital = authenticationStore().hospital
      // Note: there are some redundant database calls in this store ('system', 'patients', 'scenarios' and 'config questions' are retrieved separately) - the full call here was once:
      // assessments?filters[hospital][$eq]=${hospital}&populate[institution][filters][institution_code][$eq]=${instCode}&populate=ep_service&populate=system&populate=patients
      // If anyone can enlighten me on the "Invalid Key Error 2" this reliably gives unless one of the 'populate' or 'filter' terms is removed I (David) would be interested
      // Does not seems to matter which term goes, so it may be a Strapi bug or a query that's just too complex...
      const response = await rootStore().apiCall(`assessments?filters[hospital][$eq]=${hospital}&populate[institution][filters][institution_code][$eq]=${instCode}&populate=ep_service`, 'GET')
      if (response.status < 400) {
        console.debug('Response data from fetch assessments', response.data.data)
        this.$patch((state) => { state.allPossibleAssessments = response.data.data })
      } else {
        ret = response.message
      }
      this.setDataReady(true)
      console.groupEnd()
      return ret
    },
    reset() {
      console.group('reset() on assessment store')
      this.$patch((state) => {
        state.assessmentData = EMPTY_DATA
        state.allPossibleAssessments = []
        state.dataReady = true
      })
      console.debug(this.assessmentData)
      console.groupEnd()
    },
    resetSystemData() {
      this.$patch((state) => {
        state.assessmentData.system = EMPTY_SYSTEM
      })
    },
    convertArrayFields(obj, toArray) {
      const fieldsToConvert = toArray ? ARRAY_FIELDS_HUMPS : ARRAY_FIELDS_SNAKES
      fieldsToConvert.forEach(ftc => {
        if (ftc in obj) {
          obj[ftc] = toArray ? obj[ftc].split(',') : obj[ftc].toString()
        }
      })
      return obj
    },
    onOrPassedAssessmentStage(required, current = null) {

      console.group('onOrPassedAssessmentStage()')
      console.debug('Current', current, 'test', required)

      const currentState = current == null ? ASSESSMENT_STATES[this.assessmentData.assessmentState] : ASSESSMENT_STATES[current]
      const requiredState = ASSESSMENT_STATES[required]

      console.debug('Current state', currentState, 'test state', requiredState)
      console.groupEnd()

      return currentState >= requiredState
    },
    // Select a currently in-progress assessment, or initialise a new one
    // Standalone method which always sets/unsets dataReady flag
    async selectAssessment() {

      console.group('selectAssessment()')

      let ret = true
      let uri = '/assessments'
      let action = 'select_assessment'
      this.setDataReady(false)

      if (this.assessmentData.selection.assessmentOption == 'new') {
        // New assessment
        console.debug('New assessment => save data')
        const response = await rootStore().apiCall('assessments', 'POST', {
          data: {
            state: this.assessmentData.assessmentState,
            patient_type: this.assessmentData.selection.patientType,
            hospital: authenticationStore().hospital,
            institution: { connect: [authenticationStore().orgDocId] },
            ep_service: { connect: [this.assessmentData.selection.epService.value] },
            other_ep_service: this.assessmentData.selection.otherEpService,
            share_trusts_opt_out: this.assessmentData.selection.shareTrustsOptOut,
            share_suppliers_opt_out: this.assessmentData.selection.shareSuppliersOptOut
          }
        })
        if (response.status < 400) {
          console.debug('Save assessment response is', response)
          this.$patch((state) => { 
            state.assessmentData.selection.assessmentId = response.data.data.documentId
            state.assessmentData.hospital = authenticationStore().hospital,
            state.assessmentData.institution = authenticationStore().orgDocId
          })
        } else {
          ret = response.message
        }
      } else if (this.assessmentData.selection.assessmentOption == 'continue') {
        // Continuing existing assessment
        console.debug('Continuing assessment', this.assessmentData.selection.assessmentId, '=> patch in data')
        uri = `${uri}/${this.assessmentData.selection.assessmentId}`
        const chosenAssessments = this.allPossibleAssessments.filter(a => a.documentId == this.assessmentData.selection.assessmentId)
        if (chosenAssessments.length > 0) {
          this.$patch((state) => {
            state.assessmentData = Object.assign(state.assessmentData, {
              assessmentState: chosenAssessments[0].state,
              selection: Object.assign(this.assessmentData.selection, {
                epService: {
                  value: chosenAssessments[0].ep_service.documentId,
                  label: chosenAssessments[0].ep_service.name
                },
                otherEpService: chosenAssessments[0].other_ep_service,
                patientType: chosenAssessments[0].patient_type,
                shareTrustsOptOut: chosenAssessments[0].share_trusts_opt_out,
                shareSuppliersOptOut: chosenAssessments[0].share_suppliers_opt_out
              }),                            
              hospital: authenticationStore().hospital,
              institution: authenticationStore().orgDocId
            })
          })
          // Retrieve system data
          ret = await this.getSystemData()
          if (ret === true) {
            // Retrieve patient data
            ret = await this.patientListBuild()
          } 
          if (ret === true) {
            // Retrieve scenario data TODO
            //ret = await this.getScenarios()
          }
          if (ret === true) {
            // Retrieve config question data
            ret = await this.getConfigQuestionData()
          }
        } else {
          ret = `Assessment with id ${this.assessmentData.selection.assessmentId} not found in list of assessments for this institution/hospital`
        }
      } 
      await rootStore().audit(action, uri, ret === true ? 'ok' : ret)

      this.setDataReady(true)

      console.debug('Returning', ret)
      console.groupEnd()
      return ret

    },
    // Get user responses to configuration questions
    async getConfigQuestionData(recordLoading = false)  {

      let ret = true

      // NOTE: recordLoading flag eliminates runaway watcher calls when multiple async methods are called in one store operation
      if (recordLoading) {
        this.setDataReady(false)
      }

      console.group('getConfigQuestionData()')
      console.assert(this.assessmentData.selection.assessmentId != null, 'No assessment ID present!')

      const confQuestionResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}?populate=config_error_data`, 'GET')
      if (confQuestionResponse.status < 400) {
        // Convert the 0/1 responses in the results to no/yes
        this.$patch((state) => {
          state.assessmentData.config.configErrorResults = confQuestionResponse.data.data.config_error_data.map(cq => (cq.result == 1 ? 'yes' : 'no'))
        })
      } else {
        ret = `Failed to retrieve config question responses for assessment, error ${confQuestionResponse}`
      }

      if (recordLoading) {
        this.setDataReady(true)
      }
      console.debug('Returning', ret)
      console.groupEnd()
      return ret
    },
    // Get the system data (may be used standalone - setting dataReady, or as part of another method)
    async getSystemData(recordLoading = false) {

      let ret = true

      // NOTE: recordLoading flag eliminates runaway watcher calls when multiple async methods are called in one store operation
      if (recordLoading) {
        this.setDataReady(false)
      }

      console.group('getSystemData()')
      console.assert(this.assessmentData.selection.assessmentId != null, 'No assessment ID present!')

      // Retrieve stored system info
      const systemResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}?populate=system`, 'GET')
      if (systemResponse.status < 400 && systemResponse.data.data.system != null) {
        // 'humps' converts from PostgreSQL underscore-based field names to camelCase keys...
        const newSystem = Object.assign({}, systemResponse.data.data.system)
        newSystem.systemId = newSystem.documentId             // Map systemId onto documentId
        OMIT_SYSTEM_FIELDS.forEach(f => delete newSystem[f])  // Delete all redundant fields         
        this.$patch((state) => {
          state.assessmentData.system = this.convertArrayFields(humps(newSystem), true)
        })          
      } else {
        ret = `Failed to retrieve system data for assessment, error ${systemResponse}`
      }
      
      if (recordLoading) {
        this.setDataReady(true)
      }
      console.debug('Returning', ret)
      console.groupEnd()
      return ret
    },
    // Save the system data (standalone method which sets and unsets dataReady)
    async saveSystemData(systemComplete) {

      let ret = true
      let uri = '/systems'
      let action = 'save_system_data'

      this.setDataReady(false)

      console.group('saveSystemData()')
      console.debug('System data complete (i.e. not logging out before submitting data)', systemComplete)

      // Save system info
      const snakes = createHumps(snakeCase)
      if (this.assessmentData.system.systemId != null) {
        // Update existing system data
        const updatedSystem = this.convertArrayFields(Object.assign({}, snakes(this.assessmentData.system)))
        delete updatedSystem.system_id  // Not a valid key for the database (systemId == Strapi's documentId)
        const response = await rootStore().apiCall(`systems/${this.assessmentData.system.systemId}`, 'PUT', { data: updatedSystem })
        if (response.status >= 400) {         
          ret = `Failed to update system data, error ${response.message}`
        }
      } else {
        // Save new system data
        const newSystem = this.convertArrayFields(Object.assign({}, snakes(this.assessmentData.system), {
          institution: { connect: [authenticationStore().orgDocId] },
          assessment: { connect: [this.assessmentData.selection.assessmentId] }
        }), false) 
        delete newSystem.system_id  // Not a valid key for the database
        const response = await rootStore().apiCall('systems', 'POST', { data: newSystem })
        if (response.status < 400) {
          this.$patch((state) => {
            state.assessmentData.system.systemId = response.data.data.documentId
          })                      
        } else {
          ret = `Failed to save system data, error ${response.message}`
        }
      }
                    
      if (ret === true && systemComplete) {
        // User is allowed to log out in the middle of entering system data (i.e. an incomplete/invalid form is potentially saved)
        // Make sure we don't record the system data as completed in this case
        ret = await this.updateAssessmentStatus('System complete')          
      }

      await rootStore().audit(action, uri, ret === true ? 'ok' : ret)

      this.setDataReady(true)
      console.debug('Returning', ret)
      console.groupEnd()
      return ret
    },
    // Update the assessment state to 'newStatus' - can be called standalone (sets/unsets dataReady flag) or as part of another method
    async updateAssessmentStatus(newStatus, recordLoading = false) {

      let ret = true

      console.group('updateAssessmentStatus()')
      console.debug('Attempt to set assessment status to', newStatus, 'current status is', this.assessmentData.assessmentState)
      console.debug('Assessment data currently', this.assessmentData)

      if (recordLoading) {
        this.setDataReady(false)
      }

      if (this.assessmentData.selection.assessmentId != null && !this.onOrPassedAssessmentStage(newStatus)) {
        const updateStatusResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}`, 'PUT', { data: { state: newStatus }})
        if (updateStatusResponse.status < 400) {
          this.$patch((state) => {
            state.assessmentData.assessmentState = newStatus
          })
        } else {
          ret = `Failed to update assessment state to ${newStatus}`
        }        
      }     
      if (recordLoading) {
        this.setDataReady(true)
      }    
      console.debug('Returning', ret)
      console.groupEnd()
      return ret
    },
    // Get all patients of the required type
    async getPatientPool(patientType) {

      let ret = true

      console.group('getPatientPool()')
      console.debug('Get pool of patients of type', patientType)

      const isAdult = patientType != 'Paediatric'
      // NOTE: increase page size here if number of patients ever exceeds 100! 
      const response = await rootStore().apiCall(`patients?filters[is_adult][$eq]=${isAdult}&pagination[pageSize]=100`, 'GET')
      if (response.status < 400) {
        ret = response.data.data
      } else {
        ret = false
      }
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    // Get all scenarios which are required
    async getRequiredScenarioPatientCodes() {

      let ret = true

      console.group('getRequiredScenarios()')
      
      const response = await rootStore().apiCall('scenarios?filters[required][$eq]=true&populate[patients][fields][0]=patient_code', 'GET')
      if (response.status < 400) {
        ret = response.data.data.map(rsc => rsc.patients.patient_code)
      } else {
        ret = false
      }
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    // Retrieve all the relations for a patient with given documentId
    async getPatientDetails(docId, recordLoading = false) {

      let ret = false

      console.group('getPatientDetails()')
      console.debug('Patient doc id', docId)

      if (recordLoading) {
        this.setDataReady(false)
      } 

      const fpdResponse = await rootStore().apiCall(`patients/${docId}?populate=*`, 'GET')
      if (fpdResponse.status < 400) {
        ret = fpdResponse.data.data
      } 
      if (recordLoading) {
        this.setDataReady(true)
      }  
      console.debug('Returned data was', ret)
      console.groupEnd()

      return ret
    },
    async setPatientEntryComplete(patientCode, recordLoading = false) {

      let ret = true

      console.group('setPatientEntryComplete()')
      console.debug('Patient code', patientCode)      

      const enteredCodes = this.assessmentData.completedPatients == '' ? [] : this.assessmentData.completedPatients.split(',')
      if (!enteredCodes.includes(patientCode)) {

        if (recordLoading) {
          this.setDataReady(false)
        } 
        enteredCodes.push(patientCode)
        const enteredResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}`, 'PUT', { data: { completed_patients: enteredCodes.toString() } })
        if (enteredResponse.status < 400) {
          this.$patch((state) => {
            state.assessmentData.completedPatients = enteredCodes.toString()
            state.assessmentData.numCompletedPatients = enteredCodes.length
          })
        } else {
          ret = `Failed to updated completed patients list by adding ${patientCode}`
        }

        if (recordLoading) {
          this.setDataReady(true)
        }
      }
              
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    // Retrieve or build the patient list for an assessment (can be standalone - setting dataReady flag, or used as part of another method)
    async patientListBuild(recordLoading = false) {

      let ret = true

      if (recordLoading) {
        this.setDataReady(false)
      }      

      console.group('patientListBuild()') 
      console.debug('Assessment ID', this.assessmentData.selection.assessmentId)     

      if (this.assessmentData.patients.length == 0 && this.assessmentData.selection.assessmentId != null) {
        // Load patient list, if any
        const patientResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}?populate=patients`, 'GET')
        if (patientResponse.status < 400) {
          // API call ok 
          const patients = patientResponse.data.data.patients
          if (patients.length == 0) {
            // Generate patient list
            const poolRet = await this.getPatientPool(this.assessmentData.patientType)
            if (poolRet !== false) {
              const patientPool = poolRet
              if (patientPool.length < appSettingsStore().assessmentNumPatients) {
                console.warn(`Not enough patients of patient type : ${this.assessmentData.patientType} in database`)
                ret = `There are not enough suitable patients in the database to do a viable assessment for patient type : ${this.assessmentData.patientType}`
              } else {
                // Get those whose scenarios include a required one
                const requiredPatientCodes = await this.getRequiredScenarioPatientCodes()
                if (requiredPatientCodes !== false) {
                  const requiredPatients = patientPool.filter(p => requiredPatientCodes.includes(p.patient_code))
                  const randomPool = patientPool.filter(p => !requiredPatientCodes.includes(p.patient_code))
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
                  const response = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}`, 'PUT', {
                    data: {
                      patients: {
                        connect: this.assessmentData.patients.map(p => p.documentId)
                      }
                    }
                  })
                  if (response.status >= 400) {
                    ret = `Failed to save patient list for assesssment : error was ${response.message}`
                  } 
                } else {
                  ret = 'Failed to retrieve required scenario list'
                }                
              }              
            } else {          
              ret = `Failed to retrieve pool of suitable patients`
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
      if (recordLoading) {
        this.setDataReady(true)
      }      
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    }    
  }
})
