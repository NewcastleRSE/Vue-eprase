<template>
   <main class="leftalign">

    <div class="pills-banner"><img :src="pillsImage" alt="banner graphic"></div>

    <LoginInfo />

    <h1 class="px-4">Admin Home</h1>

    <div class="px-4">
      <p>
        The following reports are designed to give insight into the comparative performance of different 
        institutions and their EPMA systems
      </p>

      <nav class="mt-4">
        <ul class="nav nav-tabs nav-fill mb-3" id="admin-reports-tab" role="tablist">
          <li class="nav-item" role="presentation" title="Access all available institution reports" data-bs-toggle="tooltip" data-bs-placement="top">
            <a class="nav-link active" data-bs-toggle="tab" href="#view-all-inst-tab" role="tab">All Institution Reports</a>
          </li>
          <li class="nav-item" role="presentation" title="Compare overall mitigation results" data-bs-toggle="tooltip" data-bs-placement="top">
            <a class="nav-link" data-bs-toggle="tab" href="#view-mit-comp-tab" role="tab">Mitigation Comparison</a>
          </li>
          <li class="nav-item" role="presentation" title="Compare mitigation results across EP systems" data-bs-toggle="tooltip" data-bs-placement="top">
            <a class="nav-link" data-bs-toggle="tab" href="#view-ep-comp-tab" role="tab">Ep System Comparison</a>
          </li>
          <li class="nav-item" role="presentation" title="View EPMA data for institutions" data-bs-toggle="tooltip" data-bs-placement="top">
            <a class="nav-link" data-bs-toggle="tab" href="#view-epma-stats-tab" role="tab">EPMA Statistics</a>
          </li>
          <li class="nav-item" role="presentation" title="View config error results for institutions" data-bs-toggle="tooltip" data-bs-placement="top">
            <a class="nav-link" data-bs-toggle="tab" href="#view-conf-errs-tab" role="tab">Configuration Error Results</a>
          </li>
          <li class="nav-item" role="presentation" title="View extreme risk results for institutions" data-bs-toggle="tooltip" data-bs-placement="top">
            <a class="nav-link" data-bs-toggle="tab" href="#view-ex-risk-comp-tab" role="tab">Extreme Risk Comparison</a>
          </li>
        </ul>
      </nav>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="view-all-inst-tab" role="tabpanel">
          <AllAssessmentReports :reports="reports" :loading="reportDataLoading" />
        </div>
        <div class="tab-pane fade" id="view-mit-comp-tab" role="tabpanel">
          <MitigationComparisonChart @get-mitigation-fail="reportError" />
        </div>
        <div class="tab-pane fade" id="view-ep-comp-tab" role="tabpanel">
          <EpSystemComparisonChart @get-mitigation-fail="reportError" />
        </div>
        <div class="tab-pane fade" id="view-epma-stats-tab" role="tabpanel">
          <EpmaStatistics :reports="reports" :loading="reportDataLoading" />
        </div>
        <div class="tab-pane fade" id="view-conf-errs-tab" role="tabpanel">
          <ConfigErrorResults :reports="reports" :loading="reportDataLoading" />
        </div>
        <div class="tab-pane fade" id="view-ex-risk-comp-tab" role="tabpanel">
          <HighRiskComparison :reports="reports" :loading="reportDataLoading" />
        </div>
      </div>
    </div>

    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />

  </main>
</template>

<script>

import { getFormattedDate } from "../helpers/utils"
import AppLogo from "./AppLogo"
import LoginInfo from "./LoginInfo"
import ErrorAlertModal from "./ErrorAlertModal"
import { mapStores } from "pinia"
import { rootStore } from "../stores/root"
import AllAssessmentReports from "./AllAssessmentReports"
import MitigationComparisonChart from "./MitigationComparisonChart"
import EpSystemComparisonChart from "./EpSystemComparisonChart"
import EpmaStatistics from "./EpmaStatistics"
import ConfigErrorResults from "./ConfigErrorResults"
import HighRiskComparison from "./HighRiskComparison"

export default {
  name: 'AdminHome',
  components: {
    AppLogo,
    LoginInfo,
    ErrorAlertModal,
    AllAssessmentReports,
    MitigationComparisonChart,
    EpSystemComparisonChart,
    EpmaStatistics,
    ConfigErrorResults,
    HighRiskComparison
  },
  computed: {
    ...mapStores(rootStore),
    pillsImage() {
      return '../assets/images/pills-bw.png'
    },
    errorAlertModal() {
      return this.$refs.errorAlertModal
    }
  },
  data() {
    return {
      reports: [],
      chartData: [],
      epmaStatsData: [],
      reportDataLoading: true
    }
  },
  methods: {           
    highRiskComparison() {
      this.$router.push('/highriskcomparison')
    },    
    async getReports() {
      const allRepResponse = await rootStore().getAllReports()
      if (allRepResponse.status < 400) {
        const ceDetailsResponse = await rootStore().getConfigErrors()
        if (ceDetailsResponse.status < 400) {
          // Additional details about the config errpors that report viewers want to know
          const ceObjects = Object.fromEntries(ceDetailsResponse.data.map(ce => [ce.configErrorCode, { question: ce.description, good_answer: ce.good_answer }]))
          this.reportDataLoading = false
          this.reports = allRepResponse.data
          this.reports.forEach(rep => {
            rep.system.time_created = getFormattedDate(rep.system.time_created)
            rep.configErrorDataList.forEach(cedElt => {
              cedElt.question = ceObjects[cedElt.test_id].question
              cedElt.good_answer = ceObjects[cedElt.test_id].good_answer
            })
          })
        } else {
          this.errorAlertModal.show(ceDetailsResponse.message)
        }        
      } else {
        this.errorAlertModal.show(allRepResponse.message)
      }
    },        
    reportError(message) {
      this.errorAlertModal(message)
    }
  },
  mounted() {
    this.getReports()
  }
}

</script>

<style scoped></style>
