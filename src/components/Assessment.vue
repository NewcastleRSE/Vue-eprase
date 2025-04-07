<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/pills-bw.png" alt="image showing white pills"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE Assessment {{ year }}</h1>

      <Vueform ref="assessmentStepsForm">
        <template #empty>
          <FormSteps>
            <FormStep name="intro" label="Introduction to ePRaSE" :elements="['intro']" :labels="{ next: 'Continue to system information' }" />
            <FormStep name="system" label="ePrescribing system information" :elements="['system']" :labels="{ next: 'Continue to patient build' }" />
            <FormStep name="patients" label="Patient build">Patient build here...</FormStep>
          </FormSteps>
          <FormElements>
            <StaticElement name="intro">
              <AssessmentIntro />
            </StaticElement>
            <StaticElement name="system">
              <AssessmentSystem />
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
import AssessmentIntro from './AssessmentIntro'
import AssessmentSystem from './AssessmentSystem'
import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'
import ErrorAlertModal from './ErrorAlertModal'

export default {
  name: "Assessment",
  computed: {
    ...mapState(appSettingsStore, ['version', 'year']),    
    errorAlertModal() {
      return this.$refs.errorAlertModal
    }
  },
  components: {
    AssessmentIntro,
    AssessmentSystem,
    LoginInfo,
    AppFooter,
    AppLogo,
    ErrorAlertModal
  },
  data() {
    return {     
      assessmentComplete: false 
    }
  },
  methods: {    
  },
  mounted() {
    console.debug('Form',this.$refs.assessmentStepsForm)
  }
}
</script>

<style scoped>

.assessment-head {
   text-align: center;
}

</style>
