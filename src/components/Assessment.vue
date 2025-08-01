<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="image showing white pills"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE Assessment {{ year }}</h1>

      <Vueform ref="assessmentStepsForm" validate-on="change|step" v-model="allFormData" sync>
        <template #empty>
          <FormSteps ref="assessmentSteps" @next="nextStep" @previous="previousStep" @select="selectStep">
            <FormStep name="epraseIntroStep" label="Introduction to ePRaSE" 
              :elements="['epraseIntroEl']"
              :buttons="{ previous: false }"
              :labels="{ next: 'Continue to assessment selection' }" />
            <FormStep name="selectAssessmentStep" label="Start or continue an assessment" 
              :elements="['selectAssessmentEl']" 
              :buttons="{ previous: false, next: assessmentOption != 'continue' }"
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
            <AssessmentIntro name="epraseIntroEl" v-if="activeStep == 0" />
            <AssessmentSelection name="selectAssessmentEl" v-if="activeStep == 1" @jump-to-step="goToStep" />
            <AssessmentSystem name="systemInfoEl" v-if="activeStep == 2" />
            <AssessmentPatientBuild name="patientBuildEl" v-if="activeStep == 3" />
            <AssessmentScenario name="scenarioEl" v-if="activeStep == 4" />
            <AssessmentConfigError name="configErrorEl" v-if="activeStep == 5" />
          </FormElements>
          <FormStepsControls ref="assessmentStepsControl" /> 
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
    ...mapState(assessmentStore, ['assessmentData', 'assessmentStateIndex']),
    assessmentId() {
      return this.assessmentData.selection.assessmentId
    },
    assessmentOption() {
      return this.assessmentData.selection.assessmentOption
    },
    assessmentState() {
      return this.assessmentData.assessmentState
    },
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
      return this.$refs.assessmentSteps
    },
    formStepsControl() {
      return this.$refs.assessmentStepsControl
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
    goToStep(assessmentId) {
      console.group('goToStep()')
      console.log('Assessment ID', assessmentId, 'currently stored', this.assessmentId)
      if (this.activeStep == 1 && this.assessmentOption == 'continue') {
        // Jump to where the user left off if continuing an assessment
        console.debug('Continuing an assessment, jump to where user left off...')
        console.debug('Assessment state is', this.assessmentState)
        let toStep = null
        let enableAll = true
        switch (this.assessmentState) {      
          case 'System complete': 
            toStep ='patientBuildStep'           
            break
          case 'Patient build complete': 
            toStep = 'scenarioStep'
            break 
          case 'Scenarios complete': 
            toStep = 'configErrorStep'
            break
          case 'Config errors complete': 
            //TODO 
            break
          case 'Assessment complete':
            //TODO
            break
          default: 
            enableAll = false
            toStep = this.assessmentId == null ? 'epraseIntroStep' : 'systemInfoStep'
            break
        }
        this.formSteps.goTo(toStep, enableAll)
      }
      console.groupEnd()
    },     
    nextStep(toStep) {
      console.group('nextStep()')
      console.debug('Next step', toStep.index, 'steps by key', this.formSteps.steps$, 'steps by array', this.formSteps.steps$Array)
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
    }
  },
  mounted() {
    console.group('Assessment top-level mounted() hook')
    console.groupEnd()
  },
  errorCaptured(...args) {

    console.group('errorCaptured()')
    console.debug(args)

    // Eliminate the 'Blocked aria-hidden on an element because its descendant retained focus' error which confuses assistive technologies when a modal is displayed...
    const activeElement = document.activeElement
    if (activeElement) {
      activeElement.blur();
    }
    this.errorAlertModal.show(args[0].message)

    console.groupEnd()
    return false
  }
}
</script>

<style scoped>

.assessment-head {
   text-align: center;
}

</style>
