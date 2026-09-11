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
                <button class="nav-link" data-bs-toggle="tab" type="button" role="tab" :class="'active'"
                  id="patient-type-adult-tab" data-bs-target="#patient-type-adult-content">All Adult Assessments
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" type="button" role="tab" 
                  id="patient-type-paediatric-tab" data-bs-target="#patient-type-paediatric-content">All Paediatric Assessments
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                  id="archive-reports-tab" data-bs-target="#archive-reports-content">Archive reports
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                  id="audit-log-export-tab" data-bs-target="#audit-log-export-content">Export audit log data
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" type="button" role="tab"
                  id="csv-downloads-tab" data-bs-target="#csv-downloads-content">Download data as CSV
                </button>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade active show mt-2" id="patient-type-adult-content" role="tabpanel" tabindex="0">
                <div v-if="dashboardData.adultAssessments.length == 0" class="mt-2">No assessments created so far</div>
                <table v-if="dashboardData.adultAssessments.length != 0" class="table table-bordered mt-2">
                  <thead>
                    <tr>
                      <th class="align-content-center" colspan="8">Completed stage</th>
                    </tr>
                    <tr>
                      <th scope="col" class="vertical-header col-auto"><span>Institution</span></th>
                      <th scope="col" class="vertical-header col-auto"><span>EP service</span></th>
                      <th scope="col" class="vertical-header col-1"><span>No assessment</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Not started</span></th>
                      <th scope="col" class="vertical-header col-1"><span>System</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Patient build</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Scenarios</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Finished</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="aa in dashboardData.adultAssessments">
                      <td :title="aa.institution.institution_code"><span class="nowrap">{{ aa.institution.name }}</span>
                      </td>
                      <td><span class="nowrap">{{ aa.other_ep_service != "" ? aa.other_ep_service : (aa.ep_service !=
                        null ? aa.ep_service.name : 'None') }}</span></td>
                      <td v-for="n in range(0, aa.stateIndex)" :class="progressBarClass(aa.stateIndex)">
                        <button v-show="n == 5" class="btn btn-link btn-nopad"
                          title="View this user's final report in a new window"
                          @click="viewAssessmentReport(aa.documentId)">View report</button>
                      </td>
                      <td v-for="n in range(aa.stateIndex + 1, 5)" class="padding-cell"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane fade mt-2" id="patient-type-paediatric-content" role="tabpanel" tabindex="1">
                <div v-if="dashboardData.paediatricAssessments.length == 0" class="mt-2">No assessments created so far
                </div>
                <table v-if="dashboardData.paediatricAssessments.length != 0" class="table table-bordered mt-2">
                  <thead>
                    <tr>
                      <th class="align-content-center" colspan="8">Completed stage</th>
                    </tr>
                    <tr>
                      <th scope="col" class="vertical-header col-auto"><span>Institution</span></th>
                      <th scope="col" class="vertical-header col-auto"><span>EP service</span></th>
                      <th scope="col" class="vertical-header col-1"><span>No assessment</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Not started</span></th>
                      <th scope="col" class="vertical-header col-1"><span>System</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Patient build</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Scenarios</span></th>
                      <th scope="col" class="vertical-header col-1"><span>Finished</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pa in dashboardData.paediatricAssessments">
                      <td :title="pa.institution.institution_code"><span class="nowrap">{{ pa.institution.name }}</span>
                      </td>
                      <td><span class="nowrap">{{ pa.other_ep_service != "" ? pa.other_ep_service : (pa.ep_service !=
                        null ? pa.ep_service.name : 'None') }}</span></td>
                      <td v-for="n in range(0, pa.stateIndex)" :class="progressBarClass(pa.stateIndex)">
                        <button v-show="n == 5" class="btn btn-link btn-nopad"
                          title="View this user's final report in a new window"
                          @click="viewAssessmentReport(pa.documentId)">View report</button>
                      </td>
                      <td v-for="n in range(pa.stateIndex + 1, 5)" class="padding-cell"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane fade mt-4" id="archive-reports-content" role="tabpanel" tabindex="2">
                <button name="archive-reports-btn" class="col-4 btn btn-primary" 
                  :disabled="archiveStarted" @click="saveCompletedReportsToArchive()"
                >Save Current Reports to Archive</button>
                <div v-show="archiveInProgressAdult">
                  <h5 class="mt-2">Adult assessments</h5>
                  <ul ref="archiveFeedbackAdult" class="list-group"> 
                    <li class="list-group-item">
                      <div class="d-flex align-items-center">
                        <strong role="status">Determining what to archive...</strong>
                        <div class="spinner-border ms-auto" aria-hidden="true"></div>
                      </div>
                    </li>                 
                  </ul>
                </div>
                <div v-show="archiveInProgressPaediatric">
                  <h5 class="mt-2">Paediatric assessments</h5>
                  <ul ref="archiveFeedbackPaediatric" class="list-group">
                    <li class="list-group-item">
                      <div class="d-flex align-items-center">
                        <strong role="status">Determining what to archive...</strong>
                        <div class="spinner-border ms-auto" aria-hidden="true"></div>
                      </div>
                    </li>                  
                  </ul>
                </div>
              </div>
              <div class="tab-pane fade mt-4" id="audit-log-export-content" role="tabpanel" tabindex="3">
                <Vueform ref="exportAuditForm">
                  <StaticElement name="export-audit-heading">
                    <h3>Export ePRaSE audit logs by date range and institutions</h3>                   
                  </StaticElement>
                  <ObjectElement name="export-audit-formdata">
                    <SelectElement name="modifier" :label="embolden('Date/time')" ref="exportAuditModifierRef"
                      :columns="{ container: 4, label: 3, wrapper: 12 }" :items="['any', 'before', 'after', 'between']"
                      default="any" />
                    <DateElement name="date1" ref="exportAuditDate1Ref"
                      v-if="exportAuditDateModifierHasValues(['before', 'after', 'between'])"
                      display-format="DD/MM/YYYY HH:mm" 
                      value-format="YYYY-MM-DDTHH:mm:ssZ"
                      placeholder="Select date/time" :default="new Date()"
                      :columns="{ container: 4, label: 0, wrapper: 12 }" :time="true" :hour24="true" />
                    <DateElement name="date2" :label="embolden('and')" ref="exportAuditDate2Ref"
                      v-if="exportAuditDateModifierHasValues(['between'])" 
                      display-format="DD/MM/YYYY HH:mm"
                      value-format="YYYY-MM-DDTHH:mm:ssZ"
                      placeholder="Select date/time" :default="new Date()"
                      :columns="{ container: 4, label: 1, wrapper: 12 }" :time="true" :hour24="true" />
                    <TagsElement name="institutions" placeholder="Select institution names, or leave blank for all"
                      :label="embolden('For trust(s)')" :items="institutions" :search="true"
                      :columns="{ container: 11, label: 1, wrapper: 12 }" />
                    <SelectElement name="ordering" :label="embolden('Sort')" ref="exportOrderingRef"
                      :columns="{ container: 11, label: 1, wrapper: 12 }" 
                      :items="[
                        { value: 'ASC', label: 'in ascending date order' },
                        { value: 'DESC', label: 'in descending date order' }
                      ]"
                      default="ASC" />
                    <ButtonElement name="export-submit" @click="downloadCsv()">
                      <i class="bi bi-filetype-csv me-2"></i>Download CSV
                    </ButtonElement>
                  </ObjectElement>
                </Vueform>
              </div>
              <div class="tab-pane fade mt-4" id="csv-downloads-content" role="tabpanel" tabindex="4">
                <div class="row col-12">
                  <a class="btn btn-primary col-2 me-2" @click="scenarioData()" role="button">Scenario data</a>
                  <a class="btn btn-primary col-2 me-2" @click="assessmentSummary()" role="button">Assessment
                    summary</a>
                  <a class="btn btn-primary col-2 me-2" @click="systemData()" role="button">System data</a>
                </div>
                <div class="row col-12 mt-4">
                  <a class="btn btn-primary col-2 me-2" @click="mitigationByScenario()" role="button">Mitigation by
                    scenario</a>
                  <a class="btn btn-primary col-2 me-2" @click="mitigationPercentages()" role="button">Mitigation
                    percentages</a>
                  <a class="btn btn-primary col-2 me-2" @click="mitigationByCategory()" role="button">Mitigation by
                    category</a>
                </div>
                <div class="row col-12 mt-4">
                  <h3>Experimental reports</h3>
                </div>
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
import ErrorAlertModal from './modals/ErrorAlertModal'
import LoginInfo from './LoginInfo'
import AppLogo from './AppLogo'
import { saveAs } from 'file-saver-es'
import { assessmentStore } from '../stores/assessment'
import dayjs from 'dayjs'

