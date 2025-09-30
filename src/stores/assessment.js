import { defineStore } from 'pinia'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import humps from 'lodash-humps'
import createHumps from 'lodash-humps/lib/createHumps'
import { snakeCase } from 'lodash'
import { shuffle, calcPercentage } from '../helpers/utils'
import bsColors from '../assets/scss/variables.scss'
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

// Done as <recorded_response> : { <expected_response1>: <mitigation_result1>, ... }
// Transcription of document posted on Slack eprase2 channel by Becky 18/08/2025
const GOOD_MITIGATION = 'Good mitigation'
const SOME_MITIGATION = 'Some mitigation'
const OVER_MITIGATION = 'Over mitigation'
const NO_MITIGATION = 'No mitigation'
const INVALID_TEST = 'Invalid test'
const MITIGATION_DESCRIPTIONS = [NO_MITIGATION, GOOD_MITIGATION, SOME_MITIGATION, OVER_MITIGATION, INVALID_TEST]
const MITIGATION_MATRIX = {
  'MT2': { // Recorded response : You were able to complete the prescription without any additional user or system input
    'MT2': GOOD_MITIGATION,     // Expected response : No intervention
    'MT1': NO_MITIGATION,       // Expected response : User/system intervention
    'MT3': NO_MITIGATION        // Expected response : Prescribing prevented
  },
  'MT4': { // Recorded response : You were able to complete the prescription, but had to override components of the order sentence
    'MT2': OVER_MITIGATION,     // Expected response : No intervention
    'MT1': GOOD_MITIGATION,     // Expected response : User/system intervention
    'MT3': SOME_MITIGATION      // Expected response : Prescribing prevented
  },
  'MT1': { // Recorded response : You were able to complete the prescription, with system/user intervention
    'MT2': OVER_MITIGATION,     // Expected response : No intervention
    'MT1': SOME_MITIGATION,     // Expected response : User/system intervention
    'MT3': SOME_MITIGATION      // Expected response : Prescribing prevented
  },
  'MT3': { // Recorded response : Prevented from prescribing
    'MT2': OVER_MITIGATION,     // Expected response : No intervention
    'MT1': SOME_MITIGATION,     // Expected response : User/system intervention
    'MT3': GOOD_MITIGATION      // Expected response : Prescribing prevented
  },
  'MT99': { // Recorded response : Medicine or formulary alternative not available in the system
    'MT2': INVALID_TEST,        // Expected response : No intervention
    'MT1': INVALID_TEST,        // Expected response : User/system intervention
    'MT3': INVALID_TEST         // Expected response : Prescribing prevented
  }
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
  configQuestions: [],
  configQuestionResults: []
}

const EMPTY_SELECTION = {
  assessmentId: null,
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
  numCompletedPatients: 0,
  patientScenarios: {},       // The details of the scenarios
  numScenarios: 0,
  storedScenarioResponses: {} // Stored responses  
}

