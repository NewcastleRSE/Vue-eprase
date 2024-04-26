<template>
  <main class="leftalign">

    <TabHeader :showIndex="2" />

    <div class="content p-4">

      <LoginInfo />

      <h3>Assessment Scenarios</h3>
      <p class="pb-2">You have completed the initial phase of the assessment. The next stage is to complete the patient scenarios.</p>
      <p class="pb-2">Please follow the instructions for each scenario</p>
      <div class="mx-auto">
        <div id="test-header">Test {{ getCurrentTestIndex + 1 }} of {{ numPrescriptions }}</div>

        <ScenarioPrescription v-if="assessment.isPrescriptionTest"></ScenarioPrescription>
        <ConfigError v-if="assessment.isConfigErrorTest"></ConfigError>
      </div>
    </div>
    <AppLogo></AppLogo>
  </main>

</template>

<script>

import { settings } from '../settings'
import ScenarioPrescription from "./ScenarioPrescription"
import ConfigError from "./ConfigError"
import TabHeader from "./TabHeader"
import AppLogo from "./AppLogo"

export default {
  name: "AssessmentScenarios",
  components: {
    ScenarioPrescription,
    ConfigError,
    TabHeader,
    AppLogo
  },
  computed: {
    getCurrentTestIndex() {
      return this.$store.state.testIndex
    }
  },
  data() {
    return {
      assessment: {
        isPrescriptionTest: true,
        isConfigErrorTest: false
      },
      numPrescriptions: parseInt(localStorage.getItem('numPrescriptions')) + settings.numConfigError
    }
  },
  methods: {
    async getPatientTests() {

      console.group('getPatientTests()')

      let patientResponse = await patientStore().getCompletePatientDetails(null, true, true, true)
      patientResponse.message && this.errorAlertModal.show(patientResponse.message)

      console.groupEnd()
    }
  },
  beforeUpdate: function () {
    let index = this.$store.state.testIndex
    let tests = this.$store.state.testList
    let currentTest = tests.testList[index]

    if (currentTest !== undefined) {
      // make sure we get the right type of test
      if (currentTest.hasOwnProperty('configErrorCode')) {
        this.assessment.isPrescriptionTest = false
        this.assessment.isConfigErrorTest = true
      }
      else {
        this.assessment.isPrescriptionTest = true
        this.assessment.isConfigErrorTest = false
      }
    }
  },
  mounted: function () {
    history.pushState(null, null, location.href)
    window.onpopstate = function () {
      history.go(1)
    }
  }
}
</script>

<style scoped>
#test-header {
  font-size: 1.8em;
  font-weight: 700;
  padding-bottom: 25px;
}

#page {
  text-align: left;
}

#content {
  padding: 40px;
}
</style>
