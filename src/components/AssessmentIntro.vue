<template>
  <main class="leftalign">

    <div class="pills-banner" :style="{ 'background-image': 'url(' + pillsImage + ')' }"></div>

    <LoginInfo />

    <h1 class="px-4">Welcome to the ePRaSE Assessment</h1>

    <div class="px-4" v-if="!assessmentComplete">

      <p>
        The following assessment is designed to evaluate the performance of an e-prescription system against a range of
        indicators.
      </p>

      <p>The ePRaSE assessment will be repeated annually.</p>

      <h4>Instructions</h4>
      <p>
        The assessment comprises 4 parts. You will be asked to admit a series of test patients to hospital's admissions
        system and then to prescribe a series of medications to those patients. You will then be asked to provide
        feedback mabout any advice or intervention from the system.
      </p>

      <p>The patient build has 2 parts, which may take up to an hour depending on your system.</p>

      <ul class="list-group">
        <li class="list-group-item">Part 1 - creating patients with name, date of birth and gender</li>
        <li class="list-group-item">Part 2 - adding clinical information for each patient</li>
      </ul>

      <div class="alert alert-warning mt-4" role="alert">
        <p>
          <span class="text-dark-emphasis">Disclaimer:</span> these patients have been designed to support the test tool
          and may not necessarily resemble real life. Please enter all information exactly as presented.
        </p>
      </div>

      <h3>{{ year }} ePRaSE Assessment</h3>
      <p>To take part in the current ePRaSE assessment, click the button below.</p>

      <div v-if="assessmentStatus" class="text-secondary-emphasis"> Your organisation ASSESSMENT STATUS is : {{
      assessmentStatus }}</div>

      <div v-if="assessmentStatus != 'Fully Complete'" class="pt-4">
        <button class="start-btn btn btn-primary" v-if="assessmentStatus === 'Not Started'"
          @click="onStartAssessmentClick()">Begin {{ year }} Assessment</button>
        <button class="btn btn-primary"
          v-if="assessmentStatus != 'Not Started' && assessmentStatus !== 'Fully Complete'"
          @click="onStartAssessmentClick()">Continue {{ year }} Assessment</button>
      </div>
    </div>

    <div class="px-4" v-if="assessmentComplete">

      <h2>Assessment Complete</h2>
      <div class="pt-4">
        <p>Thank you for taking part in the {{ year }} ePRaSE Assessment.</p>
        <p>To view the results of this assessment, click the 'Reports' button below.</p>
        <p>This assessment will be repeated annually, you will be informed by email when the next assessment is
          available.
        </p>
      </div>
    </div>

    <div class="px-4 my-4">
      <AppFooter :allowReports="assessmentComplete" />
    </div>
    <AppLogo cls="bottomright" />
    <ErrorAlertModal ref="errorAlertModal" />
  </main>
</template>

<script>

import { mapState, mapStores } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { rootStore } from '../stores/root'
import { patientStore } from '../stores/patients'
import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'
import ErrorAlertModal from './ErrorAlertModal'

export default {
  name: "AssessmentIntro",
  computed: {
    ...mapState(appSettingsStore, ['version', 'year']),
    ...mapStores(rootStore, patientStore),
    pillsImage() {
      return '/pills-bw.png'
    },
    errorAlertModal() {
      return this.$refs.errorAlertModal
    }
  },
  components: {
    LoginInfo,
    AppFooter,
    AppLogo,
    ErrorAlertModal
  },
  data() {
    return {
      assessmentComplete: false,
      assessmentStatus: '',
      assessmentId: ''
    }
  },
  methods: {
    async checkAssessmentProgress() {

      console.group('checkAssessmentProgress()')

      const response = await rootStore().getAssessmentProgress()
      if (response.status < 400) {
        this.assessmentComplete = response.data.assessmentComplete
        this.assessmentStatus = response.data.assessmentStatus
        this.assessmentId = response.data.assessmentId
      } else {
        this.errorAlertModal.show(response.message)
      }

      console.debug('Assessment', this.assessmentId, 'is complete', this.assessmentComplete, 'details', this.assessmentStatus)
      console.groupEnd()
    },
    onStartAssessmentClick() {
      const patient_type = 'Adults'
      if (this.assessmentStatus === 'System Information Complete') {
        this.$router.push('/assessmentpatients/' + patient_type)
      }
      else if (this.assessmentStatus === 'Create Patients in Progress') {
        this.$router.push('/assessmentpatientdetails')
      }
      else if (this.assessmentStatus === 'Create Patients Complete') {
        this.$router.push('/assessmentscenarios')
      }
      else {
        this.$router.push('/assessmentsystem')
      }
    },
    async getRequiredPatients() {
      const response = await patientStore().getRequiredTests()
      response.message && this.errorAlertModal.show(response.message)
    }
  },
  created: function () {
    this.checkAssessmentProgress()
    this.getRequiredPatients()
    rootStore().audit('View assessment intro', '/assessmentintro')
  }
}
</script>

<style scoped>

.pills-banner {
  background-size: 100% auto;
  background-repeat: no-repeat;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  height: 80px;
  margin-bottom: 1rem;
}

</style>
