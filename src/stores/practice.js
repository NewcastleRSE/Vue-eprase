import { defineStore } from 'pinia'
import { sampleSize } from 'lodash'
import { MITIGATION_MATRIX } from '../helpers/common'
import { assessmentStore } from './assessment'
import { rootStore } from './root'

export const practiceStore = defineStore('practice', {
  state: () => ({
    dataReady: false,
    patients: [],               // List of patients   
    patientScenarios: {},       // Details of patient scenarios
    scenarioPatientLink: {},    // Hash of scenarios per patient
    scenarioUserResponses: {},  // User responses to the scenarios
    numScenarios: 0,
    categories: [],
    mitigations: []
  }),
  persist: {
    storage: localStorage
  },
  actions: {
    setDataReady(readyStatus) {
      this.$patch((state) => { state.dataReady = readyStatus })
    },
    reset() {
      console.group('reset() on practice store')
      this.$patch((state) => {
        state.patients = []
        state.patientScenarios = {}
        state.scenarioResponses = {}
        state.numScenarios = 0
        state.dataReady = true
      })
      console.debug(this.assessmentData)
      console.groupEnd()
    },
    // Retrieve or build the patient / scenario list for the practice
    async patientListBuild(noPatients = 1, patientCodes = [], patientType = 'Adult', recordLoading = false) {

      let ret = true

      if (recordLoading) {
        this.setDataReady(false)
      }      

      console.group('patientListBuild()') 

      if (this.patients.length == 0) {        
        // Generate patient list
        const poolRet = await assessmentStore().getPatientPool(patientType)
        if (poolRet !== false) {
          const patientPool = poolRet
          if (patientPool.length < noPatients) {
            console.warn(`Not enough patients of patient type : ${patientType} in database`)
            ret = {status: 400, message: `There are not enough suitable patients in the database to do a practice run for patient type : ${patientType}`}
          } else {
            if (!Array.isArray(patientCodes) || patientCodes.length == 0) {
              // Choose 'noPatients' patient records randomly
              this.$patch((state) => { state.patients = sampleSize(patientPool, noPatients) })
            } else {
              // Filter the patient pool by the received codes
              this.$patch((state) => { state.patients = patientPool.filter(p => patientCodes.includes(p.patient_code)) })
            }
          }
        } else {
          ret = {status: 400, message: 'Failed to retrieve pool of suitable patients'}
        }  
      } else {
        console.debug('Patient list already retrieved')
      }

      // Ensure scenario details present for each patient
      if (ret === true && Object.keys(this.patientScenarios).length == 0) {
        ret = await this.getPatientScenarioData(recordLoading)       
        if (ret === true) {
          // Do linkage of scenarios with patients
          const linkTable = {}
          for (const [patientCode, scenarios] of Object.entries(this.patientScenarios)) {
            scenarios.forEach(s => { linkTable[s.scenario_code] = patientCode })      
          }
          this.$patch((state) => { state.scenarioPatientLink = linkTable })
        }
      }      

      if (recordLoading) {
        this.setDataReady(true)
      }      
      console.debug('Returning', ret)
      console.groupEnd()

      return ret
    },
    // Retrieve all scenarios for an assessment's patients
    async getPatientScenarioData(recordLoading = false) {

      let ret = true

      console.group('getPatientScenarioData()')
      console.assert(this.patients.length > 0, 'No patient list present!')

      if (recordLoading) {
        this.setDataReady(false)
      } 
      if (Object.keys(this.patientScenarios).length == 0) {

        // Load scenarios for each patient
        let nScenarios = 0
        const patientScenariosByCode = {}
        for (let idx = 0; idx < this.patients.length && ret === true; idx++) {
          const patientCode = this.patients[idx].patient_code
          const sppResponse = await rootStore().apiCall(`scenarios?populate=prescriptions&populate=mitigations&populate=categories&[filters][patients][patient_code][$eq]=${patientCode}`, 'GET')
          if (sppResponse.status < 400) {
            patientScenariosByCode[patientCode] = sppResponse.data.data
            nScenarios += patientScenariosByCode[patientCode].length
          } else {
            ret = {status: sppResponse.status, message: `Failed to retrieve scenario data for patient code ${patientCode}`}
          }
        }
        if (ret === true) {
          this.$patch((state) => {
            state.patientScenarios = patientScenariosByCode,
            state.numScenarios = nScenarios
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
    // Retrieve all the relations for a patient with given documentId
    async getPatientDetails(docId, recordLoading = false) {
      let ret = await assessmentStore().getPatientDetails(docId, recordLoading)      
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
    savePatientScenarioResponse(patient, scenario, formData) {
    
      console.group('savePatientScenarioResponse()')
      console.debug('Patient', patient, 'scenario', scenario, 'form data', formData)

      // Form data will be of form { interventionType: MT<code>, alert<category>: <true|false>, advisory<category: <true|false>, qualitativeData: <text>, haveDiscontinuedPrescription: <true|false> }
      // Massage it into db form:
      // { intervention_type: MT<code>, result: <calculated>, other_category: <category_code1>:alert[,advisory]|<category_code2>:alert[,advisory], qualitative_data: <text> }
      const dataOut = {
        intervention_type: formData.interventionType,
        result: '',
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

      this.$patch((state) => { state.scenarioUserResponses[scenario.scenario_code] = dataOut })

      console.groupEnd()
    }
  }
})
