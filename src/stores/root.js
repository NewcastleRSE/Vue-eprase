import { authenticationStore } from './authentication'
import { defineStore } from 'pinia'
import axios from 'axios'

const API = process.env.BASE_URL

export const rootStore = defineStore('root', {
  state: () => ({
    assessmentId: null,
    assessmentStatus: null,
    assessmentComplete: null,    
    part1complete: null,
    part2complete: null,
    part3complete: null,
    part4complete: null,
    configErrorComplete: null,
    mitigationData: [],
    stackedChartData: null,
    mitigationChartData: null
  }),
  persist: true,
  getters: {   
    getAssessmentId: (state) => state.assessmentId, //TODO properly save this and retrieve from backend
    getAssessmentComplete: (state) => state.assessmentComplete,
    getPart1complete: (state) => state.part1complete,
    getPart2complete: (state) => state.part2complete,
    getPart3complete: (state) => state.part3complete,
    getPart4complete: (state) => state.part4complete,
    getConfigErrorComplete: (state) => state.configErrorComplete,
    getMitigationData: (state) => state.mitigationData,
    getStackedChartData: (state) => state.stackedChartData,
    getMitigationChartData: (state) => state.mitigationChartData
  },
  actions: {
    setAssessmentId(id) { this.assessmentId = id },
    setAssessmentStatus(status) { this.assessmentStatus = status },
    setAssessmentComplete(complete) { this.assessmentComplete = complete },
    setPart1complete(part1Complete) { this.part1Complete = part1Complete },
    setPart2complete(part2Complete) { this.part2Complete = part2Complete },
    setPart3complete(part3Complete) { this.part3Complete = part3Complete },
    setPart4complete(part4Complete) { this.part4Complete = part4Complete },
    setConfigErrorComplete(ceComplete) { this.configErrorComplete = ceComplete },
    setMitigationData(md) { this.mitigationData = md },
    setStackedChartData(sdd) { this.stackedChartData = sdd },
    setMitigationChartData(mcd) { this.mitigationChartData = mcd },

    async apiCall(url, method = 'POST', body = null) {

      console.group('apiCall()')

      if (!(method == 'GET' || method == 'POST')) {
        throw new Error(`API call using ${method} not implemented`)
      }

      let response = null, ret = {}
      const auth = authenticationStore()
      const config = { headers: { Authorization: `Bearer ${auth.token}` } }

      try {
        if (method == 'GET') {
          console.debug('GET url', API + url, 'config', config)
          response = await axios.get(API + url, config)
        } else if (method == 'POST') {
          console.debug('POST url', API + url, 'config', config, 'body', body)
          response = await axios.post(API + url, body, config)
        }
        ret = { status: response.status, data: response.data}
      } catch(err) {
        ret = auth.triageError(err)
      }

      console.debug('API call response is', ret)
      console.groupEnd()

      return ret
    },
    async getAssessmentById(assessment_id) {
      const response = await this.apiCall('resultByAssessmentId?ID=' + assessment_id, 'GET')
      return response
    },
    async getInstitutions() {
      const response = await this.apiCall('auth/institutions', 'GET')
      return response
    },
    async getCategories() {
      const response = await this.apiCall('categories', 'GET')
      return response      
    },
    async getPrescriptionTestData(id) {
      const response = await this.apiCall('resultCategories?ID=' + id, 'GET')
      return response            
    },
    async getMitigationResults(id) {
      const response = await this.apiCall('getMitigationResults?ID=' + id + id, 'GET')
      return response                
    },
    async getAllMitigationResults() {
      const response = await this.apiCall('getAllMitigationResults' + id, 'GET')
      return response       
    },
    async getConfigErrors() {
      const response = await this.apiCall('configerrors' + id, 'GET')
      return response      
    },
    async getConfigErrorByCode(code){
      const response = await this.apiCall('configerrorbycode?CODE=' + code, 'GET')
      return response     
    },
    async getAssessmentStatus(institution_id) {
      const insId = institution_id || authenticationStore().institutionId;
      const response = await this.apiCall('getAssessmentStatus?INSTITUTION_ID=' + insId, 'GET')
      if (response.status < 400) {
        this.assessmentComplete = (response.data && response.data.assessmentComplete) || false
        this.assessmentId = (response.data && response.data.assessment_id) || 0
      }      
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
      const response = await this.apiCall('results' + code, 'GET')
      return response        
    },
    async saveSystemData(ep_service, other_ep_system, ep_version, ep_usage, add_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken) {
      const response = await this.apiCall('system', 'POST', { ep_service, other_ep_system, ep_version, ep_usage, add_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken })
      if (response.status < 400) {
        const assessmentId = JSON.stringify(response.data)
        console.debug('Assessment ID', assessmentId, '*** TODO - need to save in backend')
        //TODO - save this in backend, not localStorage
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
    async saveMitigationResults(assessmentId, epSystem, goodMitigation, someMitigation, notMitigated, overMitigated, invalidTests){
      const institutionId = authenticationStore().institutionId
      const response = await this.apiCall('saveMitigationResults?ID=' + assessmentId + '&INSTITUTION_ID='  + institutionId, 'POST', { epSystem, goodMitigation, someMitigation, notMitigated, overMitigated, invalidTests })   
      if (response.status < 400) {
        this.storeMitigationData(goodPercentage, somePercentage, notPercentage, overPercentage, percentageNulls)
      }
      return(response)
    },
    async audit(action, uri) {
      const response = await this.apiCall('audit', 'POST', { action, uri })
      if (response.status >= 400) {
        console.error(response.message)
      }
    },
    async failedLoginAudit(action, uri) {
      const response = await this.apiCall('failedLoginAudit', 'POST', { action, uri })
      if (response.status >= 400) {
        console.error(response.message)
      }
    },
    setPatientList(patientList) {
      this.patientList = patientList
    },
    setTestList(testList) {
      this.testList = testList
    },                
    storeMitigationData(goodPercentage, somePercentage, notPercentage, overPercentage, percentageNulls) {
      this.mitigationData[0] = goodPercentage
      this.mitigationData[1] = somePercentage
      this.mitigationData[2] = notPercentage
      this.mitigationData[3] = overPercentage
      this.mitigationData[4] = percentageNulls
    },
    storeStackedChartData(stackedChartData) {
      this.stackedChartData = stackedChartData
    },
    storeMitigationChartData(mitigationChartData) {
      this.mitigationChartData = mitigationChartData
    }
  }
})
