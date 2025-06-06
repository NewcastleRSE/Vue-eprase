<template>
  <main class="leftalign">

    <TabHeader :showIndex="1" />

    <div class="content p-4">

      <LoginInfo />

      <h1 class="h2">Assessment Patient Preparation</h1>
      <p>In preparation for the assessment, please complete the following tasks:</p>

      <div class="p-4">
        <div>
          <h2 class="h3">Patient Data</h2>
          <p>Please admit the following test patients into your hospital's patient admissions system (or a test
            environment).</p>
          <p>Populate any other mandatory fields with appropriate self-generated information. When you are done, click
            <span class="fw-bold">Next</span> to continue.
          </p>

          <div v-if="myPatientList">
            <table id="test-patients" class="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="patient in myPatientList" v-bind:key="patient.id">
                  <td>
                    {{ patient.first_name }} {{ patient.surname }}
                  </td>
                  <td>
                    {{ patient.dob }}
                  </td>
                  <td>
                    {{ patient.gender }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="mx-auto">
        <div class="buttons">
          <p>When all of the patients have been admitted to your ePrescribing System, click <span
              class="fw-bold">Done</span>.</p>

          <p><span class="fw-bold">Please ensure you click the Done button to save your progress</span></p>
          <button type="button" class="btn btn-primary" @click="onNextClick()">
            <i class='bi bi-check2-circle pe-1'></i>Done
          </button>
        </div>
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
  name: "AssessmentPatients",
  components: {
    TabHeader,
    LoginInfo,
    AppLogo,
    ErrorAlertModal
  },
  computed: {
    ...mapStores(patientStore),
    errorAlertModal() {
      return this.$refs.errorAlertModal
    }
  },
  data() {
    return {      
      startTime: '',
      myPatientList: []
    }
  },
  methods: {   
    async onNextClick() {
      const time_taken = dayjs().diff(this.startTime, 'seconds')
      const patientService = patientStore()
      const saveResponse = await patientService.saveCreatePatients(time_taken)
      if (saveResponse.status < 400) {
        rootStore().audit('Add patient list', '/assessmentpatients')
        this.$router.push('/assessmentpatientdetails')
      } else {
        this.errorAlertModal.show(saveResponse.message)
      }
    },
    async getPatients() {

      console.group('getPatients()')

      const patientType = this.$route.params.type || null
      const patientService = patientStore()
      console.debug('Patient type', patientType)

      let patientResponse = await patientService.getCompletePatientDetails(false, patientType)
      if (patientResponse.status < 400) {
        if (patientType != null) {
          // Coming from completing the system information screen - save the ids
          const patientIds = patientResponse.data.map(p => p.id).join(',')
          const saveIdsResponse = await patientService.savePatientList(patientIds)
          if (saveIdsResponse.status < 400) {
            this.myPatientList = patientResponse.data
            rootStore().audit('Create patient and test list', '/setpatients/' + patientType);
          } else {
            this.errorAlertModal.show(saveIdsResponse.message)
          }
        }        
      } else {
        this.errorAlertModal.show(patientResponse.message)
      }

      console.groupEnd()
    }
  },
  created: function () {
    this.startTime = dayjs()
  },
  mounted() {
    this.getPatients()
  }
}
</script>

<style scoped>
</style>
