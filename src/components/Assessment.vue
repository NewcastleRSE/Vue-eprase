<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.jpg" alt="image showing white pills"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE Assessment {{ year }}</h1>

      <Vueform ref="assessmentStepsForm" validate-on="change|step" v-model="allFormData" sync>
        <template #empty>
          <FormSteps ref="assessmentSteps" @next="nextStep" @previous="previousStep" @select="selectStep">
            <FormStep name="epraseIntroStep" label="Introduction to ePRaSE" 
              :elements="['epraseIntroEl']"
              :buttons="{ previous: false }"
              :labels="{ next: 'Continue to Assessment Selection' }" />
            <FormStep name="selectAssessmentStep" label="Start Or Continue<br>Assessment" 
              :elements="['selectAssessmentEl']" 
              :buttons="{ previous: false, next: assessmentOption != 'continue' }"
              :labels="{ next: 'Continue to System Information' }" />
            <FormStep name="systemInfoStep" label="ePrescribing System<br>Information"               
              :elements="['systemInfoEl']" 
              :buttons="{ previous: false }"
              :labels="{ 
                next: 'Continue to Patient Build'
              }" />
            <FormStep name="patientBuildStep" label="Patient Build" 
              :elements="['patientBuildEl']" 
              :labels="{ 
                next: 'Continue to Scenarios',
                previous: 'Back to ePrescribing System Information'
              }" />
            <FormStep name="scenarioStep" label="Scenarios" 
              :elements="['scenarioEl']" 
              :labels="{ 
                next: 'Continue to Configuration Questions',
                previous: 'Back to Patient Build'
              }" />
            <FormStep name="configQuestionStep" label="Configuration Questions" 
              :elements="['configQuestionEl']" 
              :labels="{ 
                next: 'Continue to Reports',
                previous: 'Back to Scenarios'
              }" />
            <FormStep name="finalReportStep" label="Final Report" 
              :elements="['finalReportEl']" 
              :buttons="{ next: false, finish: true }"
              :labels="{ 
                finish: 'Complete assessment',
                previous: 'Back to Configuration Questions'
              }" />
          </FormSteps>
          <FormElements>
            <AssessmentIntro name="epraseIntroEl" v-if="activeStep == 0" />
            <AssessmentSelection name="selectAssessmentEl" v-if="activeStep == 1" @jump-to-step="goToStep" />
            <AssessmentSystem name="systemInfoEl" v-if="activeStep == 2" />
            <AssessmentPatientBuild name="patientBuildEl" v-if="activeStep == 3" />
            <AssessmentScenario name="scenarioEl" v-if="activeStep == 4" />
            <AssessmentConfigQuestion name="configQuestionEl" v-if="activeStep == 5" />
            <AssessmentFinalReport name="finalReportEl" v-if="activeStep == 6" />
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
import AssessmentConfigQuestion from './AssessmentConfigQuestion'
import AssessmentFinalReport from './AssessmentFinalReport'
import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'
import ErrorAlertModal from './ErrorAlertModal'

export default {
  name: 'Assessment',
  computed: {
    ...mapState(appSettingsStore, ['version', 'year']),
    ...mapState(assessmentStore, ['assessmentData', 'assessmentStateIndex', 'getCategoryDetails', 'getMitigationDetails', 'getConfigQuestionDetails']),
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
    AssessmentConfigQuestion,
    AssessmentFinalReport,
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
            toStep = 'configQuestionStep'
            break
          case 'Config errors complete':             
          case 'Assessment complete':
            toStep = 'finalReportStep'
            break
          default: 
            console.assert(this.assessmentState == 'Not started')
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
  async mounted() {
    console.group('Assessment top-level mounted() hook')
    // Get mitigation and category base data
    const mitResponse = await this.getMitigationDetails()
    if (mitResponse !== true) {
      throw new Error(mitResponse)
    }
    const catResponse = await this.getCategoryDetails()
    if (catResponse !== true) {
      throw new Error(catResponse)
    }    
    const configResponse = await this.getConfigQuestionDetails()
    if (configResponse !== true) {
      throw new Error(configResponse)
    }
    console.groupEnd()
  },
  // errorCaptured(...args) {

  //   console.group('errorCaptured()')
  //   console.debug(args)

  //   // Eliminate the 'Blocked aria-hidden on an element because its descendant retained focus' error which confuses assistive technologies when a modal is displayed...
  //   const activeElement = document.activeElement
  //   if (activeElement) {
  //     activeElement.blur();
  //   }
  //   this.errorAlertModal.show(args[0].message)

  //   console.groupEnd()
  //   return false
  // }
}
</script>

<style scoped>

.assessment-head {
   text-align: center;
}

</style>
