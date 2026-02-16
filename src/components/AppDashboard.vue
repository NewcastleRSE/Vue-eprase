<template>
  <main class="leftalign">
    <div class="pills-banner"><img src="../assets/images/EPrase banner-01.jpg" alt="ePRaSE banner"></div>
    <div class="content p-4">

      <LoginInfo />

      <div v-if="!dashboardData">
        <div class="d-flex align-items-center">
          <strong role="status">Loading assessment dashboard data...</strong>
          <div class="spinner-border ms-auto" aria-hidden="true"></div>
        </div>
      </div>

      <div v-if="dashboardData">
        <div>
          <h1 class="dashboard-head p-4">ePRaSE Tool Assessment State Of Play Dashboard {{ epSystemYear }}</h1>        
          <div class="report-page">
            <ul class="nav nav-tabs" id="patient-type-tabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                  :class="'active'"                      
                  id="patient-type-adult-tab" 
                  data-bs-target="#patient-type-adult-content">All Adult Assessments
                </button>
              </li> 
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                  id="patient-type-paediatric-tab" 
                  data-bs-target="#patient-type-paediatric-content">All Paediatric Assessments
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                  id="patient-type-csv-downloads-tab" 
                  data-bs-target="#patient-type-csv-downloads">Download data as CSV
                </button>
              </li>                  
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade active show mt-2" id="patient-type-adult-content" role="tabpanel" tabindex="0">
                <div v-if="dashboardData.adultAssessments.length == 0" class="mt-2">No assessments created so far</div>                
                <table v-if="dashboardData.adultAssessments.length != 0" class="table table-bordered mt-2">
                  <thead>
                    <tr>
                      <th class="align-content-center" colspan="9">Completed stage</th>
                    </tr>
                    <tr>
                      <th scope="col" class="vertical-header col-auto"><span>Institution</span></th>
                      <th scope="col" class="vertical-header col-auto"><span>EP service</span></th>
                      <th scope="col" class="vertical-header col-1"><span>No assessment</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Not started</span></th>
                      <th scope="col" class="vertical-header col-1"><span>System</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Patient build</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Scenarios</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Config questions</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Finished</span></th>
                    </tr>
                  </thead>
                  <tbody>                    
                    <tr v-for="aa in dashboardData.adultAssessments">
                      <td :title="aa.institution.institution_code"><span class="nowrap">{{ aa.institution.name }}</span></td>
                      <td><span class="nowrap">{{ aa.other_ep_service !="" ? aa.other_ep_service : (aa.ep_service != null ? aa.ep_service.name : 'None') }}</span></td>
                      <td v-for="n in range(0, aa.stateIndex)" :class="progressBarClass(aa.stateIndex)">
                        <button v-show="n == 6" class="btn btn-link btn-nopad" title="View this user's final report in a new window" @click="viewAssessmentReport(aa.documentId)">View report</button>
                      </td>
                      <td v-for="n in range(aa.stateIndex + 1, 6)" class="padding-cell"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane fade mt-2" id="patient-type-paediatric-content" role="tabpanel" tabindex="1">
                <div v-if="dashboardData.paediatricAssessments.length == 0" class="mt-2">No assessments created so far</div>
                <table v-if="dashboardData.paediatricAssessments.length != 0" class="table table-bordered mt-2">
                  <thead>
                    <tr>
                      <th class="align-content-center" colspan="9">Completed stage</th>
                    </tr>
                    <tr>
                      <th scope="col" class="vertical-header col-auto"><span>Institution</span></th>
                      <th scope="col" class="vertical-header col-auto"><span>EP service</span></th>
                      <th scope="col" class="vertical-header col-1"><span>No assessment</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Not started</span></th>
                      <th scope="col" class="vertical-header col-1"><span>System</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Patient build</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Scenarios</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Config questions</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Finished</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pa in dashboardData.paediatricAssessments">
                      <td :title="pa.institution.institution_code"><span class="nowrap">{{ pa.institution.name }}</span></td>
                      <td><span class="nowrap">{{ pa.other_ep_service !="" ? pa.other_ep_service : (pa.ep_service != null ? pa.ep_service.name : 'None') }}</span></td>
                      <td v-for="n in range(0, pa.stateIndex)" :class="progressBarClass(pa.stateIndex)">
                        <button v-show="n == 6" class="btn btn-link btn-nopad" title="View this user's final report in a new window" @click="viewAssessmentReport(pa.documentId)">View report</button>
                      </td>
                      <td v-for="n in range(pa.stateIndex + 1, 6)" class="padding-cell"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane fade mt-4" id="patient-type-csv-downloads" role="tabpanel" tabindex="2">
                <div class="row col-12">
                  <a class="btn btn-primary col-2 me-2" @click="scenarioData()" role="button">Scenario data</a>
                  <a class="btn btn-primary col-2 me-2" @click="mitigationPercentages()" role="button">Mitigation percentages</a>
                  <a class="btn btn-primary col-2" @click="configQuestionData()" role="button">Config Questions</a>
                </div>
                <div class="row col-12 mt-4">
                  <a class="btn btn-primary col-2 me-2" @click="assessmentSummary()" role="button">Assessment summary</a>
                  <a class="btn btn-primary col-2 me-2" @click="systemData()" role="button">System data</a>
                  <a class="btn btn-primary col-2" @click="optOutData()" role="button">Opt outs summary</a>
                </div>                
                <div class="row col-12 mt-4">
                  <a class="btn btn-primary col-2 me-2" @click="mitigationByCategory()" role="button">Mitigation by category</a>
                  <a class="btn btn-primary col-2 me-2" @click="mitigationByScenario()" role="button">Mitigation by scenario</a>
                </div>
                <div class="row col-12 mt-4"><h3>Experimental reports</h3></div>
                <div class="row col-12 mt-4">
                  <a class="btn btn-primary col-2 me-2" @click="categoryRiskReport()" role="button">Category risk</a>
                  <a class="btn btn-primary col-2 me-2" @click="scenarioRiskReport()" role="button">Scenario risk</a>
                </div>
              </div>
            </div>
          </div>                  
        </div>
      </div>

    </div>   
    <AppLogo cls="bottomright" />
    <ErrorAlertModal ref="errorAlertModal" />
  </main>
