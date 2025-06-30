import { stringTrueFalseToBoolean } from '../helpers/utils'
import { authenticationStore } from './authentication'
import { defineStore } from 'pinia'
import axios from 'axios'

const API = process.env.BASE_URL
const SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

export const rootStore = defineStore('root', {
  state: () => ({
    assessmentId: null,
    assessmentStatus: null,
    assessmentComplete: false,    
    part1complete: false,
    part2complete: false,
    part3complete: false,
    part4complete: false,
    configErrorComplete: false,
    categories: [],
    mitigationData: [],
    stackedChartData: null,
    mitigationChartData: null,
    printableReportData: null
  }),
  persist: true, 
  actions: {
  
    async apiCall(url, method = 'POST', body = null) {

      console.group('apiCall()')
      // Added to help debug problems with paths when transferring to staging server
      console.warn(process.env)

      if (!(SUPPORTED_METHODS.includes(method.toUpperCase()))) {
        throw new Error(`API call using ${method} not implemented`)
      }

      let response = null, ret = {}
      const auth = authenticationStore()
      const config = auth.token ? { headers: { Authorization: `Bearer ${auth.token}` } } : {}

      try {
        if (method == 'GET') {
          console.debug('GET url', API + url, 'config', config)
          response = await axios.get(API + url, config)
        } else if (method == 'POST') {
          console.debug('POST url', API + url, 'config', config, 'body', body)
          response = await axios.post(API + url, body, config)
        } else if (method == 'PUT') {
          console.debug('PUT url', API + url, 'config', config, 'body', body)
          response = await axios.put(API + url, body, config)
        } else if (method == 'DELETE') {
          console.debug('DELETE url', API + url, 'config', config, 'body', body)
          response = await axios.delete(API + url, body, config)
        }
        ret = { status: response.status, data: response.data}
      } catch(err) {
        ret = auth.triageError(err)
      }

      console.debug('API call response is', ret)
      console.groupEnd()

      return ret
    },    
    // Get list of institutions (UPDATED Strapi)
    async getInstitutions() {
      const response = await this.apiCall('institutions?fields[0]=institution_code&fields[1]=name&fields[2]=hospitals&pagination[pageSize]=500&sort[0]=name:asc', 'GET')
      return response
    },
    // Get list of ePrescribing system names (UPDATED Strapi)
    async getEpSystems() {
      const response = await this.apiCall('ep-services?fields[0]=name&sort[0]=name:asc', 'GET')
      return response
    },
    // Get list of high risk meds (UPDATED Strapi)
    async getHighRiskMeds() {
      const response = await this.apiCall('high-risk-meds?fields[0]=label&fields[1]=value', 'GET')
      return response
    },
    // Get list of clinical areas (UPDATED Strapi)
    async getClinicalAreas() {
      const response = await this.apiCall('clinical-areas?fields[0]=label&fields[1]=value', 'GET')
      return response
    },
    // Get all patients of the required type (UPDATED Strapi)
    async getPatientPool(patientType) {
      const isAdult = patientType != 'Paediatric' 
      const response = await this.apiCall(`patients?filters[is_adult][$eq]=${isAdult}&populate=scenarios`)
      return response
    },
    // Audit action (UPDATED Strapi)
    async audit(action, uri, result) {
      const response = await this.apiCall('audits', 'POST', { data: { action, uri, result } })
      if (response.status >= 400) {
        // Failure to audit should not bomb the operation as user should not be aware of housekeeping behind the scenes...
        console.error(response.message)
      }
    },   
    async getCategories() {
      if (this.categories.length == 0) {
        const response = await this.apiCall('categories', 'GET')
        if (response.status < 400) {
          this.categories = response.data
          // Removed 04/10/2024 David - this attempted to suppress the 'control' category in the scenario input, but had undesired side-effects
          // remove the control category, leaves an empty element
          //delete this.categories[0]
          // remove the emtpy element 
          //this.categories.splice(0, 1)
        }
        return response
      } else {
        return { status: 200, data: this.categories }
      }      
    },
    async getPrescriptionTestData(id) {
      const response = await this.apiCall('resultCategories?ID=' + id, 'GET')
      return response            
    },
    async getMitigationResults(id) {
      const response = await this.apiCall('getMitigationResults?ID=' + id, 'GET')
      return response                
    },
    async getAllMitigationResults() {
      const response = await this.apiCall('getAllMitigationResults', 'GET')
      return response       
    },
    async getAllInstitutionAssessments() {
      const response = await this.apiCall('getAllInstitutionAssessments', 'GET')
      return response
    },
    async getConfigErrors() {
      const response = await this.apiCall('configerrors', 'GET')
      return response      
    },
    async getConfigErrorByCode(code){
      const response = await this.apiCall('configerrorbycode?CODE=' + code, 'GET')
      return response     
    },
    async getAssessmentProgress() {
      let ret = null
      const instId = authenticationStore().institutionId
      const response1 = await this.apiCall('getAssessmentStatus?INSTITUTION_ID=' + instId, 'GET') 
      const response2 = await this.apiCall('getAssessmentLatestCompletedPart?INSTITUTION_ID=' + instId, 'GET')
      if (response1.status < 400 && response2.status < 400) {
          this.assessmentId = response1.data ? response1.data.id : -1,
          // Sigh - the return from the API is a string "true" or "false"...
          this.assessmentComplete = response1.data ? stringTrueFalseToBoolean(response1.data.status) : false,
          this.assessmentStatus = response2.data ? response2.data.status : 'Not Started'
          const data = {}
          const reqKeys = ['assessmentId', 'assessmentComplete', 'assessmentStatus']
          reqKeys.forEach(k => data[k] = this[k])         
        ret = { status: 200, data: data }
      } else {
        ret = { status: 500, message: 'Failed to get assessment progress for institution', instId}
      }
      return ret   
    },
    async updateAssessmentProgress() {
      const instId = authenticationStore().institutionId
      const response = await this.apiCall('updateInstitutionAssessment?INSTITUTION_ID=' + instId, 'POST') 
      return response      
    },
    async getAssessmentLatestCompletedPart() {
      const response = await this.apiCall('getAssessmentLatestCompletedPart?INSTITUTION_ID=' + authenticationStore().institutionId, 'GET')
      if (response.status < 400) {
        // This call returns no data if no assessment is open for institution
        this.assessmentStatus = response.data ? response.data.status : 'Not Started'
      }
      return response           
    },
    async getReportByInstitutionId() {
      const response = await this.apiCall('resultByInstitutionId?ID=' + authenticationStore().institutionId, 'GET')
      return response          
    },
    async getAssessmentIdByInstitutionId(institution_id) {
      const response = await this.apiCall('assessmentIdByInstitutionId?ID=' + institution_id, 'GET')
      return response
    },
    async getAllReports() {
      const response = await this.apiCall('results', 'GET')
      return response        
    },
    async saveSystemData(ep_service, ep_service_implemented, ep_service_updated, other_ep_system, local_ep_system_name, ep_version, ep_usage, num_maintainers, 
      add_ep_system, patient_type, lab_results, man_results, diagnosis_results, penicillin_description, penicillin_description_other, penicillin_results, penicillin_comment, 
      med_history, high_risk_meds, clinical_areas, time_taken) {
      const response = await this.apiCall('system', 'POST', { 
        ep_service, ep_service_implemented, ep_service_updated, other_ep_system, local_ep_system_name, ep_version, ep_usage, num_maintainers, add_ep_system, patient_type, lab_results, 
        man_results, diagnosis_results, penicillin_description, penicillin_description_other, penicillin_results, penicillin_comment, 
        med_history, high_risk_meds, clinical_areas, time_taken 
      })
      if (response.status < 400) {
        const assessmentId = JSON.stringify(response.data)
        console.debug('Assessment ID', assessmentId)
        this.assessmentId = assessmentId
        this.part1complete = true
      }
      return(response)
    },    
    async saveConfigError(test_id, result, time_taken, index) {
      const assessmentId = await this.getAssessmentId()
      const response = await this.apiCall('config?ID=' + assessmentId, 'POST', { test_id, result, time_taken })   
      if (response.status < 400) {
        this.configErrorComplete = true
        this.testIndex = index + 1
      }
      return(response)   
    },
    async saveMitigationResults(assessmentId, epSystem, goodMitigation, someMitigation, notMitigated, overMitigated, invalidTests) {
      const institutionId = authenticationStore().institutionId
      const response = await this.apiCall('saveMitigationResults?ID=' + assessmentId + '&INSTITUTION_ID='  + institutionId, 'POST', { epSystem, goodMitigation, someMitigation, notMitigated, overMitigated, invalidTests })   
      if (response.status < 400) {
        this.storeMitigationData(goodMitigation, someMitigation, notMitigated, overMitigated, invalidTests)
      }
      return(response)
    },     
    storeAssessmentId(id) { this.assessmentId = id },
    storeAssessmentStatus(status) { this.assessmentStatus = status },
    storeAssessmentComplete(complete) { this.assessmentComplete = complete },    
    storeMitigationData(goodPercentage, somePercentage, notPercentage, overPercentage, percentageNulls) {
      this.mitigationData[0] = goodPercentage
      this.mitigationData[1] = somePercentage
      this.mitigationData[2] = notPercentage
      this.mitigationData[3] = overPercentage
      this.mitigationData[4] = percentageNulls
    },
    storeStackedChartData(stackedChartData) { this.stackedChartData = stackedChartData },
    storeMitigationChartData(mitigationChartData) { this.mitigationChartData = mitigationChartData },
    storePrintableReportData(heading, content, buttonCaption) {
      console.log(heading, content, buttonCaption)
      this.printableReportData = { heading, content, buttonCaption }
    }
  }
})
