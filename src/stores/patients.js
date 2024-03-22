import { defineStore } from 'pinia'
import { rootStore } from './root'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { authenticationStore } from './authentication'

export const patientStore = defineStore('patients', {
  actions: {
    async getRequiredTests() {
      const response = await rootStore().apiCall('requiredtests', 'GET')
      return response
    },
    async getAllPatients() {
      const response = await rootStore().apiCall('patients', 'GET')
      return response
    },
    async getAllPrescriptions() {
      const response = await rootStore().apiCall('allprescriptions', 'GET')
      return response
    },
    async getPatientDetails() {
      const response = await rootStore().apiCall('patientdetails', 'GET')
      return response
    },
    async getPatientIds() {
      const instId = authenticationStore().institutionId
      const response = await rootStore().apiCall('getPatientIds?INSTITUTION_ID=' + instId, 'GET')
      return response
    },
    async getPatientByCode(code) {
      const response = await rootStore().apiCall('patientByCode?code=' + code, 'GET')
      return response      
    },
    async getPatientById(patientId) {
      const response = await rootStore().apiCall('patientById?PATIENT_ID=' + patientId, 'GET')
      return response      
    },
    // async setConfigErrors() {

    //   let numConfigErrors = settings.numConfigError
    //   let insertPoints = []

    //   while (insertPoints.length < numConfigErrors) {
    //     // create a random point to insert a config error between 2 and 20
    //     let configInsert = Math.floor(Math.random() * 20) + 2
    //     if (!insertPoints.includes(configInsert)) {
    //       insertPoints.push(configInsert)
    //     }
    //   }

    //   // fix to prevent config errors following on one after another (this causes an error in the testList increment)
    //   let ipDiff = calcDiff(insertPoints[0], insertPoints[insertPoints.length - 1])
    //   console.log('Diff ' + ipDiff)
    //   if (ipDiff === 1) {

    //     let ipvalue = insertPoints[insertPoints.length - 1]
    //     console.log('Before nudge ' + ipvalue)
    //     // add enough to push it a little ahead
    //     ipvalue += 3
    //     console.log('After nudge ' + ipvalue)
    //     insertPoints[insertPoints.length - 1] = ipvalue
    //   }

    //   // get all the config errors (another promise)
    //   let configErrors = await rootStore().getConfigErrors().then(data => {
    //     let configErrors = data
    //     let testList = JSON.parse(localStorage.getItem('testList'))

    //     // splice the config errors into allTests at the insertPoints (array length changes after each insert)
    //     for (let i = 0; i < insertPoints.length; i++) {
    //       // add new element without deleting anything
    //       testList.splice(insertPoints[i], 0, configErrors[i])
    //     }

    //     // update the test list
    //     store.dispatch('setTestList', { testList })
    //   })
    // }
    formatPatientData(patient) {
      return Object.assign({}, patient, {
        allergy: this.formatAllergy(patient.allergy),
        diagnosis: this.formatDiagnosis(patient.diagnosis),
        comorbidity: this.formatComorbidity(patient.comorbidity)
      })      
    },    
    formatAllergy(allergy){
      return allergy.map(a => a.allergy)      
    },    
    formatDiagnosis(diagnosis) {
      return diagnosis.map(d => d.diagnosis)
    },    
    formatComorbidity(comorbidity) {
      return comorbidity.map(c => c.comorbidity)      
    },
    formatDOB(patient) {
      dayjs.extend(customParseFormat)
      return dayjs().subtract(patient.age, 'year').format('DD/MM/YYYY')
    }
    
  }
})
