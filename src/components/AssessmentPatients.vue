<template>
  <main class="leftalign">

    <TabHeader :showIndex="1" />

    <div class="content p-4">

      <LoginInfo />

      <h3>Assessment Patient Preparation</h3>
      <p>In preparation for the assessment, please complete the following tasks:</p>

      <div class="p-4">
        <div>
          <h4>Patient Data</h4>
          <p>Please admit the following test patients into your hospital's patient admissions system (or a test
            environment).</p>
          <p>Populate any other mandatory fields with appropriate self-generated information. When you are done, click
            <span class="fw-bold">Next</span> to continue.</p>

          <div v-if="patients">
            <table id="test-patients" class="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="patient in patients.patientList" v-bind:key="patient.id">
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

      <div class="form-group footer mx-auto">
        <div class="buttons">
          <p>When all of the patients have been admitted to your ePrescription System, click <strong>Done</strong>.</p>

          <p><strong>Please ensure you click the Done button to save your progress</strong></p>
          <!-- <button type="button" class="exit-btn btn btn-primary"  id="exit-button" @click="onExitClick()">Exit</button>-->
          <button type="button" class="next-btn btn btn-primary" id="next-button" @click="onNextClick()">Done</button>
        </div>
      </div>

    </div>

    <ExitModal :showActionBtn="true" @modal-closed="exitModalClose()" @modal-actioned="exit()" />
    <ErrorAlertModal v-if="errorText != ''" :errorText="errorText" @modal-closed="errorAlertModalClose()" />
    <AppLogo cls="bottomright" />

  </main>
</template>

<script>

import { dataService } from '../services/data.service'
import AppPatients from './AppPatients'
import AppLogo from "./AppLogo"
import TabHeader from './TabHeader'
import LoginInfo from './LoginInfo'
import { patientService } from "../services/patient.service"
import ErrorAlertModal from './ErrorAlertModal'
import ExitModal from "./ExitModal"

export default {
  name: "AssessmentPatients",
  components: {
    TabHeader,
    LoginInfo,
    AppLogo,
    ErrorAlertModal,
    ExitModal
  },
  computed: {
    user() {
      return this.$store.state.authentication.user
    },
    patients() {
      return this.$store.state.patientList
    }

  },
  data() {
    return {
      submitted: false,
      assessment: {
        time_taken: ''
      },
      startTime: '',
      myPatientList: [],
      showExitModal: false,
      errorText: ''
    }
  },
  methods: {
    exitModalClose() {
      this.showExitModal = false
    },
    errorAlertModalClose() {
      this.errorText = ''
    },
    exit() {
      this.showExitModal = true
      this.$router.push('/logout')
    },
    resetForm: function () {
      this.$data.assessment = {}
      this.errors.clear()
    },
    
    onNextClick() {
      this.submitted = true

      this.$validator.validate().then(valid => {
        if (valid) {

          let endTime = new Date()
          let elapsedTime = endTime.getTime() - this.startTime.getTime()
          this.assessment.time_taken = elapsedTime / 1000
          const time_taken = this.assessment.time_taken
          const { dispatch } = this.$store
          if (time_taken) {
            dispatch('saveCreatePatients', { time_taken })
          }

          // audit
          dataService.audit('Add patient list', '/assessmentpatients')
          this.$router.push({ path: './assessmentpatientdetails' })
        }
      })
    },
    getPatients() {
      return this.patients
    },
    savePatientIds() {

      // use computed value of patients
      let patients = this.patients
      let patient_list = ''

      for (let index in patients.patientList) {
        if (patients.patientList.hasOwnProperty(index)) {
          patient_list += patients.patientList[index].id + ','
        }
      }
      dataService.savePatientList(patient_list)
      dataService.audit('save patient list', '/assessmentpatients')
    }
  },
  created: function () {
    this.startTime = new Date()
  },
  mounted() {
    // TODO make this conditional
    setTimeout(() => {
      this.savePatientIds()
    }, 1000),

      history.pushState(null, null, location.href)
    window.onpopstate = function () {
      history.go(1)
    }
  }
}
</script>

<style scoped>
#page {
  text-align: left;
}

#content {
  padding: 40px;
}

h4 {
  font-weight: bold;
  text-align: left;
  padding-top: 25px;
}

.patient-info p {
  text-align: left;
}

.assessment {
  padding-bottom: 20px;
}

.assessment p {
  text-align: left;
}

input {
  width: 200px;
  margin-right: 35px;
  float: right;
}

select {
  width: 200px;
  margin-right: 35px;
  float: right;
}


#patient-intervention {
  width: 100%;
  height: 100px;
}

button {
  height: 40px;
  width: 100px;
  font-size: 1.2em;
  margin: 0 50px;
}

.exit-btn,
.next-btn {
  background-color: #029a99;
  border: 0;
}

.footer {
  margin-top: 10px;
  margin-bottom: 40px;
}

.footer p {
  padding-bottom: 10px;
}

.alert-warning {
  background-color: #f6ecb8;
  border-color: #ffd47d;
}
</style>
