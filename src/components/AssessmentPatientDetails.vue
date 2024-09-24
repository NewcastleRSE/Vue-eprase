<template>
  <main class="leftalign">

    <TabHeader :showIndex="1" />

    <div class="content p-4">

      <LoginInfo />

      <h3>Patient Information</h3>
      <div v-if="nextUnsaved == 0">
        <p>Please enter the following {{ totalNumPatients }} sets of patient details into your EP system</p>
      </div>
      <div v-if="nextUnsaved < totalNumPatients">
        <p>You have a further {{ totalNumPatients - nextUnsaved }} sets of patient details to enter ({{ nextUnsaved }} have already been entered)</p>
      </div>
      <p>Prescribe any medication listed below using your usual prescribing process. Populate any other mandatory fields
        with appropriate self-generated information.</p>
      <p class="pb-4">When you are done, click <span class="fw-bold">Next</span> to continue or <span class="fw-bold">Previous</span> to view already entered items</p>

      <div v-if="patient != null" class="mx-auto card">

        <div class="card-header">
          <h4>{{ patient.first_name }} {{ patient.surname }}</h4>
          <span class="patient-image">
            <img v-if="patient.gender === 'male' && patient.is_adult === true" src="../assets/images/anon-male.png" />
            <img v-if="patient.gender === 'female' && patient.is_adult === true"
              src="../assets/images/anon-female.png" />
            <img v-if="!patient.is_adult" src="../assets/images/child.png" />
          </span>
          <p class="subtitle">(Patient {{ patientIndex + 1 }} of {{ totalNumPatients }})</p>
        </div>

        <div class="card-body p-4">

          <div class="row mb-4">
            <div class="patient-demographics col-auto col-xl-4 pt-lg-0 pt-2">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th colspan="2" class="card-title bg-primary-subtle">
                      <h5>Demographics</h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Height (m)</th><td>{{ patient.height || 'unavailable' }}</td>
                  </tr>
                  <tr>
                    <th>Weight (kg)</th><td>{{ patient.weight || 'unavailable' }}</td>
                  </tr>
                </tbody>                  
              </table>
            </div>
            <div class="patient-allergies col-auto col-xl-4 pt-lg-0 pt-2">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th class="card-title bg-primary-subtle">
                      <h5>Allergies</h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="patient.allergy.length > 0" v-for="allergy in patient.allergy" :key="allergy">
                    <td>{{ allergy.allergy }}</td>
                  </tr>
                  <tr v-if="patient.allergy.length == 0"><td>No Known Drug Allergies</td></tr>
                </tbody>
              </table>
            </div>
            <div class="patient-medication col-auto col-xl-4 pt-lg-0 pt-2">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th colspan="5" class="card-title bg-primary-subtle">
                      <h5>Current Medication</h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="patient.medication_histories.length != 0">
                    <th>Name</th>
                    <th>Dose</th>
                    <th>Route</th>
                    <th>Form</th>
                    <th>Frequency</th>                   
                  </tr>
                  <tr v-if="patient.medication_histories.length != 0" v-for="history in patient.medication_histories" :key="history">
                    <td>{{ history.name }}</td>
                    <td>{{ history.dose }} {{ history.units }}</td>
                    <td>{{ history.route }}</td>
                    <td>{{ history.form }}</td>
                    <td>{{ history.frequency }}</td>
                  </tr>
                  <tr v-if="patient.medication_histories.length == 0"><td>None</td></tr>
                </tbody>                  
              </table>                
            </div>
          </div>

          <div class="row mb-4">
            <div class="patient-clinical-data col-auto col-xl-4 pt-lg-0 pt-2">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th colspan="3" class="card-title bg-primary-subtle">
                      <h5>Clinical Data</h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="patient.clinical_data.length != 0">
                    <th>Investigation</th>
                    <th>Value</th>
                    <th>Unit</th>
                  </tr>
                  <tr v-if="patient.clinical_data.length != 0" v-for="clinical in patient.clinical_data" :key="clinical">
                    <td>{{ clinical.investigation }}</td>
                    <td>{{ clinical.value }}</td>
                    <td>{{ clinical.unit }}</td>
                  </tr>
                  <tr v-if="patient.clinical_data.length == 0"><td>None</td></tr>
                </tbody>                  
              </table>
            </div>
            <div class="patient-diagnosis col-auto col-xl-4 pt-lg-0 pt-2">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th class="card-title bg-primary-subtle">
                      <h5>Presenting Complaint</h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="patient.diagnosis.length != 0" v-for="diagnosis in patient.diagnosis" :key="diagnosis">
                    <td>{{ diagnosis.diagnosis }}</td>
                  </tr>
                  <tr v-if="patient.diagnosis.length == 0"><td>None</td></tr>
                </tbody>                  
              </table>
            </div>
            <div class="patient-comorbidities col-auto col-xl-4 pt-lg-0 pt-2">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th class="card-title bg-primary-subtle">
                      <h5>Comorbidities</h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="patient.comorbidity.length != 0" v-for="comorbidity in patient.comorbidity" :key="comorbidity">
                    <td>{{ comorbidity.comorbidity }}</td>
                  </tr>
                  <tr v-if="patient.comorbidity.length == 0"><td>None</td></tr>
                </tbody>
              </table>                
            </div>
          </div>

          <div v-if="patientIndex >= nextUnsaved" class="row mb-4">
            <div class="alert alert-warning fw-bold" role="alert">
              To optimise the use of this tool please record ALL types of guidance that appears on your system screen
            </div>
            <textarea class="form-control" ref="patientIntervention" v-model="patientQualData" id="patient_intervention" rows="5"
              placeholder="Please note any interventions from the system..."></textarea>
          </div>
          
        </div>

        <input type="hidden" ref="patientId" id="patient_id" v-model="patient.code" />

      </div>

      <div class="my-2">
        <h5 v-if="patientIndex < totalNumPatients - 1">
          When the patient has been admitted to the ePrescribing System, click <span class="fw-bold">Next</span>
          or use <span class="fw-bold">Previous</span> to view already entered items
        </h5>
        <h5 v-if="patientIndex == totalNumPatients - 1">
          Please ensure you click the <span class="fw-bold">Done</span> button to save your progress
        </h5>
        <button type="button" class="btn btn-primary me-2" @click="prevPatient()" :disabled="patientIndex == 0">
          <i class='bi bi-arrow-left-circle'></i>
            Previous
        </button>     
        <button type="button" class="btn btn-primary" @click="nextPatient()">
          <i :class="patientIndex < totalNumPatients - 1 ? 'bi bi-arrow-right-circle' : 'bi bi-check2-circle'"></i>
            {{ patientIndex < totalNumPatients - 1 ? 'Next' : 'Done' }}
        </button>
      </div>
    </div>

    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />
    
  </main>
