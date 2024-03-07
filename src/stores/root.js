import { authenticationStore } from './authentication'
import { dataService } from "../services/data.service"
import { defineStore } from 'pinia'

const API = process.env.BASE_URL

export const rootStore = defineStore('root', {
  state: () => ({
    assessmentId: null,
    patientList: {},
    testList: [],
    patientIndex: 0,
    testIndex: 0,
    part1complete: null,
    part2complete: null,
    part3complete: null,
    part4complete: null,
    configErrorComplete: null,
    mitigationData: []
  }),
  actions: {
    async apiCall(url, method = 'POST', body = null) {

      console.group('apiCall()')

      if (!(method == 'GET' || method == 'POST')) {
        throw new Error(`API call using ${method} not implemented`)
      }

      let response = null, ret = {}
      const auth = authenticationStore()
      const config = { headers: { Authorization: `Bearer ${auth.getToken()}` } }

      try {
        if (method == 'GET') {
          console.debug('GET url', API + url, 'config', config)
          response = await axios.get(API + url, config)
        } else if (method == 'POST') {
          console.debug('POST url', API + url, 'config', config, 'body', JSON.stringify({ body }))
          response = await axios.get(API + url, JSON.stringify({ body }), config)
        }
        ret = { status: response.status, data: response.data}
      } catch(err) {
        ret = auth.triageError(err)
      }

      console.debug('API call response is', ret)
      console.groupEnd()

      return ret
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
    async saveCreatePatients(time_taken) {
      const assessmentId = await this.getAssessmentId()
      const response = await this.apiCall('createpatients?ID=' + assessmentId, 'POST', { time_taken })
      if (response.status < 400)      {
        this.part2complete = true
      }
      return(response)
    },
    async savePatientData(qualitative_data, code, time_taken, index, completed) {
      const assessmentId = await this.getAssessmentId()
      const response = await this.apiCall('patientdata?ID=' + assessmentId, 'POST', { qualitative_data, code, time_taken })   
      if (response.status < 400) {
        this.part3complete = completed
        this.patientIndex = index + 1
      }
      return(response)
    },
    async savePrescriptionData(prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data, index, completed) {
      const assessmentId = await this.getAssessmentId()
      const response = await this.apiCall('prescriptionData?ID=' + assessmentId + '&TEST_ID='  + prescription, 'POST', { prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data })   
      if (response.status < 400) {
        this.part4complete = completed
        this.testIndex = index + 1
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
    setPatientList({ commit }, { patientList }) {
      commit('setPatientList', { patientList })
    },
    setTestList({ commit }, { testList }) {
      commit('setTestList', { testList })
    },            
    
    
    storeAssessmentId({ commit }, { id }) {
      commit('setAssessmentId', { id })
    },
    storeMitigationData({ commit }, { goodPercentage, somePercentage, notPercentage, overPercentage, percentageNulls }) {
      commit('setMitigationData', { goodPercentage, somePercentage, notPercentage, overPercentage, percentageNulls })
    },
    storeStackedChartData({ commit }, { stackedChartData }) {
      commit('setStackedChartData', { stackedChartData })
    },
    storeMitigationChartData({ commit }, { mitigationChartData }) {
      commit('setMitigationChartData', { mitigationChartData })
    }
  },
  mutations: {
    setPatientList(state, patientList) {
      state.patientList = patientList
    },
    setTestList(state, testList) {
      state.testList = testList
    },
    updatePatientIndex(state, index) {
      state.patientIndex = index + 1
    },
    updateTestIndex(state, index) {
      state.testIndex = index + 1
    },
    saveSystemData(state) {
      state.part1complete = true
    },
    saveCreatePatients(state) {
      state.part2complete = true
    },
    savePatientData(state, completed) {
      state.part3complete = completed
    },
    savePart4Data(state, completed) {
      state.part4complete = completed
    },
    saveConfigError(state) {
      state.configErrorComplete = true
    },
    setAssessmentId(state, id) {
      state.assessmentId = id
    },
    setMitigationData(state, goodPercentage, somePercentage, notPercentage, overPercentage, percentageNulls) {
      state.mitigationData[0] = goodPercentage
      state.mitigationData[1] = somePercentage
      state.mitigationData[2] = notPercentage
      state.mitigationData[3] = overPercentage
      state.mitigationData[4] = percentageNulls
    },
    setStackedChartData(state, stackedChartData) {
      state.stackedChartData = stackedChartData
    },
    setMitigationChartData(state, mitigationChartData) {
      state.mitigationChartData = mitigationChartData
    }
  }
})
