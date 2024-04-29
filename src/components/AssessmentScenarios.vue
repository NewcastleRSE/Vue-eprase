<template>
  <main class="leftalign">

    <TabHeader :showIndex="2" />

    <div class="content p-4">

      <LoginInfo />

      <h3>Assessment Scenarios</h3>
      <p class="pb-2">You have completed the initial phase of the assessment. The next stage is to complete the patient
        scenarios.</p>
      <p class="pb-2">Please follow the instructions for each scenario</p>
      <div class="mx-auto" v-if="test != null">
        <div id="test-header">Test {{ testIndex + 1 }} of {{ myTestList.length }}</div>

        <ScenarioPrescription v-if="!test.configErrorCode" :prescription="test"></ScenarioPrescription>
        <ConfigError v-if="test.configErrorCode" :config="test"></ConfigError>
      </div>
      <div class="my-2">
        <h5 v-if="testIndex == myTestList.length - 1">Congratulations, you have reached the end of the scenarios!</h5>
        <button type="button" class="btn btn-primary" @click="nextTest()">{{ testIndex < myTestList.length - 1 ? 'Next'
      : 'Done' }}</button>
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
      test: null,
      testIndex: 0
    }
  },
  methods: {
    async getPatientTests() {

      console.group('getPatientTests()')

      const patientResponse = await this.patientService.getCompletePatientDetails(true)
      if (patientResponse.status < 400) {
        console.debug(this.myTestList)
        this.test = this.myTestList[0]
      } else {
        this.errorAlertModal.show(patientResponse.message)
      }

      console.groupEnd()
    },
    async nextTest() {

    }
  },
  mounted() {
    this.getPatientTests()    
  }
}
</script>

<style scoped></style>
