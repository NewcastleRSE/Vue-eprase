<template>
  <main class="leftalign">

    <TabHeader :showIndex="1" />

    <div class="content p-4">

      <LoginInfo />

      <h3>Patient Information</h3>
      <div v-if="totalNumPatients == myPatientList.length">
        <p>Please enter the following {{ myPatientList.length }} patient entries into your EP system</p>
      </div>
      <div v-if="totalNumPatients != myPatientList.length">
        <p>You have a further {{ myPatientList.length }} patient entries to enter ({{ totalNumPatients -
      myPatientList.length }} already present)</p>
      </div>
      <p>Prescribe any medication listed below using your usual prescribing process. Populate any other mandatory fields
        with appropriate self-generated information.</p>
      <p class="pb-4">When you are done, click <span class="fw-bold">Next</span> to continue.</p>

      <div v-for="(patient, index) in myPatientList" :key="patient.id">

        <div class="mx-auto card" v-if="index == patientIndex">
          <div class="card-header">
            <h4>{{ patient.first_name }} {{ patient.surname }}</h4>
            <span class="patient-image" v-if="patient.gender === 'male' && patient.is_adult === true">
              <img src="../assets/images/anon-male.png" height="80px" />
            </span>

            <span class="patient-image" v-if="patient.gender === 'female' && patient.is_adult === true">
              <img src="../assets/images/anon-female.png" height="80px" />
            </span>

            <span class="patient-image" v-if="!patient.is_adult">
              <img src="../assets/images/child.png" height="80px" />
            </span>
            <p class="subtitle">(Patient {{ index + 1 }} of {{ numPatients }})</p>
          </div>

          <div class="card-body">

            <div class="float-start">
              <div class="patient-demographics">
                <h5 class="card-title">Demographics</h5>
                <table>
                  <tr>
                    <td><span class="fw-bold">Height (m):</span> {{ patient.height || 'unavailable' }}</td>
                  </tr>
                  <tr>
                    <td><span class="fw-bold">Weight (kg):</span> {{ patient.weight || 'unavailable' }}</td>
                  </tr>
                </table>
              </div>

              <div class="patient-info">

                <div v-if="patient.allergy.length !== 0">
                  <h5 class="card-title">Allergies</h5>
                  <table v-if="patient.allergy.length > 0">
                    <tr v-for="allergy in patient.allergy" :key="allergy">
                      <td>{{ allergy.allergy }}</td>
                    </tr>
                  </table>
                  <div v-if="patient.allergy.length == 0">No Known Drug Allergies</div>
                </div>

                <div v-if="patient.medication_histories.length != 0">
                  <h5 class="card-title">Current Medication</h5>
                  <table>
                    <tr>
                      <td><span class="fw-bold">Name</span></td>
                      <td><span class="fw-bold">Dose</span></td>
                      <td><span class="fw-bold">Route</span></td>
                      <td><span class="fw-bold">Form</span></td>
                      <td><span class="fw-bold">Frequency</span></td>
                    </tr>
                    <tr v-for="history in patient.medication_histories" :key="history">
                      <td>{{ history.name }}</td>
                      <td>{{ history.dose }} {{ history.units }}</td>
                      <td>{{ history.route }}</td>
                      <td>{{ history.form }}</td>
                      <td>{{ history.frequency }}</td>
                    </tr>
                  </table>
                </div>

              </div>
            </div>

            <div class="float-end">

              <div class="clinical-data" v-if="patient.clinical_data.length != 0">
                <h5 class="card-title">Clinical Data</h5>
                <table>
                  <tr>
                    <td><span class="fw-bold">Investigation</span></td>
                    <td><span class="fw-bold">Value</span></td>
                    <td><span class="fw-bold">Unit</span></td>
                  </tr>
                  <tr v-for="clinical in patient.clinical_data" :key="clinical">
                    <td>{{ clinical.investigation }}</td>
                    <td>{{ clinical.value }}</td>
                    <td>{{ clinical.unit }}</td>
                  </tr>
                </table>
              </div>

              <div class="clinical-data" v-if="patient.diagnosis.length != 0">
                <h5 class="card-title">Presenting Complaint</h5>
                <table>
                  <tr v-for="diagnosis in patient.diagnosis" :key="diagnosis">
                    <td>{{ diagnosis }}</td>
                  </tr>
                </table>
              </div>

              <div class="clinical-data" v-if="patient.comorbidity.length != 0">
                <h5 class="card-title">Comorbidities</h5>
                <table>
                  <tr v-for="comorbidity in patient.comorbidity" :key="comorbidity">
                    <td>{{ comorbidity }}</td>
                  </tr>
                </table>
              </div>

              <input type="hidden" id="patient_id" :value="patient.code" />

            </div>

          </div>
        </div>

        <div class="mb-4 row">
          <div class="mx-auto mt-4">
            <div class="alert alert-warning" role="alert">
              To optimise the use of this tool please record ALL types of guidance that appears on your system screen
            </div>
            <textarea type="text" class="form-control" name="input" id="patient-intervention"
              v-model="assessment.qualitative_data" placeholder="Please note any interventions from the system..."
              maxlength="500"></textarea>
          </div>
        </div>
        <div class="mb-4 row mx-auto">
          <h5 v-if="patientIndex < myPatientList.length - 1">
            When the patient has been admitted to the ePrescription System, click <span class="fw-bold">Next</span>.
          </h5>
          <h5 v-if="patientIndex == myPatientList.length - 1">
            Please ensure you click the <span class="fw-bold">Done</span> button to save your progress
          </h5>
          <button type="button" class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#exitModal">
            <i class="bi bi-box-arrow-right pe-1"></i>Exit</button>
          <button v-if="patientIndex < myPatientList.length - 1" type="button" class="btn btn-primary me-3"
            @click="onNextClick()">Next</button>
          <button v-if="patientIndex == myPatientList.length - 1" type="button" class="btn btn-primary"
            @click="onDoneClick()">Done</button>
        </div>
      </div>
    </div>
    <ExitModal :showActionBtn="true" @modal-actioned="exit()" />
    <AppLogo cls="bottomright" />
  </main>
