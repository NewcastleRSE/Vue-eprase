import { defineStore } from 'pinia'
import { rootStore } from './root'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { authenticationStore } from './authentication'

export const patientStore = defineStore('patients', {
  state: () => {
    return {
      requiredAdultPatients: [],
      requiredChildPatients: [],
      allRequiredPatients: [],
      totalNumPatients: 0,
      patientList: [], 
      testList: []
    }
  },
  persist: true,
  getters: {
    getPatientList: (state) => state.patientList,
    getTestList: (state) => state.testList
  },
  actions: {
    async getRequiredTests() {

      console.group('getRequiredTests()')

      this.$reset()
      console.debug('requiredAdultPatients just after store reset', this.requiredAdultPatients)
      console.debug('requiredChildPatients just after store reset', this.requiredChildPatients)
      console.debug('allRequiredPatients just after store reset', this.allRequiredPatients)

      const response = await rootStore().apiCall('requiredtests', 'GET')
      if (response.status < 400) {
        response.data.forEach(test => {
          let requiredPatient = this.formatPatientData(test.patient)
          if (requiredPatient.is_adult) {
            this.requiredAdultPatients.push(requiredPatient)
          } else {
            this.requiredChildPatients.push(requiredPatient)
          }
          this.allRequiredPatients.push(requiredPatient)
        })
        console.debug('requiredAdultPatients', this.requiredAdultPatients)
        console.debug('requiredChildPatients', this.requiredChildPatients)
        console.debug('allRequiredPatients', this.allRequiredPatients)
      }

      console.debug('Response', response)
      console.groupEnd()
      
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
    async savePatientList(patient_list) {
      const institutionId = authenticationStore().institutionId
      const response = await rootStore().apiCall('savepatientlist?INSTITUTION_ID=' + institutionId, 'POST', patient_list)      
      return(response)
    },    
    async saveCreatePatients(time_taken) {
      const assessmentId = rootStore().assessmentId
      const response = await rootStore().apiCall('createpatients?ID=' + assessmentId, 'POST', { time_taken })
      if (response.status < 400)      {
        rootStore().storePart2complete(true)
      }
      return(response)
    },
    async savePatientData(qualitative_data, code, time_taken, completed) {
      const assessmentId = rootStore().assessmentId
      const response = await rootStore().apiCall('patientdata?ID=' + assessmentId, 'POST', { qualitative_data, code, time_taken })   
      if (response.status < 400) {
        rootStore().storePart3complete(completed)
      }
      return(response)
    },    
    async savePrescriptionData(prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data, completed) {
      const assessmentId = rootStore().assessmentId
      const response = await rootStore().apiCall('prescriptionData?ID=' + assessmentId + '&TEST_ID='  + prescription, 'POST', { prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data })   
      if (response.status < 400) {
        rootStore().storePart4complete(completed)
      }
      return(response)
    },
    async getCompletePatientDetails(patientType) {
      
      let ret = null
      this.patientList = []
      this.testList = []

      console.group('getCompletePatientDetails()')
      console.debug('Patient type', patientType)

      const patientsResponse = await rootStore().apiCall('patients', 'GET')
      if (patientsResponse.status < 400) {

        const allPatients = patientsResponse.data
        console.debug('All patient list', allPatients)

        if (!patientType) {
          // Partially completed assessment - use API call to retrieve patient IDs
          console.debug('Partial completed assessment - getting patient ids...')

          let idList = []
          const instId = authenticationStore().institutionId
          const idsResponse = await rootStore().apiCall('getPatientIdsOutstanding?INSTITUTION_ID=' + instId, 'GET')
          if (idsResponse.status < 400) {
            if (idsResponse.status == 200 && idsResponse.data != 'No patient ids') {
              idList = idsResponse.data.todopatients.split(',')
              console.debug('List of patient ids still to enter', idList)
              this.patientList = allPatients.filter(p => idList.includes(p.id + ''))
              this.totalNumPatients = idsResponse.data.allpatients.split(',').length
            } else {
              console.debug('No patient ids recorded')              
            }
          } else {
            ret = idsResponse
          }
        } else {          
          // Coming from just completing the system information
          console.debug('Coming from completed system information')
          this.patientList = this.compilePatientList(patientsResponse.data, patientType, 15)          
        }

        console.debug('Adding prescriptions...')
        this.patientList.forEach(async p => {
          console.debug('Patient id', p.id)
          const testResponse = await rootStore().apiCall('prescriptions?ID=' + p.id, 'GET')
          if (testResponse.status < 400) {
            console.debug('Prescriptions', testResponse.data)
            this.testList.push(...testResponse.data)
          } else {
            console.error('Problems retrieving', testResponse.message)
            ret = testResponse
          }
        })

        if (ret == null) {
          this.patientList.forEach(p => p.dob = this.formatDOB(p))
          ret = { status: 200, data: this.patientList }
        }

      } else {
        ret = patientsResponse
      }     
      return ret
    },
    compilePatientList(pool, type, requiredLength) {

      // pool: list of all patients
      // type: Adults|Paediatrics|Both
      // requiredLength: 15 pro-tem

      console.group('compilePatientList()')
      console.debug('Compile list of', requiredLength, 'patients of type', type)

      let patientList = []
      const typeToLsMapping = {
        'Adults': 'requiredAdultPatients',
        'Paediatrics': 'requiredChildPatients',
        'Both': 'allRequiredPatients'
      }

      const poolOfType = type == 'Both' ? pool : pool.filter(p => (type == 'Adults' && p.is_adult))
      const requiredPatients = this[typeToLsMapping[type]] || []
      patientList = structuredClone(requiredPatients)
      console.debug('Required patient list', patientList)

      let added = {}
      patientList.forEach(p => added[p.id] = true)
      while(patientList.length < requiredLength) {
        const patient = poolOfType.shift()
        if (!added[patient.id]) {
          patientList.push(patient)
          added[patient.id] = true
        }
      }      
      this.shuffle(patientList)

      console.debug('Return', patientList)
      console.groupEnd()

      return patientList
    },
    shuffle(a) {
      // Durstenfeld shuffle in-place - see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      console.dir('List before shuffle', a)
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      console.dir('List after shuffle', a)
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
    // Patient DOB is random date within last 12 months, adjusted by their stored age
    formatDOB(patient) {
      dayjs.extend(customParseFormat)
      return dayjs().subtract(Math.random() * 365, 'day').subtract(patient.age, 'year').format('DD/MM/YYYY')
    }
    
  }
})
