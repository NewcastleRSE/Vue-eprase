<template>
   <main class="leftalign">

    <div class="pills-banner"></div>

    <LoginInfo />

    <h1 class="px-4">Admin Home</h1>

    <div class="px-4">
      <p>
        The following reports are designed to give insight into the comparative performance of different 
        institutions and their EPMA systems
      </p>

      <nav class="mt-4">
        <ul class="nav nav-tabs nav-fill mb-3" id="admin-reports-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" data-bs-toggle="tab" href="#view-all-inst-tab" role="tab">All Institution Reports</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#view-mit-comp-tab" role="tab">Mitigation Comparison</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#view-ep-comp-tab" role="tab">Ep System Comparison</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#view-epma-stats-tab" role="tab">EPMA Statistics</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#view-conf-errs-tab" role="tab">Configuration Error Results</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#view-ex-risk-comp-tab" role="tab">Extreme Risk Comparison</a>
          </li>
        </ul>
      </nav>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="view-all-inst-tab" role="tabpanel">
          All institution reports here...
        </div>
        <div class="tab-pane fade" id="view-mit-comp-tab" role="tabpanel">
          Mitigation comparisons here...
        </div>
        <div class="tab-pane fade" id="view-ep-comp-tab" role="tabpanel">
          EP system comparisons here...
        </div>
        <div class="tab-pane fade" id="view-epma-stats-tab" role="tabpanel">
          EPMA stats here...
        </div>
        <div class="tab-pane fade" id="view-conf-errs-tab" role="tabpanel">
          Config errors here...
        </div>
        <div class="tab-pane fade" id="view-ex-risk-comp-tab" role="tabpanel">
          Extreme risk comparisons here...
        </div>
      </div>
    </div>

    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />

  </main>
</template>

<script>

import AppLogo from "./AppLogo"
import ErrorAlertModal from "./ErrorAlertModal"
import { mapStores } from "pinia"
import { rootStore } from "../stores/root"
import { authenticationStore } from "../stores/authentication"

export default {
  name: 'AdminHome',
  components: {
    AppLogo,
    ErrorAlertModal
  },
  computed: {
    ...mapStores(rootStore, authenticationStore)
  },
  data() {
    return {
      userIsAdmin: true,
      chartData: [],
      guidanceText: ''
    }
  },
  methods: {
    getAllReports() {
      this.$router.push('/allassessmentreports')
    },
    mitigationComparison() {
      this.$router.push('/mitigationcomparison')
    },
    epsystemComparison() {
      this.$router.push('/epsystemcomparison')
    },
    epmaStatistics() {
      this.$router.push('/epmastatistics')
    },
    categoryComparison() {
      this.$router.push('/categorycomparison')
    },
    configErrorResults() {
      this.$router.push('/configerrorresults')
    },
    highRiskComparison() {
      this.$router.push('/highriskcomparison')
    },    
    async getInstitutionMitResult() {
      const response = await rootStore().getAllMitigationResults()
      if (response.status < 400) {
        const data = response.data
        for (let index in data) {
          if (data.hasOwnProperty(index)) {
            this.chartData.push([
              data[index].institution.orgName,
              data[index].goodMitigation,
              data[index].someMitigation,
              data[index].notMitigated,
              data[index].overMitigated,
              data[index].invalidTests,
              data[index].epSystem])
          }
        }
        const mitigationChartData = this.chartData
        if (this.chartData) {
          rootStore().storeMitigationChartData(mitigationChartData)
        }
      } else {
        //Error modal show TODO
      }
    },
    async checkAdmin() {
      return await this.authenticationStore().checkIsAdminUser()
    }
  },
  mounted() {
    if (!this.checkAdmin()) {
      this.$router.push('/login?requiresAdmin=1')
    }   
  }
}

</script>

<style scoped></style>