</template>

<script>

import dayjs from 'dayjs'
import AppLogo from "./AppLogo"
import TabHeader from './TabHeader'
import LoginInfo from './LoginInfo'
import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'
import { patientStore } from '../stores/patients'
import ErrorAlertModal from './ErrorAlertModal'

export default {
  name: "AssessmentPatientDetails",
  components: {
    TabHeader,
    LoginInfo,
    AppLogo,
    ErrorAlertModal
  },
  computed: {
    ...mapStores(patientStore, rootStore),
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    patientService() {
      return patientStore()
    },    
    patientList() {
      return this.patientService.patientList
    },
    nextEditablePatient() {
      return this.patientService.nextEditablePatientIndex
    },    
    totalNumPatients() {
      return this.patientList.length
    }
  },
  data() {
    return {
      startTime: '',
      patient: null,
      patientQualData: '',
      patientIndex: 0,
      nextUnsaved: 0
    }
  },
  methods: {
    async savePatient() {

      console.group('savePatient()')

      const qualitative_data = this.patientQualData
      const code = this.patient.code

      console.debug('Attempt save of patient at index', this.patientIndex)
      console.debug('Qualitative data', qualitative_data, 'patient code', code)

      const time_taken = dayjs().diff(this.startTime, 'seconds')
      const saveResponse = await this.patientService.savePatientData(qualitative_data, code, time_taken)
      
      console.debug('Returning', saveResponse)

      return saveResponse
    },
    prevPatient() {

      console.group('prevPatient()')
      
      if (this.patientIndex > 0) {
        this.patientQualData = ''
        this.patient = this.patientList[--this.patientIndex]
        console.debug('Now viewing patient', this.patientIndex)
      }      

      console.groupEnd()
    }, 
    async nextPatient() {

      console.group('nextPatient()')

      if (this.patientIndex >= this.nextUnsaved) {

        console.debug('Attempt save of patient at index', this.patientIndex, 'already saved', this.nextUnsaved, 'patients')
        console.debug('qd', this.$refs.patientIntervention.value, 'code', this.$refs.patientId.value)

        const completed = this.nextUnsaved == this.totalNumPatients - 1
        const time_taken = dayjs().diff(this.startTime, 'seconds')
        const qualitative_data = this.$refs.patientIntervention.value
        const code = this.$refs.patientId.value
        console.debug('Completed', completed, 'patient code', code, 'qualitative data', qualitative_data)

        const dataService = rootStore()

        const saveResponse = await this.patientService.savePatientData(qualitative_data, code, time_taken)
        if (saveResponse.status < 400) {
          if (completed) {
            // All patient details now entered
            const updateResponse = await dataService.updateAssessmentProgress()
            if (updateResponse.status < 400) {
              dataService.audit('Completed patient details', '/assessmentpatientdetails')
              this.$router.push('/assessmentscenarios')
            } else {
              this.errorAlertModal.show(updateResponse.message)
            }
          } else {
            // On to the next one
            this.nextUnsaved++
            this.patient = this.patientList[++this.patientIndex]
            this.patientQualData = ''
            console.debug('Advanced to', this.patientIndex, 'now processed', this.nextUnsaved)
          }
        } else {
          this.errorAlertModal.show(saveResponse.message)
        }
      } else {
        this.patient = this.patientList[++this.patientIndex]
        console.debug('Advanced to', this.patientIndex, '(without additional save), now processed', this.nextUnsaved)
      }
      
      console.groupEnd()
    },
    async getPatientsToDo() {

      console.group('getPatientsToDo()')
      
      const patientResponse = await this.patientService.getCompletePatientDetails()
      if (patientResponse.status < 400) {
        this.nextUnsaved = this.nextEditablePatient
        this.patientIndex = this.nextUnsaved
        this.patient = this.patientList[this.patientIndex]
        console.debug('Initialising patient list at position', this.patientIndex)
      } else {
        this.errorAlertModal.show(patientResponse.message)
      }

      console.groupEnd()
    }
  },
  mounted() {
    this.getPatientsToDo()    
  },
  created: function () {
    this.startTime = dayjs()
  }
}
</script>

<style scoped>
span.patient-image>img {
  height: 80px;
}
</style>
