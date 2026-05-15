<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/EPrase banner-01.jpg" alt="ePRaSE banner"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE {{ year }} - Practice Mode</h1>

      <Vueform ref="assessmentPracticeForm">
        <template #empty>
          <PatientBuild v-show="!scenarioEntryStarted" :noPatients="1" @all-patients-entered="setPatientEntryComplete" />
          <StaticElement v-show="patientEntryComplete && !scenarioEntryStarted" name="patientListEntryComplete">
            <div class="alert alert-info" role="alert">
              You have now completed all the patient entries, please click 'Continue to Scenarios' below to begin entering the prescription scenarios
            </div>
            <ButtonElement name="continueToScenarios" :columns="4" @click="scenarioEntryStarted = true">Continue to Scenarios</ButtonElement>              
          </StaticElement>
          <Scenario v-show="scenarioEntryStarted" @all-scenarios-completed="setScenariosComplete" />
        </template>
      </Vueform>
      <div class="px-4 my-4">
        <AppFooter />
      </div>    
    </div>
    <AppLogo cls="bottomright" />
  </main>  
</template>

<script>

import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'
import PatientBuild from './practice/PatientBuild'
import Scenario from './practice/Scenario'
import { mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { practiceStore } from '../stores/practice'

export default {
  name: 'AssessmentPractice', 
  computed: {
    ...mapState(appSettingsStore, ['year']),
    ...mapState(practiceStore, ['reset'])
  }, 
  components: {
    LoginInfo,
    AppFooter,
    AppLogo,
    PatientBuild,
    Scenario
  },
  data() {
    return {
      patientEntryComplete: false,
      scenarioEntryStarted: false,
      scenarioEntryComplete: false
    }    
  },
  methods: {
    setPatientEntryComplete() {
      this.patientEntryComplete = true
    },
    setScenariosComplete() {
      this.scenarioEntryComplete = true
    }
  },
  async mounted() {
    console.group('AssessmentPractice mounted hook')
    this.reset()    
    console.groupEnd()
  }
}
</script>

<style scoped>
.assessment-head {
  text-align: center;
}
</style>
