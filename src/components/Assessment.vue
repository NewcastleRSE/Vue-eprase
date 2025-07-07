<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="image showing white pills"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE Assessment {{ year }}</h1>

      <Vueform ref="assessmentStepsForm" validate-on="change|step" v-model="allFormData" sync>
        <template #empty>
          <FormSteps @next="nextStep" @previous="previousStep" @select="selectStep">
            <FormStep name="epraseIntroStep" label="Introduction to ePRaSE" 
              :elements="['epraseIntroEl']"
              :buttons="{ previous: false }"
              :labels="{ next: 'Continue to assessment selection' }" />
            <FormStep name="selectAssessmentStep" label="Start or continue an assessment" 
              :elements="['selectAssessmentEl']" 
              :buttons="{ previous: false }"
              :labels="{ next: 'Continue to system information' }" />
            <FormStep name="systemInfoStep" label="ePrescribing system information"               
              :elements="['systemInfoEl']" 
              :buttons="{ previous: false }"
              :labels="{ 
                next: 'Continue to patient build'
              }" />
            <FormStep name="patientBuildStep" label="Patient build" 
              :elements="['patientBuildEl']" 
              :labels="{ 
                next: 'Continue to scenarios',
                previous: 'Back to system information'
              }" />
            <FormStep name="scenarioStep" label="Scenarios" 
              :elements="['scenarioEl']" 
              :labels="{ 
                next: 'Continue to config errors',
                previous: 'Back to patient build'
              }" />
            <FormStep name="configErrorStep" label="Config errors" 
              :elements="['configErrorEl']" 
              :labels="{ 
                next: 'Continue to reports',
                previous: 'Back to scenarios'
              }" />
          </FormSteps>
          <FormElements>
            <AssessmentIntro name="epraseIntroEl" v-if="activeStep == 0" 
              @get-data-fail="reportError" />
            <AssessmentSelection name="selectAssessmentEl" v-if="activeStep == 1" 
              @get-data-fail="reportError" @save-data-fail="reportError" />
            <AssessmentSystem name="systemInfoEl" v-if="activeStep == 2" 
              @get-data-fail="reportError" @save-data-fail="reportError" />
            <AssessmentPatientBuild name="patientBuildEl" v-if="activeStep == 3" 
              @get-data-fail="reportError" @save-data-fail="reportError" />
            <AssessmentScenario name="scenarioEl" v-if="activeStep == 4" 
              @get-data-fail="reportError" @save-data-fail="reportError" />
            <AssessmentConfigError name="configErrorEl" v-if="activeStep == 5" 
              @get-data-fail="reportError" @save-data-fail="reportError" />
          </FormElements>
          <FormStepsControls /> 
        </template>
      </Vueform>

      <div class="px-4 my-4">
        <AppFooter />
      </div>
    </div>
    <AppLogo cls="bottomright" />
    <ErrorAlertModal ref="errorAlertModal" />
  </main>
</template>

<script>

import { mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { assessmentStore } from '../stores/assessment'
import AssessmentIntro from './AssessmentIntro'
import AssessmentSelection from './AssessmentSelection'
import AssessmentSystem from './AssessmentSystem'
import AssessmentPatientBuild from './AssessmentPatientBuild'
import AssessmentScenario from './AssessmentScenario'
import AssessmentConfigError from './AssessmentConfigError'
import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'
import ErrorAlertModal from './ErrorAlertModal'


export default {
  name: 'Assessment',
  computed: {
    ...mapState(appSettingsStore, ['version', 'year']),
    ...mapState(assessmentStore, ['assessmentData']),
    allFormData: {
      get() {        
        return this.assessmentData
      }, 
      set(newdata) {
      }
    },
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    formSteps() {
      return this.$refs.assessmentStepsForm
    }
  },
  components: {
    AssessmentIntro,
    AssessmentSelection,
    AssessmentSystem,
    AssessmentPatientBuild,
    AssessmentScenario,
    AssessmentConfigError,
    LoginInfo,
    AppFooter,
    AppLogo,
    ErrorAlertModal
  },
  data() {
    return {   
      assessmentComplete: false,  
      allAssessments: [],
      activeStep: 0,     
      nextClicked: false,
      previousClicked: false
    }
  },
  methods: {         
    nextStep(toStep) {
      console.group('nextStep()')
      console.debug('Next step', toStep.index, 'full step', toStep)
      this.nextClicked = true      
      console.debug('Form data', this.allFormData)
      console.groupEnd()
    }, 
    previousStep(toStep) {
      console.group('previousStep()')
      console.debug('Previous step', toStep.index)
      this.previousClicked = true      
      console.groupEnd()
    }, 
    selectStep(active, previous) {
      console.group('selectStep()')
      console.debug('Active step', active.index, 'previous', previous.index)
      console.debug('Active', active)
      console.debug('Previous', previous)
      this.activeStep = active.index 
      this.nextClicked = false
      this.previousClicked = false
      console.groupEnd()
    },
    reportError(message) {
      this.errorAlertModal.show(message)
    }
  }
}
</script>

<style scoped>

.assessment-head {
   text-align: center;
}

</style>
