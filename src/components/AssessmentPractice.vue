<template>
  <main class="leftalign">

    <div class="pills-banner"><img src="../assets/images/EPrase banner-01.jpg" alt="ePRaSE banner"></div>

    <div class="content p-4">

      <LoginInfo />

      <h1 class="assessment-head p-4">ePRaSE {{ year }} - Practice Mode</h1>

      <Vueform ref="assessmentPracticeForm">
        <template #empty>
          <ul class="nav nav-tabs" :id="'practice-stage-tabs'" role="tablist">
            <li v-for="(value, key, index) in practiceTabs" class="nav-item" role="presentation">
              <button 
                class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                :class="index == 0 ? 'active' : ''"                      
                :id="key + '-tab'" 
                :data-bs-target="'#practice-tab-' + key">{{ value }}                    
              </button>
            </li>                  
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade active show mt-2" :id="'practice-tab-intro'" role="tabpanel" tabindex="0">
              <PracticeIntro />
              <StaticElement name="practicePreamble">
                <ButtonElement name="continueToPatientBuild" :columns="4" @click="selectTab('patients')">Continue to Patient Entry</ButtonElement> 
              </StaticElement>
            </div>
            <div class="tab-pane fade mt-2" :id="'practice-tab-patients'" role="tabpanel" tabindex="0">
              <PatientBuild :noPatients="1" @all-patients-entered="completedPatientEntry = true" />
              <StaticElement name="patientListEntryComplete">
                <div v-show="completedPatientEntry" class="alert alert-info" role="alert">
                  You have now completed all the patient entries, please click 'Continue to Scenarios' below to begin entering the prescription scenarios.
                </div>
                <GroupElement name="patientbuttonBar" :columns="6" :add-class="'mt-4'">
                  <ButtonElement name="backToIntro" :class="'me-2'" :columns="3" full @click="selectTab('intro')">Back to Introduction</ButtonElement>
                  <ButtonElement :disabled="!completedPatientEntry" name="continueToScenarios" :class="'ms-2'" :columns="3" full @click="selectTab('scenarios')">Continue to Scenarios</ButtonElement> 
                </GroupElement>                             
              </StaticElement>
            </div>
            <div class="tab-pane fade mt-2" :id="'practice-tab-scenarios'" role="tabpanel" tabindex="0">
              <Scenario @all-scenarios-completed="completedScenarios = true" />
              <StaticElement name="scenarioEntryDone">
                <div v-show="completedScenarios" class="alert alert-info" role="alert">You have now completed all the scenarios.</div>
                <GroupElement name="patientbuttonBar" :columns="6" :add-class="'mt-4'">
                  <ButtonElement name="backToPatientBuild" :class="'me-2'" :columns="3" full @click="selectTab('patients')">Back to Patient Entry</ButtonElement>
                  <ButtonElement :disabled="!completedScenarios" name="continueToReport" :class="'ms-2'" :columns="3" full @click="selectTab('report')">Continue to Report</ButtonElement>
                </GroupElement>                
              </StaticElement>    
            </div>
            <div class="tab-pane fade mt-2" :id="'practice-tab-report'" role="tabpanel" tabindex="0">
              <PracticeReport />
              <StaticElement name="practiceReport">
                <ButtonElement :disabled="!completedScenarios" name="continueToAssessment" :columns="4" @click="doAssessment">Do Assessment for real</ButtonElement>
              </StaticElement>    
            </div>
          </div>
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

import { Tab } from 'bootstrap/dist/js/bootstrap.bundle.min'
import LoginInfo from './LoginInfo'
import AppFooter from './AppFooter'
import AppLogo from './AppLogo'
import PatientBuild from './practice/PatientBuild'
import Scenario from './practice/Scenario'
import { practiceTabValues } from '../helpers/common'
import { mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import PracticeIntro from './practice/PracticeIntro'
import PracticeReport from './practice/PracticeReport'
import ErrorAlertModal from './modals/ErrorAlertModal'
import { rootStore } from '../stores/root'

export default {
  name: 'AssessmentPractice', 
  computed: {
    ...mapState(appSettingsStore, ['year']),
    ...mapState(rootStore, ['audit']),
    practiceTabs() {
      return practiceTabValues
    },
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
  }, 
  components: {
    LoginInfo,
    AppFooter,
    AppLogo,
    PracticeIntro,
    PatientBuild,
    Scenario,
    PracticeReport,
    ErrorAlertModal
  },
  data() {
    return {
      completedPatientEntry: false,
      completedScenarios: false
    } 
  },
  methods: {
    async selectTab(name) {
      const triggerEl = document.querySelector(`#practice-stage-tabs button[data-bs-target="#practice-tab-${name}"]`)      
      Tab.getInstance(triggerEl).show()
      await this.audit('practice', '/practice', name)
    },
    doAssessment() {
      this.$router.push('/assessment')
    }
  },
  async mounted() {
    console.group('AssessmentPractice mounted hook')
    const triggerTabList = document.querySelectorAll('#practice-stage-tabs button')
    triggerTabList.forEach(triggerEl => {
      const tabTrigger = new Tab(triggerEl)      
    })
    await this.audit('practice', '/practice', 'intro')
    console.groupEnd()
  },
  errorCaptured(...args) {

    console.group('errorCaptured()')
    console.debug(args)

    // Eliminate the 'Blocked aria-hidden on an element because its descendant retained focus' error which confuses assistive technologies when a modal is displayed...
    const activeElement = document.activeElement
    if (activeElement) {
      activeElement.blur()
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
