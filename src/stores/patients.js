import { defineStore } from 'pinia'
import { rootStore } from './root'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { appSettingsStore } from './appSettings'
import { authenticationStore } from './authentication'

export const patientStore = defineStore('patients', {
  state: () => {
    return {
      patientPool: [],
      requiredAdultPatients: [],
      requiredChildPatients: [],
      allRequiredPatients: [],
      totalNumPatients: 0,
      patientList: [],    // The full list of all patient for this assessment
      testList: [],       // The full list of all the scenario tests/config errors
      patientIds: [],     // Patient IDs assigned to this assessment
      nextEditablePatientIndex: 0
    }
  },
  persist: true, 
  actions: {
    async getRequiredTests() {

      console.group('getRequiredTests()')

      this.$reset()      

      const response = await rootStore().apiCall('requiredtests', 'GET')
      if (response.status < 400) {
        const addedIds = {};  // The above call returns a list with duplicates...
        response.data.forEach(test => {
          const patientId = test.patient.id
          if (addedIds[patientId] !== true) {
            let requiredPatient = this.formatPatientData(test.patient)
            if (requiredPatient.is_adult) {
              this.requiredAdultPatients.push(requiredPatient)
            } else {
              this.requiredChildPatients.push(requiredPatient)
            }
            this.allRequiredPatients.push(requiredPatient)
            addedIds[patientId] = true
          }          
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
    async getAllConfigErrors() {
      const response = await rootStore().apiCall('configerrors', 'GET')
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
      return(response)
    },
    async savePatientData(qualitative_data, code, time_taken) {
      const assessmentId = rootStore().assessmentId
      const response = await rootStore().apiCall('patientdata?ID=' + assessmentId, 'POST', { qualitative_data, code, time_taken })   
      return(response)
    },    
    async savePrescriptionData(prescription, outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data) {
      const assessmentId = rootStore().assessmentId
      const response = await rootStore().apiCall('prescriptionData?ID=' + assessmentId + '&TEST_ID='  + prescription, 'POST', { outcome, other, intervention_type, selected_type, risk_level, result, result_score, time_taken, qualitative_data })   
      return(response)
    },
    async saveConfigError(test_id, result, time_taken) {
      const assessmentId = rootStore().assessmentId
      const response = await rootStore().apiCall('config?ID=' + assessmentId, 'POST', { test_id, result, time_taken })
      return response
    },
    // Main entry point for getting patient and test data from the backend
    // Args:
    // prescriptions - true to fetch prescription data for each patient
    async getCompletePatientDetails(prescriptions = false, patientType = null) {
      
      let ret = null
      this.patientList = []
      this.testList = []
      this.nextEditablePatientIndex = 0

      console.group('getCompletePatientDetails()')
      console.debug('Fetching prescription data', prescriptions)

      try {

        if (this.patientPool.length == 0) {
          const patientsResponse = await rootStore().apiCall('patients', 'GET')
          if (patientsResponse.status < 400) {
            // Cache the entire patient pool (invariant, so not a problem across sessions)
            this.patientPool = patientsResponse.data
            console.debug('All patient pool', this.patientPool)
          } else {
            // There was an error
            throw new Error(patientsResponse.message)
          }
        }
          
        const instId = authenticationStore().institutionId
        const idsResponse = await rootStore().apiCall('getPatientIds?INSTITUTION_ID=' + instId, 'GET')
        if (idsResponse.status < 400) {
          if (idsResponse.data == 'No patient ids') {
            // No stored IDs so compile list from scratch (coming from completing system info)
            console.debug('Coming from completed system information')
            console.assert(patientType != null, 'patientType should not be null (Adults|Paediatrics|Both)')
            this.patientList = this.compilePatientList(patientType, appSettingsStore().assessmentNumPatients)
          } else {
            // Use stored IDs
            console.debug('Using stored patient IDs', idsResponse.data)
            this.patientIds = idsResponse.data
            this.patientList = this.patientPool.filter(p => this.patientIds.includes(p.id))
            // Get the existing patient data => get next editable entry
            const exPatientDataResponse = await rootStore().apiCall('getPatientDataByAssessmentId?INSTITUTION_ID=' + instId, 'GET')
            if (exPatientDataResponse.status < 400) {
              this.nextEditablePatientIndex = exPatientDataResponse.data.length              
            } else {
              throw new Error(exPatientDataResponse.message)
            }
          }
          this.totalNumPatients = this.patientList.length
        } else {
          throw new Error(idsResponse.message)
        }
  
        if (prescriptions) {
          // Ready to add the prescription data
          console.debug('Adding prescriptions...')
          // First determine which scenarios we have already done...
          const doneScenarios = await rootStore().apiCall('getPrescriptionDataByAssessmentId?ID=' + rootStore().assessmentId, 'GET')
          if (doneScenarios.status < 400) {
            const doneIds = doneScenarios.data.map(ds => ds.prescription.prescription_id)
            this.patientIds.forEach(async pid => {
              console.debug('Patient id', pid)
              const testResponse = await rootStore().apiCall('prescriptions?ID=' + pid, 'GET')
              if (testResponse.status < 400) {
                console.debug('Prescriptions', testResponse.data)
                // Filter out ones we have already done...
                const outstandingTests = testResponse.data.filter(t => !doneIds.includes(t.prescription_id))
                this.testList.push(...outstandingTests)
              } else {
                throw new Error(testResponse.message)
              }    
            })
          } else {
            throw new Error(doneScenarios.message)
          }

          console.debug('Test list (before adding config errors)', this.testList)
         
          // Get the total config error pool
          const confErrResponse = await this.getAllConfigErrors()
          if (confErrResponse.status < 400) {
            // Now see which ones we have already done
            const configErrorPool = confErrResponse.data
            const doneConfErrorsResponse = await rootStore().apiCall('getConfigErrorDataByAssessmentId?ID=' + rootStore().assessmentId, 'GET')
            if (doneConfErrorsResponse.status < 400) {
              const doneConfIds = doneConfErrorsResponse.data.map(dce => dce.test_id)
              configErrorPool.forEach(ce => {
                if (!doneConfIds.includes(ce.configErrorCode)) {
                  let randInsertPoint = Math.floor(Math.random() * (this.testList.length - 2)) + 2
                  console.debug('Insert config error', ce, 'at random index', randInsertPoint)
                  console.debug('Test list before', this.testList)
                  this.testList.splice(randInsertPoint, 0, ce)
                  console.debug('Test list after', this.testList)
                }                
              })
            } else {
              throw new Error(doneConfErrorsResponse.message)
            }            
          } else {
            throw new Error(confErrResponse.message)
          }
        }
        this.patientList.forEach(p => p.dob = this.formatDOB(p))
        ret = { status: 200, data: this.patientList }        
      } catch(err) {
        ret = { status: 500, message: err.message }
        console.error(ret)
      }      
      return ret
    },
    compilePatientList(type, requiredLength) {

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

      const poolOfType = type == 'Both' ? this.patientPool : this.patientPool.filter(p => (type == 'Adults' && p.is_adult))
      const requiredPatients = this[typeToLsMapping[type]] || []
      patientList = requiredPatients.map(p => ({...p}))
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
