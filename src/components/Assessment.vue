<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="image showing white pills"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE Assessment {{ year }}</h1>

      <Vueform ref="assessmentStepsForm" :endpoint="false">
        <template #empty>
          <FormSteps @next="nextStep" @select="selectStep">
            <FormStep name="intro" label="Introduction to ePRaSE" :elements="['intro']" :labels="{ next: 'Continue to assessment selection' }" />
            <FormStep name="selectAssessment" label="Start or continue an assessment" :elements="['selectAssessment']" :labels="{ next: 'Continue to system information' }" />
            <FormStep name="system" label="ePrescribing system information" :elements="['system']" :labels="{ next: 'Continue to patient build' }" />
            <FormStep name="patients" label="Patient build">Patient build here...</FormStep>
          </FormSteps>
          <FormElements>
            <StaticElement name="intro">
              <AssessmentIntro />
            </StaticElement>
            <StaticElement name="selectAssessment">
              <AssessmentSelection v-if="activeStep == 1" />
            </StaticElement>
            <StaticElement name="system">
              <AssessmentSystem v-if="activeStep == 2" />
            </StaticElement>              
          </FormElements>
          <FormStepsControls /> 
        </template>
      </Vueform>

      <div class="px-4 my-4">
        <AppFooter :allowReports="assessmentComplete" />
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
import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'
import ErrorAlertModal from './ErrorAlertModal'

export default {
  name: 'Assessment',
  computed: {
    ...mapState(appSettingsStore, ['version', 'year']),
    ...mapState(assessmentStore, ['getAssessmentsForInstitution']),
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
      console.groupEnd()
    }, 
    selectStep(active, previous) {
      console.group('selectStep()')
      console.debug('Active step', active.index, 'previous', previous.index)
      this.activeStep = active.index
      console.groupEnd()
    }  
  },
  async mounted() {
    console.group('Assessment mounted hook')
    const instResponse = this.getAssessmentsForInstitution()
    if (instResponse.status < 400) {
      this.allAssessments = instResponse.data.data
    } else {
      this.errorAlertModal.show(instResponse.message)
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
