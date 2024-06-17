<template>
  <main class="leftalign">

    <TabHeader :showIndex="3" />

    <div class="content p-4">

      <LoginInfo />

      <h3>Assessment Report</h3>

      <div>
        <h4><span class="fw-bold me-2">Institution:</span><span class="fw-normal">{{ institution }}</span></h4>
        <h4><span class="fw-bold me-2">EP System:</span><span>{{ ep_service !== 'Other' ? ep_service : other_ep_system
            }}</span></h4>
      </div>

      <nav class="mt-4">
        <ul class="nav nav-tabs nav-fill mb-3" id="results-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" data-bs-toggle="tab" href="#view-test-summary-tab" role="tab">Test summary</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#view-percentages-tab" role="tab">View percentages</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#view-pie-chart-tab" role="tab">View pie chart</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#view-stacked-chart-tab" role="tab">View bar chart</a>
          </li>
        </ul>
      </nav>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="view-test-summary-tab" role="tabpanel">
          <section>
            <div>Total valid tests (not including configuration tests): {{ totalValidTests }}</div>
            <div>Total of tests that were excluded due to medication not being available: {{ totalNulls }}</div>
          </section>

          <div class="results-summary">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Extreme risk scenarios</th>
                  <td>You have completed {{ extremeRiskScenarios.length + ' extreme risk scenario' +
      (extremeRiskScenarios.length > 1 ? 's' : '') }}. Out of these, {{ extremeRiskMitigations + ' ' +
      (extremeRiskMitigations == 1 ? 'was' : 'were') }} mitigated. </td>
                </tr>
                <tr>
                  <th>High risk scenarios</th>
                  <td>You have completed {{ highRiskScenarios.length + ' high risk scenario' + (highRiskScenarios.length
      > 1 ? 's' : '') }}. Out of these, {{ highRiskMitigations + ' ' + (highRiskMitigations == 1 ? 'was' :
      'were') }} mitigated. </td>
                </tr>
                <tr>
                  <th>Alerts/Advisory interventions</th>
                  <td>You had a total of {{ totalAlerts }} alerts and {{ totalAdvisory }} advisory out of {{
      totalValidTests }} total valid tests, where a system/user intervention was selected. This would be
                    considered a
                    {{ interventionTypeResult }}. A high level of alerts
                    can
                    indicate an over-reliance on alerting within a system.</td>
                </tr>
                <tr>
                  <th>Config Errors</th>
                  <td>You were questioned about {{ totalConfigTests }} configuration errors.</td>
                </tr>
              </tbody>
            </table>

            <div v-if="extremeRiskFails.length > 0">

              <h4 class="bg-warning-subtle p-2">Extreme risk scenarios with no mitigation</h4>
              <table class="table table-striped bg-warning-subtle">
                <thead>
                  <tr>
                    <th>Drug name</th>
                    <th>Scenario description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="test in extremeRiskFails" :key="test">
                    <td>{{ test.prescription.drug_name }}</td>
                    <td>{{ test.prescription.indicator.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="configErrorResults.length > 0">

              <h4>Configuration Error Results</h4>
              <table class="table table-striped extreme-risk-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Result</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="test in configErrorResults" :key="test">
                    <td>{{ test.question }}</td>
                    <td><span v-if="test.result === 1">Yes</span><span v-if="test.result === 0">No</span></td>
                    <td><span v-if="test.result === 1">This is undesirable system behaviour</span><span
                        v-if="test.result === 0">This is good system behaviour</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="view-percentages-tab" role="tabpanel">
          <ResultsTable :tableData="tableData" :totalValidTests="totalValidTests" />
        </div>
        <div class="tab-pane fade" id="view-pie-chart-tab" role="tabpanel">
          <PieChart :goodMitigation="totalGood" :someMitigation="totalSome" :notMitigated="totalNot"
            :overMitigated="totalOver" :nullTests="totalNulls" />
        </div>
        <div class="tab-pane fade" id="view-stacked-chart-tab" role="tabpanel">
          <StackedChart :mydata="chartCategoryData" />
        </div>

      </div>
    </div>

    <ErrorAlertModal ref="errorAlertModal" />
    <AppLogo cls="bottomright" />

  </main>

</template>

<script>

import { calcPercentage } from '../helpers/utils'
import { categoryService } from "../services/categoryService"
import { stackedChartService } from "../services/stackedChartService"
import TabHeader from "./TabHeader"
import LoginInfo from './LoginInfo'
import AppLogo from "./AppLogo"
import ErrorAlertModal from './ErrorAlertModal'
import { patientStore } from '../stores/patients'
import { rootStore } from '../stores/root'
import { authenticationStore } from '../stores/authentication'
import { mapStores } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'
import ResultsTable from './ResultsTable'
import PieChart from './PieChart'
import StackedChart from './StackedChart'

export default {
  name: "AssessmentResults",
  components: {
    TabHeader,
    LoginInfo,
    AppLogo,
    ResultsTable,
    PieChart,
    StackedChart,
    ErrorAlertModal
  },
  data() {
    return {
      categories: [],
      tableData: {},
      chartCategoryData: [],
      extremeRiskScenarios: [],
      extremeRiskFails: [],
      extremeRiskMitigations: 0,
      highRiskScenarios: [],
      highRiskFails: [],
      highRiskMitigations: 0,
      lowRiskScenarios: [],
      lowRiskOverMitigations: [],
      configErrorResults: [],
      goodMitigation: '',
      someMitigation: '',
      notMitigated: '',
      overMitigated: '',
      percentageNulls: 0,
      totalGood: 0,
      totalSome: 0,
      totalNot: 0,
      totalOver: 0,
      totalValidTests: 0,
      totalAlerts: 0,
      totalAdvisory: 0,
      totalNulls: 0,
      totalInterventions: 0,
      interventionTypeResult: '',
      totalConfigTests: appSettingsStore().numConfigError,
      numPrescriptions: appSettingsStore().numPrescriptions,
      ep_service: '',
      other_ep_system: ''
    }
  },
  computed: {
    ...mapStores(authenticationStore, rootStore, patientStore, appSettingsStore),
    errorAlertModal() {
      return this.$refs.errorAlertModal
    },
    assessmentId() {
      return rootStore().assessmentId
    },
    institution() {
      return authenticationStore().orgName
    }
  },
  methods: {
    countCategories(data) {

      console.group('countCategories()')

      let jsonData = categoryService.countCategories(data)
      this.tableData = jsonData
      this.totalGood = jsonData.totals.totalGood
      this.totalSome = jsonData.totals.totalSome
      this.totalOver = jsonData.totals.totalOver
      this.totalNot = jsonData.totals.totalNot
      this.totalNulls = jsonData.totals.totalNulls
      this.totalInterventions = jsonData.totals.totalInterventions
      this.totalAlerts = jsonData.totals.totalAlerts
      this.totalAdvisory = jsonData.totals.totalAdvisory
      this.chartCategoryData = stackedChartService.createStackedChartData(jsonData)

      console.debug(this.tableData)
      console.groupEnd()
    },
    getInterventionTypeResult() {
      const interventionType = parseInt(calcPercentage(this.totalAlerts, this.totalValidTests))
      return (interventionType >= 70) ? 'high' : ((interventionType < 70 && interventionType >= 35) ? 'medium' : 'low') + ' level of alerts'
    },
    // Calculate as % of all tests
    saveMitigationResult(id) {
      let numTests = this.numPrescriptions
      this.goodMitigation = calcPercentage(this.totalGood, numTests)
      this.someMitigation = calcPercentage(this.totalSome, numTests)
      this.notMitigated = calcPercentage(this.totalNot, numTests)
      this.overMitigated = calcPercentage(this.totalOver, numTests)
      this.percentageNulls = calcPercentage(this.totalNulls, numTests)
      rootStore().saveMitigationResults(id, this.ep_service, this.goodMitigation, this.someMitigation, this.notMitigated, this.overMitigated, this.percentageNulls)
    },
    onTableClick() {
      this.$router.push('/resultstable')
    },
    onChartClick() {
      this.$router.push('/charts')
    },
    async onHomeClick() {
      const isAdmin = await authenticationStore().checkIsAdminUser()
      this.$router.push(isAdmin ? '/adminhome' : '/assessmentintro')
    },
    async getAllDetails() {

      console.group('getAllDetails()')

      try {
        console.debug('Getting assessment details...')
        const detailsResponse = await rootStore().getAssessmentById(this.assessmentId)
        if (detailsResponse.status < 400) {
          // System-level data
          this.ep_service = detailsResponse.data.system.ep_service
          this.other_ep_system = detailsResponse.data.system.other_ep_system
          console.debug('System data : ep_service', this.ep_service, 'other_ep_system', this.other_ep_system)
          // Prescription list data
          detailsResponse.data.prescriptionList.forEach(p => {
            const risk_level = p.risk_level
            if (risk_level === 'Extreme') {
              this.extremeRiskScenarios.push(p)
              if (p.result === 'No Mitigation/Fail') {
                this.extremeRiskFails.push(p)
              }
            }
            else if (risk_level === 'High') {
              this.highRiskScenarios.push(p)
              if (p.result === 'No Mitigation/Fail') {
                this.highRiskFails.push(p)
              }
            }
            else if (risk_level === 'Low') {
              this.lowRiskScenarios.push(p)
              if (p.result === 'Over Mitigation') {
                this.lowRiskOverMitigations.push(p)
              }
            }
          })
          this.extremeRiskMitigations = this.extremeRiskScenarios.length - this.extremeRiskFails.length
          this.highRiskMitigations = this.highRiskScenarios.length - this.highRiskFails.length
          // Config errors
          this.configErrorResults = []
          detailsResponse.data.configErrorDataList.forEach(async cd => {
            const cdDataResponse = await rootStore().getConfigErrorByCode(cd.test_id)
            if (cdDataResponse.status < 400) {
              cd.question = cdDataResponse.data.description
            } else {
              // Pretty minor - don't bomb the whole thing for this
              cd.question = cdDataResponse.message
              console.error(cd.question)
            }
            this.configErrorResults.push(cd)
          })
          rootStore().audit('View report', '/assessmentresults')
        } else {
          throw new Error(detailsResponse.message)
        }
        // Categories (these seem to be hard-coded everywhere, so not sure why this is useful?)
        const catResponse = await rootStore().getCategories()
        if (catResponse.status < 400) {
          this.categories = catResponse.data
        } else {
          throw new Error(catResponse.message)
        }
        // Mitigations data (this probably does not matter)
        const mitigationsResponse = await rootStore().getMitigationResults(this.assessmentId)
        if (mitigationsResponse.status < 400) {
          console.debug('### Does this make any sense? mitigationResponse is ', mitigationsResponse)
          this.goodMitigation = mitigationsResponse.data.goodMitigation || ''
          this.someMitigation = mitigationsResponse.data.someMitigation || ''
          this.notMitigated = mitigationsResponse.data.notMitigated || ''
          this.overMitigated = mitigationsResponse.data.notMitigated || ''
        } else {
          //throw new Error(mitigationsResponse.message)
          console.warn('Failed to get mitigation response')
        }
        // Prescription test data
        const ptdResponse = await rootStore().getPrescriptionTestData(this.assessmentId)
        if (ptdResponse.status < 400) {
          this.countCategories(ptdResponse.data.map(ptd => {
            return {
              categoryName: ptd.prescription.indicator.category['categoryName'],
              mitigation: ptd.result,
              outcome: ptd.outcome,
              selected_type: ptd.selected_type
            }
          }))
          // Set chart data (set in countCategories())
          rootStore().storeStackedChartData(this.chartCategoryData)
          // Calculate number of valid tests, ignoring null results
          this.totalValidTests = this.numPrescriptions - this.totalNulls
          this.getInterventionTypeResult()
          this.saveMitigationResult(this.assessmentId)
        } else {
          throw new Error(ptdResponse.message)
        }
      } catch (error) {
        this.errorAlertModal.show(error.message)
      }
    }
  },
  mounted() {
    this.getAllDetails()
  }

}
</script>

<style scoped></style>
