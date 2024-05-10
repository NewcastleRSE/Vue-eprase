<template>
  <main class="leftalign">

    <TabHeader :showIndex="2" />

    <div class="content p-4">

      <LoginInfo />

      <h3>Assessment Scenarios</h3>

      <div v-if="testIndex == 0">
        <p class="pb-2">You have completed the initial phase of the assessment. The next stage is to complete the patient scenarios.</p>
        <p class="pb-2">Please follow the instructions for each scenario</p>
      </div>
      
      <div class="mx-auto" v-if="test != null">
        <div id="test-header">Test {{ testIndex + 1 }} of {{ myTestList.length }}</div>
        <component @test-save-ok="nextTest" @test-save-fail="reportError" :is="currentForm" :testPayload="test" :isLast="testIndex == myTestList.length - 1" ref="currentDisplayForm"></component>
        <h5 v-if="testIndex == myTestList.length - 1">Congratulations, you have reached the end of the scenarios!</h5>
      </div>      
    </div>
    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />
  </main>

</template>

<script>

import { mapStores } from 'pinia'
import { patientStore } from '../stores/patients'
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
    ...mapStores(patientStore),
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    patientService() {
      return patientStore()
    },    
    myTestList() {
      return this.patientService.testList //pro-tem
    }
  },
  data() {
    return {
      isValid: false,
      test: null,
      testIndex: 0,
      currentForm: 'ScenarioPrescription'
    }
  },
  methods: {  
    async getPatientTests() {

      console.group('getPatientTests()')

      const patientResponse = await this.patientService.getCompletePatientDetails(true)
      if (patientResponse.status < 400) {
        this.test = this.myTestList[0]
      } else {
        this.errorAlertModal.show(patientResponse.message)
      }

      console.groupEnd()
    },
    nextTest() {

      console.group('nextTest()')

      this.$refs.currentDisplayForm.onResetClick()
      this.test = this.myTestList[++this.testIndex]
      this.currentForm = this.test.configErrorCode ? 'configError' : 'scenarioPrescription'

      console.groupEnd()
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
