import { authenticationStore } from './authentication'
import { defineStore } from 'pinia'
import axios from 'axios'

const API = process.env.BASE_URL
const SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

export const rootStore = defineStore('root', {
  state: () => ({    
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
      const response = await this.apiCall('high-risk-meds?fields[0]=label&fields[1]=value&pagination[pageSize]=100', 'GET')
      return response
    },
    // Get list of clinical areas (UPDATED Strapi)
    async getClinicalAreas() {
      const response = await this.apiCall('clinical-areas?fields[0]=label&fields[1]=value&pagination[pageSize]=100', 'GET')
      return response
    },
    // Get list of configuration questions (UPDATED Strapi)
    async getConfigQuestions() {
      const response = await this.apiCall('config-errors?sort[0]=config_error_code', 'GET')
      return response
    },
    // Get mitigation code mapping (UPDATED Strapi)
    async getMitigations() {
      const response = await this.apiCall('mitigations', 'GET')
      return response
    },
    // Categories (UPDATED Strapi) 
    async getCategories() {
      const response = await this.apiCall('categories?fields[0]=category_code&fields[1]=name&fields[2]=description&sort[0]=name', 'GET')
      return response     
    },
    // Audit action (UPDATED Strapi)
    async audit(action, uri, result) {
      const response = await this.apiCall('audits', 'POST', { data: { action, uri, result } })
      if (response.status >= 400) {
        // Failure to audit should not bomb the operation as user should not be aware of housekeeping behind the scenes...
        console.error(response.message)
      }
    }
  }
})
