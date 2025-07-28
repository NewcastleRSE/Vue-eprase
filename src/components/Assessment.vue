<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="image showing white pills"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE Assessment {{ year }}</h1>

      <Vueform ref="assessmentStepsForm" validate-on="change|step" v-model="allFormData" sync>
        <template #empty>
          <FormSteps ref="assessmentStepsControl" @next="nextStep" @previous="previousStep" @select="selectStep">
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
            <AssessmentSelection name="selectAssessmentEl" v-if="activeStep == 1" />
            <AssessmentSystem name="systemInfoEl" v-if="activeStep == 2" />
            <AssessmentPatientBuild name="patientBuildEl" v-if="activeStep == 3" />
            <AssessmentScenario name="scenarioEl" v-if="activeStep == 4" />
            <AssessmentConfigError name="configErrorEl" v-if="activeStep == 5" />
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
    ...mapState(assessmentStore, ['assessmentData', 'assessmentStateIndex']),
    assessmentId() {
      return this.assessmentData.assessmentId
    },
    assessmentOption() {
      return this.assessmentData.assessmentOption
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
      return this.$refs.assessmentStepsForm
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
    nextStep(toStep) {
      console.group('nextStep()')
      console.debug('Next step', toStep.index, 'full step', toStep)
      this.nextClicked = true
      if (this.activeStep == 1 && this.assessmentOption == 'continue') {
        // Jump to where the user left off if continuing an assessment
        console.debug('Continuing an assessment, jump to where user left off...')
        console.debug('Assessment state is', this.assessmentState)
        switch (this.assessmentState) {      
          case 'System complete':
            this.formStepsControl.goTo('patientBuildStep', true) 
            break
          case 'Patient build complete':
            this.formStepsControl.goTo('scenarioStep', true) 
            break 
          case 'Scenarios complete':
            this.formStepsControl.goTo('configErrorStep', true) 
            break
          case 'Config errors complete':
            //TODO
            break
          case 'Assessment complete':
            //TODO
            break
          default: 
            if (this.assessmentId == null) {
              // No assessment data present, so start from beginning
              this.formStepsControl.goTo('epraseIntroStep', false)
            } else {
              // An assessment has been started but no data has yet been entered
              this.formStepsControl.goTo('systemInfoStep', false)
            }
            break
        }
      }
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
