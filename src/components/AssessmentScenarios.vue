<template>
  <main class="leftalign">

    <TabHeader :showIndex="2" />

    <div class="content p-4">

      <LoginInfo />

      <h1>Assessment Scenarios</h1>

      <div v-if="noTestsDone == 0">
        <p class="pb-2">You have completed the initial phase of the assessment. The next stage is to complete the patient scenarios.</p>
        <p class="pb-2">Please follow the instructions for each scenario</p>
      </div>
      <div v-if="noTestsDone != 0">
        <p class="pb-2">You have completed {{ noTestsDone }} scenarios of {{ totalNumTests }}</p>
      </div>
      
      <div class="mx-auto" v-if="test != null">
        <h2>Test {{ noTestsDone + 1 }} of {{ totalNumTests }}</h2>
        <component @test-save-ok="nextTest" @test-save-fail="reportError" :is="currentForm" :categories="categories" :testPayload="test" :isLast="this.testIndex == this.myTestList.length - 1" ref="currentDisplayForm"></component>
        <h3 v-if="noTestsDone == totalNumTests">Congratulations, you have reached the end of the scenarios!</h3>
      </div>      
    </div>
    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />
  </main>

</template>

<script>

import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'
import { patientStore } from '../stores/patients'
import { appSettingsStore } from '../stores/appSettings'
import ScenarioPrescription from "./ScenarioPrescription"
import ConfigError from "./ConfigError"
import TabHeader from "./TabHeader"
import LoginInfo from './LoginInfo'
import AppLogo from "./AppLogo"
import ErrorAlertModal from './ErrorAlertModal'

export default {
  name: "AssessmentScenarios",
  components: {
    ScenarioPrescription,
    ConfigError,
    TabHeader,
    LoginInfo,
    AppLogo,
    ErrorAlertModal
  },
  computed: {
    ...mapStores(patientStore, rootStore, appSettingsStore),
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    patientService() {
      return patientStore()
    },    
    myTestList() {
      return this.patientService.testList
    },    
    totalNumPrescriptions() {
      return appSettingsStore().numPrescriptions
    },
    totalNumConfigErrors() {
      return appSettingsStore().numConfigError
    },
    totalNumTests() {
      return this.totalNumPrescriptions + this.totalNumConfigErrors
    },
    noTestsDone() {
      // Total number minus those still to do
      return this.totalNumTests - this.myTestList.length + this.testIndex
    }
  },
  data() {
    return {
      isValid: false,
      categories: [],
      test: null,
      testIndex: 0,
      currentForm: 'ScenarioPrescription'
    }
  },
  methods: {  
    async getPatientTests() {

      console.group('getPatientTests()')

      const catResponse = await rootStore().getCategories()
      if (catResponse.status < 400) {
        this.categories = catResponse.data
        const patientResponse = await this.patientService.getCompletePatientDetails(true)
        if (patientResponse.status < 400) {
          if (this.myTestList.length == 0) {
            // Done them all => results page
            this.$router.push('/assessmentresults')
          } else {
            // Some more to do
            this.test = this.myTestList[0]
            this.currentForm = this.test.configErrorCode ? 'configError' : 'scenarioPrescription'
          }        
        } else {
          this.reportError(patientResponse.message)
        }
      } else {
        this.reportError(catResponse.message)
      }

      console.groupEnd()
    },
    nextTest() {

      console.group('nextTest()')

      if (this.testIndex < this.myTestList.length - 1) {
        // Move onto the next test or config error
        this.$refs.currentDisplayForm.onResetClick()
        this.test = this.myTestList[++this.testIndex]
        console.debug('Advanced to test', this.testIndex, 'test data is', this.test)
        console.assert(this.test != undefined, 'Test data is undefined!')
        this.currentForm = this.test.configErrorCode ? 'configError' : 'scenarioPrescription'
        console.groupEnd()
      } else {
        // 'Done' button has been clicked => move to reports
        rootStore().audit('Completed scenarios', '/assessmentscenarios')
        console.groupEnd()
        this.$router.push('/assessmentresults')
      }            
    },
    reportError(message) {
      this.errorAlertModal.show(message)
    }
  },
  mounted() {
    this.getPatientTests() 
  }
}
</script>

<style scoped></style>