export const assessmentStore = defineStore('assessment', {
  state: () => ({ 
    assessmentData: structuredClone(EMPTY_DATA),
    allPossibleAssessments: [],
    assessmentStates: ASSESSMENT_STATES,  
    mitigations: [],
    categories: [],
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
    // Create a summary of mitigation results from the stored scenario responses
    mitigationSummary() {

      console.group('mitigationSummary()')

      const numCompletedScenarios = this.assessmentData.storedScenarioResponses.length

      const summary = {
        mitigationFrequencyAnalysis: {
          mitigations: MITIGATION_DESCRIPTIONS,
          frequencies: Array(MITIGATION_DESCRIPTIONS.length).fill(0),
          percentages: Array(MITIGATION_DESCRIPTIONS.length).fill(0),
          colors: [bsColors.dangerColor, bsColors.successColor, bsColors.warningColor, bsColors.infoColor, bsColors.invalidColor],
        },        
        goodMitigationByRiskAnalysis: { 
          'Extreme': { total: 0, good: 0 }, 
          'High': { total: 0, good: 0 }, 
          'Medium': { total: 0, good: 0 }, 
          'N/A': { total: 0, good: 0 } 
        },
        systemInterventionAnalysis: {
          total: 0,
          alertOnly: 0,
          advisoryOnly: 0,
          both: 0
        },
        requiredScenarioAnalysis: {},
        mitigationByCategoryAnalysis: {},
        configQuestionAnalysis: []        
      }
      
      if (numCompletedScenarios > 0) {

        // Create the overall mitigation summary for the pie chart report
        for (let i = 0; i < MITIGATION_DESCRIPTIONS.length; i++) {
          summary.mitigationFrequencyAnalysis.frequencies[i] = this.assessmentData.storedScenarioResponses.filter(sr => sr.result == MITIGATION_DESCRIPTIONS[i]).length
          summary.mitigationFrequencyAnalysis.percentages[i] = calcPercentage(summary.mitigationFrequencyAnalysis.frequencies[i], numCompletedScenarios)
        }

        const mitigationTotalsByScenario = {}

        // Create the summary analyses
        this.assessmentData.storedScenarioResponses.forEach(ssr => {

          // Look at scenario risk and look for good mitigation
          const riskLevel = ssr.scenario.risk_level
          console.assert(riskLevel in summary.goodMitigationByRiskAnalysis, 'Unrecognised risk level: ' + riskLevel)
          if (ssr.result == 'Good mitigation') {
            summary.goodMitigationByRiskAnalysis[riskLevel].good++
          }
          summary.goodMitigationByRiskAnalysis[riskLevel].total++

          // Look at system interventions
          if (ssr.intervention_type == 'MT1') {   // NOTE: don't change these codes in Strapi!!!
            // Record prompt
            summary.systemInterventionAnalysis.total++            
            if (ssr.other_category) {
              const hasAlert = ssr.other_category.indexOf('alert') != -1
              const hasAdvisory = ssr.other_category.indexOf('advisory') != -1
              if (hasAlert && hasAdvisory) {
                summary.systemInterventionAnalysis.both++
              } else if (hasAlert) {
                summary.systemInterventionAnalysis.alertOnly++
              } else if (hasAdvisory) {
                summary.systemInterventionAnalysis.advisoryOnly++
              }
            }
          }
          
          // Look at required scenarios
          if (ssr.scenario.required === true) {
            summary.requiredScenarioAnalysis[ssr.scenario.scenario_code] = ssr.result == 'Good mitigation'
          }

          // Compile hash of mitigation totals by scenario code
          if (!( ssr.scenario.scenario_code in mitigationTotalsByScenario )) {
            mitigationTotalsByScenario[ssr.scenario.scenario_code] = { total: 0, good: 0, some: 0, over: 0, not: 0 }
          }
          mitigationTotalsByScenario[ssr.scenario.scenario_code].total++
          switch(ssr.result) {
            case GOOD_MITIGATION: mitigationTotalsByScenario[ssr.scenario.scenario_code].good++; break
            case SOME_MITIGATION: mitigationTotalsByScenario[ssr.scenario.scenario_code].some++; break
            case OVER_MITIGATION: mitigationTotalsByScenario[ssr.scenario.scenario_code].over++; break
            case NO_MITIGATION: mitigationTotalsByScenario[ssr.scenario.scenario_code].not++; break
            default: break
          }
        }) 
        
        console.debug('Mitigation totals by scenario', mitigationTotalsByScenario)
        
        // Construct stacked bar chart data giving mitigation data by category
        // Initialise the hash
        this.categories.forEach(c => {
          summary.mitigationByCategoryAnalysis[c.name] = { total: 0, good: 0, some: 0, over: 0, not: 0 }
        })
        summary.mitigationByCategoryAnalysis['Control'] = { total: 0, good: 0, some: 0, over: 0, not: 0 }
        // Group patient scenarios by category
        for (const [patientCode, scenarios] of Object.entries(this.assessmentData.patientScenarios)) {          
          scenarios.forEach(sc => {
            const scCategory = sc.categories == null ? 'Control' : sc.categories.name
            summary.mitigationByCategoryAnalysis[scCategory].total += mitigationTotalsByScenario[sc.scenario_code].total
            summary.mitigationByCategoryAnalysis[scCategory].good += mitigationTotalsByScenario[sc.scenario_code].good
            if (scCategory == 'Control') {
              // Controls have only good or over mitigation - 
              summary.mitigationByCategoryAnalysis[scCategory].over += mitigationTotalsByScenario[sc.scenario_code].some
              summary.mitigationByCategoryAnalysis[scCategory].over += mitigationTotalsByScenario[sc.scenario_code].over
              summary.mitigationByCategoryAnalysis[scCategory].over += mitigationTotalsByScenario[sc.scenario_code].not
            } else {
              summary.mitigationByCategoryAnalysis[scCategory].some += mitigationTotalsByScenario[sc.scenario_code].some
              summary.mitigationByCategoryAnalysis[scCategory].over += mitigationTotalsByScenario[sc.scenario_code].over
              summary.mitigationByCategoryAnalysis[scCategory].not += mitigationTotalsByScenario[sc.scenario_code].not
            }
            
            if (sc.categories == null) {
              // Need to investigate these...
              console.warn(sc.scenario_code, 'has null category!')
            }                        
          })  
        }
      }

      // Construct config question analysis
      this.assessmentData.config.configQuestionResults.forEach(cqr => {
        summary.configQuestionAnalysis.push({
          actualAnswer: cqr.result == 1 ? 'yes' : 'no',
          goodAnswer: cqr.config_error.good_answer,
          description: cqr.config_error.description,
          desirableResponse: cqr.config_error.good_answer_response,
          undesirableResponse: cqr.config_error.undesirable_answer_response
        })
      })

      console.debug('Returning', summary)
      console.groupEnd()
      return summary
    },
    async getAssessmentsForInstitution() {

      let ret = true

      console.group('getAssessmentsForInstitution()')

      this.setDataReady(false)

      const instCode = authenticationStore().orgCode
      // Note: there are some redundant database calls in this store ('system', 'patients', 'scenarios' and 'config questions' are retrieved separately) - the full call here was once:
      // assessments?filters[hospital][$eq]=${hospital}&populate[institution][filters][institution_code][$eq]=${instCode}&populate=ep_service&populate=system&populate=patients
      // If anyone can enlighten me on the "Invalid Key Error 2" this reliably gives unless one of the 'populate' or 'filter' terms is removed I (David) would be interested
      // Does not seems to matter which term goes, so it may be a Strapi bug or a query that's just too complex...
      const response = await rootStore().apiCall(`assessments?populate[institution][filters][institution_code][$eq]=${instCode}&populate=ep_service`, 'GET')
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
        state.assessmentData = structuredClone(EMPTY_DATA)
        state.allPossibleAssessments = []
        state.mitigations = []
        state.categories = []
        state.dataReady = true
        state.loggingOut = false
      })
      console.debug(this.assessmentData)
      console.groupEnd()
    },
    resetSystemData() {
      this.$patch((state) => {
        state.assessmentData.system = structuredClone(EMPTY_SYSTEM)
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
    async selectAssessment(assessmentId = null) {

      console.group('selectAssessment()')

      let ret = true
      let uri = '/assessments'
      let action = 'select_assessment'
      this.setDataReady(false)

      if (assessmentId == null) {
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
      } else {
        // Continuing existing assessment
        console.assert(assessmentId != null, 'No assessment id supplied!')
        console.debug('Continuing assessment', assessmentId, '=> patch in data')
        uri = `${uri}/${assessmentId}`
        const chosenAssessments = this.allPossibleAssessments.filter(a => a.documentId == assessmentId)
        if (chosenAssessments.length > 0) {
          this.$patch((state) => {
            state.assessmentData = Object.assign(state.assessmentData, {
              assessmentState: chosenAssessments[0].state,
              selection: Object.assign(this.assessmentData.selection, {
                assessmentId: assessmentId,
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
              institution: authenticationStore().orgDocId,
              completedPatients: chosenAssessments[0].completed_patients,
              numCompletedPatients: !chosenAssessments[0].completed_patients ? 0 : chosenAssessments[0].completed_patients.split(',').length
            })
          })
          // Retrieve system data
          ret = await this.getSystemData()
          if (ret === true) {
            // Retrieve patient and scenario data
            ret = await this.patientListBuild()
          } 
          if (ret === true) {
            // Retrieve config question data
            ret = await this.getConfigQuestionData()
          }
        } else {
          ret = `Assessment with id ${assessmentId} not found in list of assessments for this institution`
        }
      } 
      await rootStore().audit(action, uri, ret === true ? 'ok' : ret)

      this.setDataReady(true)

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
      } else if (systemResponse.data.data.system != null) {   // Null here means a logout before visiting the system page
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
    // Get all categories
    async getCategoryDetails(recordLoading = false) {

      let ret = true
      
      console.group('getCategoryDetails()')

      if (!Array.isArray(this.categories) || this.categories.length == 0) {

        if (recordLoading) {
          this.setDataReady(false)
        }
      
        const catResponse = await rootStore().getCategories()
        if (catResponse.status < 400) {
          // 'Control' category filtered out as requested by Steph - 15/09/2025
          this.$patch((state) => {
            state.categories = catResponse.data.data.filter(c => c.name != 'Control')
          })
        } else {
          ret = catResponse
        }

        if (recordLoading) {
          this.setDataReady(true)
        }  
      }              
      console.debug('Returning', ret)
      console.groupEnd()
      return ret
    },
    // Get all mitigations
    async getMitigationDetails(recordLoading = false) {

      let ret = true
      
      console.group('getMitigationDetails()')

      if (!Array.isArray(this.mitigations) || this.mitigations.length == 0) {

        if (recordLoading) {
          this.setDataReady(false)
        }
      
        const mitResponse = await rootStore().getMitigations()
        if (mitResponse.status < 400) {
          this.$patch((state) => {
            state.mitigations = mitResponse.data.data
          })
        } else {
          ret = mitResponse
        }

        if (recordLoading) {
          this.setDataReady(true)
        }  
      }              
      console.debug('Returning', ret)
      console.groupEnd()
      return ret
    },
    // Get all configuration questions
    async getConfigQuestionDetails(recordLoading = false) {

      let ret = true
      
      console.group('getConfigQuestionDetails()')

      if (!Array.isArray(this.assessmentData.config.configQuestions) || this.assessmentData.config.configQuestions.length == 0) {

        if (recordLoading) {
          this.setDataReady(false)
        }
      
        const cfgResponse = await rootStore().getConfigQuestions()
        if (cfgResponse.status < 400) {
          this.$patch((state) => {
            state.assessmentData.config.configQuestions = cfgResponse.data.data
          })
        } else {
          ret = cfgResponse
        }

        if (recordLoading) {
          this.setDataReady(true)
        }  
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
      
      const response = await rootStore().apiCall('scenarios?filters[required][$eq]=true&populate[patients][fields][0]=patient_code&filters[patients][$notNull]=true', 'GET')
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
    // Retrieve all scenarios for an assessment's patients
    async getPatientScenarioData(recordLoading = false) {

      let ret = true

      console.group('getPatientScenarioData()')
      console.assert(this.assessmentData.selection.assessmentId != null, 'No assessment ID present!')
      console.assert(this.assessmentData.patients.length > 0, 'No patient list present!')

      if (recordLoading) {
        this.setDataReady(false)
      } 
      if (Object.keys(this.assessmentData.patientScenarios).length == 0) {

        // Load scenarios for each patient
        let nScenarios = 0
        const patientScenariosByCode = {}
        for (let idx = 0; idx < this.assessmentData.patients.length && ret === true; idx++) {
          const patientCode = this.assessmentData.patients[idx].patient_code
          const sppResponse = await rootStore().apiCall(`scenarios?populate=prescriptions&populate=mitigations&populate=categories&[filters][patients][patient_code][$eq]=${patientCode}`, 'GET')
          if (sppResponse.status < 400) {
            patientScenariosByCode[patientCode] = sppResponse.data.data
            nScenarios += patientScenariosByCode[patientCode].length
          } else {
            ret = `Failed to retrieve scenario data for patient code ${patientCode}`
          }
        }
        if (ret === true) {
          this.$patch((state) => {
            state.assessmentData.patientScenarios = patientScenariosByCode,
            state.assessmentData.numScenarios = nScenarios
          })
        }
      } else {
        console.debug('Patient scenarios already present')
      }
      
      if (recordLoading) {
        this.setDataReady(true)
      }  
      console.debug('Returned data was', ret)
      console.groupEnd()

      return ret
    },
    // Retrieve the actual response to all scenarios in current assessment
    async getPatientScenarioResponses(recordLoading = false) {

      let ret = true

      console.group('getPatientScenarioResponse()')

      if (recordLoading) {
        this.setDataReady(false)
      }      
      // This will be executed always, regardless of what is stored currently in assessmentData.storedScenarioResponses
      const allScenariosResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}?populate[scenario_data][populate][0]=scenario`, 'GET')      
      if (allScenariosResponse.status < 400) {        
        this.$patch((state) => {
          state.assessmentData.storedScenarioResponses = allScenariosResponse.data.data.scenario_data
        })
      } else {
        ret = 'Failed to retrieve saved scenario responses'
      }

      if (recordLoading) {
        this.setDataReady(true)
      }                  
      console.groupEnd()      

      return ret
    },
    async savePatientScenarioResponse(patient, scenario, formData, recordLoading = false) {

      let ret = true

      console.group('savePatientScenarioResponse()')
      console.debug('Patient', patient, 'scenario', scenario, 'form data', formData)

      if (recordLoading) {
        this.setDataReady(false)
      } 

      // Form data will be of form { interventionType: MT<code>, alert<category>: <true|false>, advisory<category: <true|false>, qualitativeData: <text>, haveDiscontinuedPrescription: <true|false> }
      // Massage it into db form:
      // { intervention_type: MT<code>, result: <calculated>, other_category: <category_code1>:alert[,advisory]|<category_code2>:alert[,advisory], qualitative_data: <text> }
      const dataOut = {
        intervention_type: formData.interventionType,
        result: '',
        result_score: 0,  // Not sure whether this is required any more?
        other_category: '',
        qualitative_data: formData.qualitativeData
      }

      if (formData.interventionType == 'MT1') {
        // System intervention, so look at alerts and advisories
        console.debug('System or user intervention - process alerts and advisories')
        const interventionsByCategoryCode = {}
        for (const [formKey, formValue] of Object.entries(formData)) {
          if (formValue === true && formKey != 'haveDiscontinuedPrescription') {            
            let isAlert = formKey.startsWith('alert')
            let catCode = formKey.replace(isAlert ? 'alert' : 'advisory', '')
            if (!( catCode in interventionsByCategoryCode )) {
              interventionsByCategoryCode[catCode] = []
            }
            interventionsByCategoryCode[catCode].push(isAlert ? 'alert' : 'advisory')
          }          
        }
        // Only two categories are allowed - any further ticked ones are ignored completely...
        const recordedCategories = Object.keys(interventionsByCategoryCode)
        console.assert(recordedCategories.length > 0, 'Should have at least 1 category alert / advisory boxes ticked')
        let prompts = []
        for (let i = 0; i < Math.min(recordedCategories.length, 2); i++) {
          prompts.push(recordedCategories[i] + ':' + interventionsByCategoryCode[recordedCategories[i]].toString())
        }          
        dataOut['other_category'] = prompts.join('|') 
        // Scream about this before Postgres does... 
        console.assert(dataOut['other_category'].length < 255, '>' + dataOut['other_category'] + '< will not fit in a short text field!!') 
        console.debug('Alert / advisory record by category', interventionsByCategoryCode)       
      }

      // Next, calculate mitigation (field 'result')
      const expectedResponse = scenario.mitigations.mitigation_code
      dataOut['result'] = MITIGATION_MATRIX[formData.interventionType][expectedResponse]

      // Connect the scenario and mitigation
      dataOut['scenario'] = { connect: [scenario.documentId] }
      dataOut['mitigation'] = { connect: [this.mitigations.filter(m => m.mitigation_code == formData.interventionType)[0].documentId] }

      const saveScenarioDataResponse = await rootStore().apiCall('scenario-data', 'POST', { data: dataOut })
      if (saveScenarioDataResponse.status < 400) {
        const scenarioDataRecord = saveScenarioDataResponse.data.data
        // Write new scenario data record into the assessment
        const updateAssessmentResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}`, 'PUT', { data: {
          scenario_data: { connect: [scenarioDataRecord.documentId] }
        }})
        if (updateAssessmentResponse.status < 400) {
          this.$patch((state) => {
            state.assessmentData.storedScenarioResponses[scenario.scenario_code] = scenarioDataRecord
          }) 
        } else {
          ret = `Failed to update assessment with new scenario response data, error ${updateAssessmentResponse.message}`
        }
                              
      } else {
        ret = `Failed to save scenario response, error ${saveScenarioDataResponse.message}`
      }

      if (recordLoading) {
        this.setDataReady(true)
      }

      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },    
    // Get user responses to configuration questions
    async getConfigQuestionData(recordLoading = false)  {

      let ret = true

      if (recordLoading) {
        this.setDataReady(false)
      }

      console.group('getConfigQuestionData()')
      console.assert(this.assessmentData.selection.assessmentId != null, 'No assessment ID present!')

      const confQuestionResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}?populate[config_error_data][populate][0]=config_error`, 'GET')
      if (confQuestionResponse.status < 400) {
        this.$patch((state) => {
          state.assessmentData.config.configQuestionResults = confQuestionResponse.data.data.config_error_data
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
    // Save new config error responses
    async saveConfigQuestionData(cqData, recordLoading = false) {

      let ret = true

      if (recordLoading) {
        this.setDataReady(false)
      }

      console.group('saveConfigQuestionData()')
      console.debug('Responses to config questions are', cqData.config)
      console.debug('Config questions', this.assessmentData.config.configQuestions)

      // cqData looks like { config: { "C001": true, "C002": false, "C003": true } }   
      let newConfResponseDocIds = []   
      for (const [cfgCode, cfgResponse] of Object.entries(cqData.config)) {
        console.debug('About to save', cfgCode, 'response', cfgResponse)
        console.debug('Filter', this.assessmentData.config.configQuestions.filter(cfgq => cfgq.config_error_code == cfgCode))
        let dataOut = {
          config_error_code: cfgCode,
          result: cfgResponse === true ? 1 : 0,
          config_error: {
            connect: [this.assessmentData.config.configQuestions.filter(cfgq => cfgq.config_error_code == cfgCode)[0].documentId]
          }
        }        
        const savedCfgResponse = await rootStore().apiCall('config-error-data', 'POST', { data: dataOut })
        if (savedCfgResponse.status >= 400)  {
          throw new Error(`Failed to save config question response - message was ${savedCfgResponse.message}`)
        } else {
          newConfResponseDocIds.push(savedCfgResponse.data.data.documentId)
        }
      }
      // Write each new config question response into assessment
      const updatedAssessmentResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}`, 'PUT', { data: {
        config_error_data: { connect: newConfResponseDocIds }
      }})
      if (updatedAssessmentResponse.status >= 400) {
        throw new Error(`Failed to update assessment with config question response - message was ${updatedAssessmentResponse.message}`)
      }

      if (recordLoading) {
        this.setDataReady(true)
      }
      console.debug('Returning', ret)
      console.groupEnd()
      return ret
    },
    async setPatientEntryComplete(patientCode, recordLoading = false) {

      let ret = true

      console.group('setPatientEntryComplete()')
      console.debug('Patient code', patientCode)      

      const enteredCodes = !this.assessmentData.completedPatients ? [] : this.assessmentData.completedPatients.split(',')
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
          ret = `Failed to update completed patients list by adding ${patientCode}`
        }

        if (recordLoading) {
          this.setDataReady(true)
        }
      }
              
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    // Retrieve or build the patient / scenario list for an assessment (can be standalone - setting dataReady flag, or used as part of another method)
    async patientListBuild(recordLoading = false) {

      let ret = true

      if (recordLoading) {
        this.setDataReady(false)
      }      

      console.group('patientListBuild()') 
      console.debug('Assessment ID', this.assessmentData.selection.assessmentId)     

      // Get patient list
      if (this.assessmentData.patients.length == 0 && this.assessmentData.selection.assessmentId != null) {
        // Load patient list, if any
        const patientResponse = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}?populate=patients`, 'GET')
        if (patientResponse.status < 400) {
          // API call ok 
          const patients = patientResponse.data.data.patients
          if (patients.length == 0) {
            // Generate patient list
            const poolRet = await this.getPatientPool(this.assessmentData.selection.patientType)
            if (poolRet !== false) {
              const patientPool = poolRet
              if (patientPool.length < appSettingsStore().assessmentNumPatients) {
                console.warn(`Not enough patients of patient type : ${this.assessmentData.selection.patientType} in database`)
                ret = `There are not enough suitable patients in the database to do a viable assessment for patient type : ${this.assessmentData.selection.patientType}`
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
                } else {
                  ret = 'Failed to retrieve required patient list'
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
      } else {
        console.debug('Patient list already retrieved')
      }

      // Ensure scenario details present for each patient
      if (ret === true && Object.keys(this.assessmentData.patientScenarios).length == 0) {
        ret = await this.getPatientScenarioData()
        if (ret === true) {
          // Save to assessment patient / scenario lists
          // First get scenario document ids
          const scenarioDocIds = []
          for (const [patientCode, scenarios] of Object.entries(this.assessmentData.patientScenarios)) {
            scenarioDocIds.push(...scenarios.map(s => s.documentId))
          }
          const response = await rootStore().apiCall(`assessments/${this.assessmentData.selection.assessmentId}`, 'PUT', {
            data: {
              patients: {
                connect: this.assessmentData.patients.map(p => p.documentId)
              },
              scenarios: {
                connect: scenarioDocIds
              }
            }
          })
          if (response.status >= 400) {
            ret = `Failed to save patient list for assesssment : error was ${response.message}`
          } 
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