</template>

<script>      

import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { appSettingsStore } from '../stores/appSettings'
import ErrorAlertModal from './ErrorAlertModal'
import LoginInfo from './LoginInfo'
import AppLogo from './AppLogo'
import { saveAs } from 'file-saver-es'
import { assessmentStore } from '../stores/assessment'
import { nextTick } from 'vue'

export default {
  name: 'AssessmentDashboard',  
  computed: {
    ...mapState(appSettingsStore, ['year']),
    ...mapState(rootStore, ['progressReport', 'apiCall']), 
    ...mapState(assessmentStore, ['loadCompletedAssessment', 'getCategoryDetails', 'getMitigationDetails', 'getConfigQuestionDetails']),
    epSystemYear() {
      return this.year
    },
    errorAlertModal() {
      return this.$refs.errorAlertModal
    }
  },
  components: {
    ErrorAlertModal,
    AppLogo,
    LoginInfo
  },
  data() {
    return {
      dashboardData: null
    }
  },
  methods: {
    range(start, end) {
      return Array(end - start + 1).fill().map((_, i) => start + i);
    },
    formatDate() {
      return new Date().toISOString().slice(0, 10)
    },
    progressBarClass(idx) {
      return 'assessment-' + (idx <=2 ? 'not-started' : (idx > 2 && idx < 6 ? 'in-progress' : 'complete'))
    },
    async scenarioData() {
      const response = await this.apiCall('assessment-scenario-data', 'GET', null, 'blob')
      saveAs(response.data, `scenario_data_${this.formatDate()}.csv`)
    },
    async mitigationPercentages() {
      const response = await this.apiCall('assessment-mitigation-percentages', 'GET', null, 'blob')
      saveAs(response.data, `mitigation_percentages_${this.formatDate()}.csv`)
    },
    async mitigationByCategory() {
      const response = await this.apiCall('assessment-mitigation-by-category', 'GET', null, 'blob')
      saveAs(response.data, `mitigations_by_category_${this.formatDate()}.csv`)
    },
    async mitigationByScenario() {
      const response = await this.apiCall('assessment-mitigation-by-scenario', 'GET', null, 'blob')
      saveAs(response.data, `mitigations_by_scenario_${this.formatDate()}.csv`)
    },
    async categoryRiskReport() {
      const response = await this.apiCall('assessment-category-risk-report', 'GET', null, 'blob')
      saveAs(response.data, `category_risk_report_${this.formatDate()}.csv`)
    },
    async scenarioRiskReport() {
      const response = await this.apiCall('assessment-scenario-risk-report', 'GET', null, 'blob')
      saveAs(response.data, `scenario_risk_report_${this.formatDate()}.csv`)
    },
    async configQuestionData() {
      const response = await this.apiCall('assessment-config-question-data', 'GET', null, 'blob')
      saveAs(response.data, `config_error_data_${this.formatDate()}.csv`)
    },
    async assessmentSummary() {
      const response = await this.apiCall('assessment-summary-data', 'GET', null, 'blob')
      saveAs(response.data, `assessments_summary_${this.formatDate()}.csv`)
    },
    async systemData() {
      const response = await this.apiCall('assessment-system-data', 'GET', null, 'blob')
      saveAs(response.data, `system_data_${this.formatDate()}.csv`)
    },
    async optOutData() {
      const response = await this.apiCall('assessment-opt-outs-data', 'GET', null, 'blob')
      saveAs(response.data, `opt_outs_${this.formatDate()}.csv`)
    },
    async viewAssessmentReport(assessmentId) {
      console.group('viewAssessmentReport()')
      const selectResponse = await this.loadCompletedAssessment(assessmentId)        
      this.errorResponder(selectResponse)
      window.open(this.$router.resolve({ path: '/assessment-report' }).href, '_blank')
      console.groupEnd()
    }
  },  
  async mounted() {
    console.group('AssessmentDashboard mounted()')

    this.auxiliaryDataReady = false

    // Basic data for viewing assessments
    let wasError = false
    const mitResponse = await this.getMitigationDetails()
    wasError = this.errorResponder(mitResponse)    
    if (!wasError) {
      const catResponse = await this.getCategoryDetails()
      wasError = this.errorResponder(catResponse)
    }
    if (!wasError) {
      const configResponse = await this.getConfigQuestionDetails()
      wasError = this.errorResponder(configResponse)
    }
    if (!wasError) {
      // Dashboard data
      const response = await this.progressReport()
      if (!this.errorResponder(response)) {
        this.dashboardData = response.data
      }      
    }    
    this.auxiliaryDataReady = true

    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentDashboard beforeUnmount()')
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

.dashboard-head {
   text-align: center;
}

.vertical-header span {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-align: left;
}

span.nowrap {
  display: inline-block;
  white-space: nowrap;
}

.btn-nopad {
  padding: 0px;
}

</style>