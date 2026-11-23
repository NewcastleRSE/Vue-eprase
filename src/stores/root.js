import { authenticationStore } from './authentication'
import { defineStore } from 'pinia'
import { apiUrl } from '../helpers/utils'
import axios from 'axios'

const SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

export const rootStore = defineStore('root', {
  state: () => ({    
    printableReportData: {
      heading: '',
      buttonCaption: '',
      content: '',
      archived: false
    }
  }),
  persist: {
    storage: localStorage
  }, 
  actions: {
  
    async publicApiGet(url) {

      console.group('publicApiGet()')
      // Added to help debug problems with paths when transferring to staging server
      console.warn(process.env)

      let response = null, ret = {}
      try {
        response = await axios.get(apiUrl() + url, { responseType: 'json' })        
        ret = { status: response.status, data: response.data}
      } catch(err) {
        ret = authenticationStore().triageError(err)
      }
      console.debug('API GET', url, 'response is', ret)
      console.groupEnd()

      return ret
    },
    async apiCall(url, method = 'POST', body = null, responseType = 'json') {

      console.group('apiCall()')
      // Added to help debug problems with paths when transferring to staging server
      console.warn(process.env)

      if (!(SUPPORTED_METHODS.includes(method.toUpperCase()))) {
        throw new Error(`API call using ${method} not implemented`)
      }

      let response = null, ret = {}      
      const auth = authenticationStore()
      const config = auth.token ? { headers: { Authorization: `Bearer ${auth.token}` }, responseType: responseType } : {}
      
      try {
        const fullUrl = apiUrl() + url
        if (method == 'GET') {
          console.debug('GET url', fullUrl, 'config', config)
          response = await axios.get(fullUrl, config)
        } else if (method == 'POST') {
          console.debug('POST url', fullUrl, 'config', config, 'body', body)
          response = await axios.post(fullUrl, body, config)
        } else if (method == 'PUT') {
          console.debug('PUT url', fullUrl, 'config', config, 'body', body)
          response = await axios.put(fullUrl, body, config)
        } else if (method == 'DELETE') {
          console.debug('DELETE url', fullUrl, 'config', config, 'body', body)
          response = await axios.delete(fullUrl, body, config)
        }
        ret = { status: response.status, data: response.data}
      } catch(err) {
        ret = auth.triageError(err)
      }

      console.debug('API response is', ret)
      console.groupEnd()

      return ret
    },     
    // Check tool open by doing a bare-bones API call and seeing if we get a 403 response
    async toolOpen() {      
      const response = await this.publicApiGet('institutions?pagination[limit]=1')
      return response.status != 403
    },
    // Get list of institutions
    async getInstitutions() {
      const response = await this.publicApiGet('institutions?fields[0]=institution_code&fields[1]=name&fields[2]=hospitals&pagination[pageSize]=500&sort[0]=name:asc')
      return response
    },
    // Get institution details
    async getInstitutionDetails(id) {
      const response = await this.apiCall(`institutions/${id}`, 'GET')
      return response
    },
    // Get list of ePrescribing system names
    async getEpSystems() {
      const response = await this.apiCall('ep-services?fields[0]=name&sort[0]=name:asc', 'GET')
      return response
    },
    // Get list of high risk meds
    async getHighRiskMeds() {
      const response = await this.apiCall('high-risk-meds?fields[0]=label&fields[1]=value&pagination[pageSize]=100', 'GET')
      return response
    },
    // Get list of clinical areas
    async getClinicalAreas() {
      const response = await this.apiCall('clinical-areas?fields[0]=label&fields[1]=value&pagination[pageSize]=100', 'GET')
      return response
    },    
    // Get mitigation code mapping
    async getMitigations() {
      const response = await this.apiCall('mitigations', 'GET')
      return response
    },
    // Categories
    async getCategories() {
      const response = await this.apiCall('categories?fields[0]=category_code&fields[1]=name&fields[2]=description&sort[0]=name', 'GET')
      return response     
    },
    // Overall progress report for dashboard
    async progressReport() {
      const progressResponse = await this.apiCall('assessment-progress-report', 'GET') 
      return progressResponse
    },  
    // Dummy methods to enable auditing of system and validation errors
    systemError(message) {
      console.debug('systemError()', message)
      return { status: 500, message: message }
    },
    validationError(stepId, contextId, message) {
      console.debug('validationError()', stepId, contextId, message)
      return { status: 500, message: message}
    },
    // Final report in a print-friendly form
    storePrintableReportData(heading, content, buttonCaption, archived) {
      this.printableReportData = { heading, content, buttonCaption, archived }
    }
  }
})