export default {
  name: 'AssessmentDashboard',
  computed: {
    ...mapState(appSettingsStore, ['year']),
    ...mapState(rootStore, ['progressReport', 'apiCall', 'getInstitutions', 'isReportArchived']),
    ...mapState(assessmentStore, ['dataReady', 'selectAssessment', 'getCategoryDetails', 'getMitigationDetails']),
    dataLoaded() {
      return this.dataReady
    },
    epSystemYear() {
      return this.year
    },
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    exportAuditModifier() {
      return this.$refs.exportAuditModifierRef ? this.$refs.exportAuditModifierRef.value : 'any'
    },
    exportAuditDate1() {
      return this.$refs.exportAuditDate1Ref.value
    },
    exportAuditDate2() {
      return this.$refs.exportAuditDate2Ref.value
    }
  },
  components: {
    ErrorAlertModal,
    AppLogo,
    LoginInfo
  },
  data() {
    return {
      dashboardData: null,
      institutions: [],
      archiveStarted: false,
      archiveInProgressAdult: false,
      archiveInProgressPaediatric: false,
      archiveComplete: false
    }
  },
  methods: {
    range(start, end) {
      return Array(end - start + 1).fill().map((_, i) => start + i)
    },
    formatDate() {
      return new Date().toISOString().slice(0, 10)
    },
    exportAuditDateModifierHasValues(values) {
      return values.includes(this.$refs.exportAuditModifierRef ? this.$refs.exportAuditModifierRef.value : 'any')
    },
    progressBarClass(idx) {
      return 'assessment-' + (idx <= 2 ? 'not-started' : (idx > 2 && idx < 5 ? 'in-progress' : 'complete'))
    },
    buildFileNameFromParams(formData) {
      const { modifier, institutions, date1, date2 } = formData
      let fileName = 'audit_log_export_'
      switch(modifier) {
        case 'before': 
        case 'after':
          fileName += `${modifier}_${dayjs(date1).format('DD_MM_YYYY_HH_MM')}_`; break
        case 'between':
          fileName += `${modifier}_${dayjs(date1).format('DD_MM_YYYY_HH_MM')}_and_${dayjs(date2).format('DD_MM_YYYY_HH_MM')}_`; break
        default:
          fileName += 'any_time_'; break      
      }
      if (!Array.isArray(institutions) || institutions.length == 0) {
        fileName += 'all_institutions'
      } else {
        fileName += `${institutions.join('_')}`
      }
      fileName += '.csv'
      console.debug(fileName)
      return fileName
    },
    async downloadCsv() {
      const formData = this.$refs.exportAuditForm.requestData['export-audit-formdata']
      const response = await this.apiCall('export-csv', 'POST', formData, 'blob')
      saveAs(response.data, this.buildFileNameFromParams(formData))
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
      const selectResponse = await this.selectAssessment(assessmentId)
      const wasError = await this.errorResponder(selectResponse)
      if (!wasError) {
        window.open(this.$router.resolve({ path: '/assessment-report' }).href, '_blank')
      }
      console.groupEnd()
    },
    addArchivingFeedback(ul, str, addToLi = null) {
      let li = addToLi
      if (addToLi != null) {        
        addToLi.innerHTML = addToLi.innerHTML + str
      } else {
        li = document.createElement('li')
        li.className = 'list-group-item'
        li.innerHTML = str
        ul.appendChild(li)
      } 
      return li     
    },
    async saveCompletedReportsToArchive() {
      console.group('saveCompletedReportsToArchive()')
      this.archiveStarted = true
      for (const assessmentType of ['Adult', 'Paediatric']) {
        this['archiveInProgress' + assessmentType] = true
        const ul = this.$refs['archiveFeedback' + assessmentType]
        ul.innerHTML = ''
        const fieldName = assessmentType.substring(0, 1).toLowerCase() + assessmentType.substring(1) + 'Assessments'
        const completedAssessments = this.dashboardData[fieldName].filter(assmt => assmt.state == 'Assessment complete')
        if (completedAssessments.length == 0) {
          this.addArchivingFeedback(ul, 'No completed reports to be archived')
        } else {
          completedAssessments.forEach(async caa => {
            const epSystemName = caa.other_ep_service || caa.ep_service.name
            const isArchivedResponse = await this.isReportArchived(caa.institution.institution_code, epSystemName, assessmentType)
            switch(isArchivedResponse.status) {
              case 'archived': 
                this.addArchivingFeedback(ul, `${caa.institution.institution_code} ${epSystemName} ${assessmentType} already archived, skipping...`)
                break
              case 'not archived': 
                const addedLi = this.addArchivingFeedback(ul, `Saving ${caa.institution.institution_code} ${epSystemName} ${assessmentType} to archive...`)
                const saveResponse = await this.apiCall('archive-report', 'POST', { 
                  assessmentId : caa.documentId,
                  institutionCode: caa.institution.institution_code,
                  epSystem: epSystemName,
                  assessmentType: assessmentType
                })
                if (saveResponse.status < 400) {                
                  this.addArchivingFeedback(ul, 'Done', addedLi)   // Or error message if the save failed
                } else {
                  this.addArchivingFeedback(ul, saveResponse.message, addedLi)
                } 
                break
              case 'error': 
                this.addArchivingFeedback(ul, isArchivedResponse.message)
                break
              default: 
                break
            }            
          })
        }
      } 
      this.archiveComplete = true     
      console.groupEnd()
    }
  },
  async mounted() {
    console.group('AssessmentDashboard mounted()')
    let wasError = false
    // Institution list for CSV audit download selector
    const instResponse = await this.getInstitutions()
    wasError = await this.errorResponder(instResponse)
    if (!wasError) {
      this.institutions = instResponse.data.data.map(inst => { return { value: inst.institution_code, label: inst.name } })
    }
    // Basic data for viewing assessments    
    const mitResponse = await this.getMitigationDetails()
    wasError = await this.errorResponder(mitResponse)
    if (!wasError) {
      const catResponse = await this.getCategoryDetails()
      wasError = await this.errorResponder(catResponse)
    }
    if (!wasError) {
      // Dashboard data
      const response = await this.progressReport()
      const wasError = await this.errorResponder(response)
      if (!wasError) {
        this.dashboardData = response.data
      }
    }
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