</template>

<script>

import dayjs from 'dayjs'
import AppLogo from "./AppLogo"
import TabHeader from './TabHeader'
import LoginInfo from './LoginInfo'
import { mapStores } from 'pinia'
import { patientStore } from '../stores/patients'
import ErrorAlertModal from './ErrorAlertModal'
import ExitModal from "./ExitModal"

import { dataService } from '../services/data.service'
import { patientService } from '../services/patient.service'

export default {
  name: "AssessmentPatientDetails",
  components: {
    TabHeader,
    LoginInfo,
    AppLogo,
    ErrorAlertModal,
    ExitModal
  },
  computed: {
    ...mapStores(patientStore),
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    myPatientList() {
      return patientStore().patientList
    },
    totalNumPatients() {
      return patientStore().totalNumPatients
    }
  },
  data() {
    return {
      assessment: {
        qualitative_data: '',
        time_taken: ''
      },
      startTime: '',
      patientIndex: 0
    }
  },
  methods: {
    exit() {
      this.$router.push('/logout')
    },
    onNextClick() {
      this.saveData()//TODO
      this.patientIndex++
    },
    onDoneClick() {
      const unlockTime = new Date()
      unlockTime.setHours(unlockTime.getHours() + 1)
      localStorage.setItem('assessmentUnlockTime', unlockTime.toISOString())

      // this is now true
      this.completed = true
      // update the testList with config errors, before the
      patientService.setConfigErrors()

      // save the last patient data
      this.saveData()
      this.updateAssessmentStatus()

      // audit
      dataService.audit('Completed patient details', '/assessmentpatientdetails')
      this.$router.push('/lockoutscreen')
    },
    saveData() {
      this.$validator.validate().then(valid => {
        if (valid) {

          this.assessment.time_taken = dayjs().diff(this.startTime, 'seconds')
          const qualitative_data = this.assessment.qualitative_data
          const code = document.querySelector("#patient_id").value
          const time_taken = this.assessment.time_taken
          const completed = this.completed

          const { dispatch } = this.$store
          if (time_taken) {
            dispatch('savePatientData', { qualitative_data, code, time_taken, index, completed })
          }
          this.submitted = true
          this.assessment.qualitative_data = ''
        }
      })
    },
    updateAssessmentStatus() {
      dataService.updateInstitutionAssessment()
    },
    async getPatientsToDo() {

      console.group('getPatientsToDo()')

      let patientResponse = await patientStore().getCompletePatientDetails(undefined)
      patientResponse.message && this.errorAlertModal.show(patientResponse.message)

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

<style scoped></style>
