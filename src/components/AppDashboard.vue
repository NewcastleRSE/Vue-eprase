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
                      <th scope="col" class="vertical-header col-1"><span>Code</span></th>
                      <th scope="col" class="vertical-header col-2"><span>EP service</span></th>
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
                      <td :title="aa.institution.name">{{ aa.institution.institution_code }}</td>
                      <td>{{ aa.other_ep_service !="" ? aa.other_ep_service : (aa.ep_service != null ? aa.ep_service.name : 'None') }}</td>
                      <td v-for="n in range(0, aa.stateIndex)" :class="progressBarClass(aa.stateIndex)">
                        <button v-show="n == 6" class="btn btn-link" title="View this user's final report in a new window">View report</button>
                      </td>
                      <td v-for="n in range(aa.stateIndex + 1, 6)" class="padding-cell">
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane fade mt-2 " id="patient-type-paediatric-content" role="tabpanel" tabindex="1">
                <div v-if="dashboardData.paediatricAssessments.length == 0" class="mt-2">No assessments created so far</div>
                <table v-if="dashboardData.paediatricAssessments.length != 0" class="table table-bordered mt-2">
                  <thead>
                    <tr>
                      <th class="align-content-center" colspan="9">Completed stage</th>
                    </tr>
                    <tr>
                      <th scope="col" class="vertical-header col-1"><span>Code</span></th>
                      <th scope="col" class="vertical-header col-2"><span>EP service</span></th>
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
                      <td :title="pa.institution.name">{{ pa.institution.institution_code }}</td>
                      <td>{{ pa.other_ep_service !="" ? pa.other_ep_service : (pa.ep_service != null ? pa.ep_service.name : 'None') }}</td>
                      <td v-for="n in range(0, pa.stateIndex)" :class="progressBarClass(pa.stateIndex)">
                        <button v-show="n == 6" class="btn btn-link" title="View this user's final report in a new window">View report</button>
                      </td>
                      <td v-for="n in range(pa.stateIndex + 1, 6)" class="padding-cell"></td>
                    </tr>
                  </tbody>
                </table>
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

export default {
  name: 'AssessmentDashboard',  
  computed: {
    ...mapState(appSettingsStore, ['year']),
    ...mapState(rootStore, ['progressReport']),   
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
    progressBarClass(idx) {
      return 'assessment-' + (idx <=2 ? 'not-started' : (idx > 2 && idx < 6 ? 'in-progress' : 'complete'))
    }
  },  
  async mounted() {
    console.group('AssessmentDashboard mounted()')

    this.auxiliaryDataReady = false

    const response = await this.progressReport()
    if (response.status >= 400) {
      throw new Error(response.message)
    }
    this.dashboardData = response.data

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
      activeElement.blur();
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
  /* max-height: 150px; */
}

</style>