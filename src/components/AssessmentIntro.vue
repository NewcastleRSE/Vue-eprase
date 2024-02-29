<template>
  <main class="leftalign">

    <div class="pills-banner"></div>

    <div class="px-4" v-if="assessmentComplete !== true">

      <h1>Welcome to the ePRaSE Assessment</h1>

      <p>
        The following assessment is designed to evaluate the performance of an e-prescription system against a range of
        indicators.
      </p>
      <p>The ePRaSE assessment will be repeated annually.</p>

      <h4>Instructions</h4>
      <p>
        The assessment comprises 4 parts. You will be asked to admit a series of test patients to hospital's admissions
        system and then to prescribe a series of medications to those patients. You will then be asked to provide feedback
        about any
        advice or intervention from the system.
      </p>

      <p>The patient build has 2 parts, which may take up to an hour depending on your system.</p>

      <ul class="list-group">
        <li class="list-group-item">Part 1 - creating patients with name, date of birth and gender</li>
        <li class="list-group-item">Part 2 - adding clinical information for each patient</li>
      </ul>

      <div class="alert alert-warning mt-4" role="alert">
        <p>
          <span class="text-dark-emphasis">Disclaimer:</span> these patients have been designed to support the test tool
          and may not necessarily
          resemble real life. Please enter all information exactly as presented.
        </p>
      </div>

      <h3>{{ year }} ePRaSE Assessment</h3>
      <p>The original ePRaSE assessment was released in July 2019. <br />To take part in the current ePRaSE assessment,
        click the button below.</p>

      <div v-if="assessmentStatus" class="text-secondary-emphasis"> Your organisation ASSESSMENT STATUS is : {{
        assessmentStatus }}</div>

      <div v-if="assessmentStatus" class="pt-4">
        <button class="start-btn btn btn-primary" v-if="assessmentStatus === 'Not Started'"
          @click="onStartAssessmentClick()">Begin {{ year }} Assessment</button>
        <button class="btn btn-primary" v-if="assessmentStatus !== 'Not Started' && assessmentStatus !== 'Fully Complete'"
          @click="onStartAssessmentClick()">Continue {{ year }} Assessment</button>
      </div>
      <p></p>
    </div>

    <div class="px-4" v-if="assessmentComplete === true">

      <h2>Assessment Complete</h2>
      <div class="pt-4">
        <p>Thank you for taking part in the {{ year }} ePRaSE Assessment.</p>
        <p>To view the results of this assessment, click the 'Reports' button below.</p>
        <p>This assessment will be repeated annually, you will be informed by email when the next assessment is available.
        </p>
      </div>
    </div>

    <div class="px-4 mt-4">
      <AppFooter />
    </div>
    <AppLogo />
  </main>
</template>

<script>
''
import { mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { dataService } from '../services/data.service'
import { patientService } from '../services/patient.service'
import TabHeader from './TabHeader'
import AppFooter from "./AppFooter"
import AppLogo from "./AppLogo"

export default {
  name: "AssessmentIntro",
  computed: {
    ...mapState(appSettingsStore, ['version', 'year'])
  },
  components: {
    AppFooter,
    TabHeader,
    AppLogo
  },
  data() {
    return {
      assessmentComplete: false,
      assessmentStatus: '',
      assessmentId: '',
      userIsAdmin: false
    }
  },
  methods: {
    checkAssessmentComplete() {
      dataService.getAssessmentStatus().then(data => {
        this.assessmentComplete = data.status
        this.assessmentId = data.id
        localStorage.setItem('assessmentId', this.assessmentId)
      })
    },
    getAssessmentStatus() {
      dataService.getAssessmentLatestCompletedPart().then(data => {
        this.assessmentStatus = data.status
      })
    },
    onStartAssessmentClick() {
      if (this.assessmentStatus === 'System Information Complete') {
        this.$router.push('/setpatients')
      }
      else if (this.assessmentStatus === 'Create Patients in Progress') {
        this.$router.push('/assessmentpatientdetails')
      }
      else if (this.assessmentStatus === 'Create Patients Complete') {
        this.$router.push('/lockoutscreen?patientscompleted=true')
      }
      else {
        this.$router.push('/assessmentsystem')
      }
    },
    getRequiredPatients() {

      let requiredAdultPatients = []
      let requiredChildPatients = []
      let allRequiredPatients = []

      patientService.getRequiredTests().then(data => {
        let tests = data
        for (let test in tests) {
          if (tests.hasOwnProperty(test)) {
            let requiredPatient = tests[test].patient
            requiredPatient = patientService.formatPatientData(requiredPatient)
            if (requiredPatient.age >= 18) {
              requiredAdultPatients.push(requiredPatient)
            }
            else {
              requiredChildPatients.push(requiredPatient)
            }
            allRequiredPatients.push(requiredPatient)
          }
        }
        //TODO - investigate LocalStorage usage here
        localStorage.setItem('requiredAdultPatients', JSON.stringify(requiredAdultPatients))
        /* localStorage.setItem('requiredChildPatients', JSON.stringify(requiredChildPatients)); */
        localStorage.setItem('allRequiredPatients', JSON.stringify(allRequiredPatients))
      })
    }
  },
  created: function () {
    this.checkAssessmentComplete()
    this.getAssessmentStatus()
    this.getRequiredPatients()
    dataService.audit('View assessment intro', '/assessmentintro')
  },
  mounted: function () {
    // Looks as though this disables the back button - do we still need this?
    history.pushState(null, null, location.href)
    window.onpopstate = function () {
      history.go(1)
    }
  }
}
</script>

<style scoped>
</style>
