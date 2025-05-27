<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="image showing white pills"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE Assessment {{ year }}</h1>

      <Vueform ref="assessmentStepsForm" validate-on="change|step" v-model="allFormData" sync>
        <template #empty>
          <FormSteps @next="nextStep" @select="selectStep">
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
              :labels="{ 
                next: 'Continue to patient build',
                previous: 'Back to assessment selection' 
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
                next: 'Continue to reports',
                previous: 'Back to patient build'
              }" />
          </FormSteps>
          <FormElements>            
            <AssessmentIntro name="epraseIntroEl" v-show="activeStep == 0" :isActive="activeStep == 0" />
            <AssessmentSelection name="selectAssessmentEl" v-show="activeStep == 1" :isActive="activeStep == 1" />
            <AssessmentSystem name="systemInfoEl" v-show="activeStep == 2" :isActive="activeStep == 2" @get-data-fail="reportError" />
            <AssessmentPatientBuild name="patientBuildEl" v-show="activeStep == 3" :isActive="activeStep == 3" @get-data-fail="reportError" />
            <AssessmentScenario name="scenarioEl" v-show="activeStep == 4" :isActive="activeStep == 4" @get-data-fail="reportError" />
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

import { mapState, mapStores } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import { assessmentStore } from '../stores/assessment'
import AssessmentIntro from './AssessmentIntro'
import AssessmentSelection from './AssessmentSelection'
import AssessmentSystem from './AssessmentSystem'
import AssessmentPatientBuild from './AssessmentPatientBuild'
import AssessmentScenario from './AssessmentScenario'
import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'
import ErrorAlertModal from './ErrorAlertModal'


export default {
  name: 'Assessment',
  computed: {
    ...mapState(appSettingsStore, ['version', 'year']),
    ...mapStores(assessmentStore),
    allFormData: {
      get() {        
        return assessmentStore().assessmentData
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
    LoginInfo,
    AppFooter,
    AppLogo,
    ErrorAlertModal
  },
  data() {
    return {   
      assessmentComplete: false,  
      allAssessments: [],
      activeStep: 0
    }
  },
  methods: {      
    nextStep(toStep) {
      console.group('nextStep()')
      console.debug('Next step', toStep.index)      
      console.debug(this.allFormData)
      console.groupEnd()
    }, 
    selectStep(active, previous) {
      console.group('selectStep()')
      console.debug('Active step', active.index, 'previous', previous.index)
      this.activeStep = active.index      
      console.groupEnd()
    },
    reportError(message) {
      this.errorAlertModal.show(message)
    }
  },
  async mounted() {
    console.group('Assessment mounted hook')
    const instResponse = await assessmentStore().getAssessmentsForInstitution()
    if (instResponse !== true) {      
      this.reportError(instResponse)
    }
    console.groupEnd()
  }
}
</script>

<style scoped>

.assessment-head {
   text-align: center;
}

</style>
