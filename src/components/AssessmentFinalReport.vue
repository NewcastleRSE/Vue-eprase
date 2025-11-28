<template>
  <GroupElement name="finalReportGroup" :class="'mb-4'">
    <StaticElement name="finalReportDataLoading" v-if="!dataLoaded">
      <div class="d-flex align-items-center">
        <strong role="status">Loading final report data for assessment...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </StaticElement>
    <GroupElement name="finalReportDataLoaded" v-if="dataLoaded">
      <StaticElement name="finalReportHeading">

        <h2>ePRaSE Tool Assessment Report {{ epSystemYear }}</h2>
        <h3>Trust: {{ institutionName }}</h3>
        <h3>EP System: {{ epSystemName }}</h3>
        <h3>Type of assessment: {{ assessmentData.selection.patientType }} inpatient</h3>

        <div class="report-page">
          <p>Summary of risk mitigation performance for your system across all the prescribing tests executed.</p>
          <div ref="pieChartContainer"></div>
          <p>
            Good mitigation of the prescribing assessments in the ePRaSE tool is defined as where an EP system correctly identifies a risk of error, 
            providing an appropriate predefined response (e.g., prescribing prevented or presents some onscreen alert or advisory intervention) when 
            a medicine is prescribed.
          </p>
          <p>
            Some mitigation indicates where risks have not been correctly mitigated e.g., where a prescribing event that should be prevented has triggered 
            an alert or advisory onscreen prompt instead or where the user has been able to override good build such as order sentences to complete a test.
          </p> 
          <p>
            Over mitigation indicates tests where scores are accrued when an intervention is recorded when none is expected from the control items. 
          </p>
          <p>
            Invalid results are where a test presented a medicine which was not in the user's EP system and the question was passed over. 
          </p>
        </div>
        
        <div class="report-page">
          <h3>EPRaSE Assessment breakdown of results for {{ epSystemYear }}</h3>
          <h4>Overview of prescribing test results</h4>
          <p>
            The total number of valid prescribing tests completed (excluding configuration questions) = {{ scenarioTotal - excludedTests() }}
          </p>
          <p>
            The total number of prescribing tests excluded (described as invalid test in the pie chart) due to medication not being available in the 
            users EP system or the user skipped the question for another reason = {{ excludedTests() }}
          </p>
          <p>
            Table (1) below details the total number of prescribing tests completed, broken down by risk category. In addition, information is provided 
            on the number and type of alerts record by your trust where an intervention was recorded.
          </p>
          <table class="table table-bordered">
            <thead>
              <tr><th>Prescribing risk category</th><th>Outcome</th></tr>
            </thead>
            <tbody>
              <tr><td>Extreme risk</td><td>You completed {{ goodMitigationAnalysis['Extreme'].total }} extreme risk scenarios. Out of these {{ goodMitigationAnalysis['Extreme'].good }} were correctly mitigated.</td></tr>
              <tr><td>High risk</td><td>You completed {{ goodMitigationAnalysis['High'].total }} high risk scenarios. Out of these {{ goodMitigationAnalysis['High'].good }} were correctly mitigated.</td></tr>
              <tr><td>No risk (controls)</td><td>You completed {{ goodMitigationAnalysis['N/A'].total }} control scenarios. Out of these {{ goodMitigationAnalysis['N/A'].total }} were correctly mitigated.</td></tr>
              <tr>
                <td>Alert / advisory intervention types</td>
                <td>
                  <p>
                    Out of {{ scenarioTotal - excludedTests() }} valid prescribing tests completed, {{ systemInterventionAnalysis.total }} were recorded as completed with system/user intervention. 
                    {{ systemInterventionAnalysis.alertOnly }} of these responses were reported as alerts, {{ systemInterventionAnalysis.advisoryOnly }} reported as advisory notifications and 
                    {{ systemInterventionAnalysis.both }} reported as both.
                  </p>                
                  <p>
                    This would be considered as a {{ alertRelianceLevel() }} reliance on alerts. A high level of alerting can indicate an over-reliance on alerting and may lead to user 'alert fatigue'.
                  </p>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-white text-center"><td colspan="3">Table 1. Breakdown of prescribing tests taken</td></tr>
            </tfoot>
          </table>
        </div>
        
        <div class="report-page">
          <h3>Mandatory Questions</h3>
          <p>
            In the ePRaSE tool all users complete the same mandatory questions distributed within a set of other randomised questions. A breakdown of your mandatory questions, 
            results, and explanatory outcomes is detailed below in Table 2. 
          </p>
          <table class="table table-bordered">
            <thead>
              <tr><th>Drug name</th><th>Test</th><th>Result</th><th>Advice</th></tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in requiredScenarioAnalysis">
                <td>{{ value.drugName }}</td>
                <td>{{ value.explanation }}</td>
                <td>{{ value.userResponse }}</td>
                <td v-if="value.result === true">Good mitigation</td>
                <td v-if="value.result !== true">{{ value.badMitigationFeedback }}</td>
              </tr>            
            </tbody>
            <tfoot>
              <tr class="border-white text-center"><td colspan="4">Table 2. Mandatory question results</td></tr>
            </tfoot>
          </table>
        </div>
        
        <div class="report-page">
          <h3>Configuration test results</h3>
          <p>
            In the ePRaSE tool users are presented with a block of configuration questions, which are designed to examine EP system set up in areas which do not easily lend themselves to prescribing tests. 
            Your configuration tests results are presented on Table 3 below.
          </p>
          <div v-if="!Array.isArray(configQuestionAnalysis) || configQuestionAnalysis.length == 0">
            <div class="d-flex align-items-center">
              <strong role="status">Loading configuration analysis...</strong>
              <div class="spinner-border ms-auto" aria-hidden="true"></div>
            </div>
          </div>
          <table v-if="Array.isArray(configQuestionAnalysis) && configQuestionAnalysis.length != 0" class="table table-bordered">
            <thead>
              <tr><th>Question</th><th>Result</th><th>Advice</th></tr>
            </thead>
            <tbody>        
              <tr v-for="cqa in configQuestionAnalysis">
                <td>{{ cqa.config_error.description }}</td>
                <td>{{ cqa.result == 1 ? 'Yes' : 'No' }}</td>
                <td>{{ (cqa.result == 1 ? 'yes' : 'no') == cqa.config_error.good_answer ? cqa.config_error.good_answer_response : cqa.config_error.undesirable_answer_response }}</td>
              </tr>                
            </tbody>
            <tfoot>
              <tr class="border-white text-center"><td colspan="3">Table 3. Configuration tests results</td></tr>
            </tfoot>
          </table>
        </div>
        
        <div class="report-page">
          <h3>Clinical Decision Support Category Results</h3>
          <p>
            The Clinical Decision Support (CDS) stacked chart 1. below illustrates the different levels of  mitigation (good, some, no and over mitigation) within each category. 
            Please review your results, bearing in mind what you know about how your system is built and in the context of the number of questions you have executed in each category 
            which can be seen by hovering over the bars on the online tool chart. 
          </p>
          <div ref="barChartContainer"></div>
          <p>Chart 1. Overview of mitigation scores within CDS categories</p>
          <p>
            On completion of each annual campaign the ePRaSE team will pool all data to provide an anonymised set of reports for benchmarking purposes. 
            These will be published on the <a href="https://eprase.info" target="_blank">eprase.info</a> website. Where you have provided consent, your 
            data may be shared at later date with other users and or EP system suppliers to  support learning on EP system optimisation.
          </p>
        </div>
        
        <h3>Saving your assessment results</h3>
        <p>
          Please print your report in PDF landscape format and save for future reference. The tool is closed at the end of each annual campaign for development and users 
          will not be able to access the online platform. 
        </p>
        <ButtonElement name="assemblePrintablePdf"
          :disabled="!dataLoaded"
          :columns="4"
          @click="assemblePrintableReport"
        >Create printable PDF
        </ButtonElement>
      </StaticElement>
    </GroupElement>    
  </GroupElement>
</template>

<script>      

import { calcNum, calcPercentage } from '../helpers/utils'
import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import { assessmentStore } from '../stores/assessment'
import { authenticationStore } from '../stores/authentication'
import Plotly from 'plotly.js-dist-min'
import { nextTick } from 'vue'
import bsColors from '../assets/scss/variables.scss'
import { appSettingsStore } from '../stores/appSettings'

export default {
  name: 'AssessmentFinalReport',  
  computed: {
    ...mapState(appSettingsStore, ['year']),
    ...mapState(assessmentStore, ['dataReady', 'mitigationSummary', 'assessmentData', 'getPatientScenarioResponses', 'getConfigQuestionData', 'updateAssessmentStatus']),
    ...mapState(authenticationStore, ['orgName', 'isReporter']),
    ...mapState(rootStore, ['storePrintableReportData', 'getInstitutionDetails']),
    dataLoaded() {
      return this.auxiliaryDataReady && this.dataReady
    },
    epSystemName() {
      return this.assessmentData.selection.otherEpService || this.assessmentData.selection.epService.label
    },
    epSystemYear() {
      return this.year
    },
    scenarioResponses() {
      return this.assessmentData.storedScenarioResponses
    },
    scenarioTotal() {
      return this.scenarioResponses.length
    },
    goodMitigationAnalysis() {
      return this.mitigationSummaries.goodMitigationByRiskAnalysis
    },
    systemInterventionAnalysis() {
      return this.mitigationSummaries.systemInterventionAnalysis
    },
    requiredScenarioAnalysis() {
      return this.mitigationSummaries.requiredScenarioAnalysis
    },
    configQuestionAnalysis() {
      return this.assessmentData.config.configQuestionResults
    },
    mitigationByCategoryAnalysis() {
      return this.mitigationSummaries.mitigationByCategoryAnalysis
    }
  },
  data() {
    return {
      institutionName: '',
      auxiliaryDataReady: false,
      mitigationSummaries: null
    }
  },
  methods: {
    excludedTests() {
      return this.scenarioResponses.filter(sr => sr.result == 'Invalid test').length
    },
    // All scenarios that resulted in alert or advisory from the ePrescribing system
    systemInterventionTests() {
      return this.scenarioResponses.filter(sr => sr.intervention_type == 'MT1').length
    },
    async getInstitutionName() {
      this.institutionName = this.orgName
      if (this.isReporter()) {
        // Get institution name from assessment
        const iresponse = await this.getInstitutionDetails(this.assessmentData.institution)
        if (iresponse.status < 400) {
          this.institutionName = iresponse.data.data.name
        } else {
          this.institutionName = 'Failed to get institution name'
        }
      } 
    },
    getHeading() {
      return `
        <h2>Assessment Report ${this.epSystemYear}</h2>
        <h3>Trust: ${this.institutionName()}</h3>
        <h4>EP System: ${this.epSystemName}</h4>
        <h4>Type of assessment: ${this.assessmentData.selection.patientType} inpatient</h4>
      `
    },
    assemblePrintableReport() {
      const tpl = new DocumentFragment()
      document.querySelectorAll('div.report-page').forEach(tbp => {
        const article = document.createElement('article')
        article.setAttribute('style', 'page-break-after: always; max-width: 1400px')
        article.innerHTML = tbp.innerHTML
        tpl.appendChild(article)
      })
      const serializer = new XMLSerializer()
      const tplHtml = serializer.serializeToString(tpl)
      this.storePrintableReportData(this.getHeading(), tplHtml, 'Preview')
      window.open(this.$router.resolve({
        path: '/printablepdf'
      }).href, '_blank')
    },
    alertRelianceLevel() {
      // Fix for #327 - should be calculated with the denominator equal to no of interventions, not total tests
      //const percentageAlerted = calcPercentage(this.systemInterventionAnalysis.total, this.scenarioTotal - this.excludedTests())
      const percentageAlerted = calcPercentage(this.systemInterventionAnalysis.alertOnly + this.systemInterventionAnalysis.both, this.systemInterventionTests())
      return percentageAlerted <= 33 ? 'low' : (percentageAlerted <= 66 ? 'medium' : 'high')
    },
    renderPieChart() {

      console.group('renderPieChart()')

      const plotDiv = this.$refs.pieChartContainer

      const piePlot = Plotly.newPlot(plotDiv, [{
        values: this.mitigationSummaries.mitigationFrequencyAnalysis.percentages,       
        labels: this.mitigationSummaries.mitigationFrequencyAnalysis.mitigations,
        marker: {
          colors: this.mitigationSummaries.mitigationFrequencyAnalysis.colors
        },        
        type: 'pie'
      }], {
        width: 1000,
        height: 600
      }, {displayModeBar: false})

      // Disable nonsense events clicking on the legend
      plotDiv.on('plotly_legendclick', () => { return false })
      plotDiv.on('plotly_legenddoubleclick', () => { return false })

      console.groupEnd()
    },  
    renderCdsBarChart() {

      console.group('renderCdsBarChart()')

      const plotDiv = this.$refs.barChartContainer
      const categoryNames = Object.keys(this.mitigationByCategoryAnalysis)
      const categorySubkeys = ['good', 'some', 'not', 'over', 'invalid']
      const colorMapping = [bsColors.successColor, bsColors.warningColor, bsColors.dangerColor, bsColors.infoColor, bsColors.invalidColor]
      const mitigationByCategoryData = []
      const legendText = { 'good': 'Good mitigation', 'some': 'Some mitigation', 'not': 'No mitigation', 'over': 'Over mitigation', 'invalid': 'Invalid test' }

      categorySubkeys.forEach((csk, cskIdx) => {
        const yArr = [], customdata = []
        for (const [categoryName, analysis] of Object.entries(this.mitigationByCategoryAnalysis)) {
          const percentInCat = calcNum(analysis[csk], analysis.total)
          yArr.push(percentInCat)
          customdata.push(`${percentInCat}% of ${analysis.total} question${analysis.total != 1 ? 's' : ''}`)
        }
        mitigationByCategoryData.push({
          x: categoryNames,
          y: yArr,
          customdata: customdata,
          marker: {
            color: colorMapping[cskIdx]
          },
          hovertemplate: '%{customdata}', // See e.g. https://codepen.io/etpinard/pen/zXLEXJ?editors=0010
          name: legendText[csk],
          type: 'bar',
          orientation: 'v'
        })
      })

      Plotly.newPlot(plotDiv, mitigationByCategoryData, {
        barmode: 'stack',
        width: 1280,
        height: 800,
        showlegend: true,
        legend: {
          entrywidth: 400
        },
        title: {
          text: 'Overview of mitigation scores within clinical decision support (CDS) categories',
          font: { size: 24, weight: 700 }
        },
        // https://stackoverflow.com/questions/36596947/long-tick-labels-getting-cut-off-in-plotly-js-chart
        xaxis: { title: { text: 'CDS Category', standoff: 50, font: { size: 16, weight: 700 } }, automargin: true, tickangle: -90 },
        yaxis: { title: { text: 'Tests completed (%)', font: { size: 16, weight: 700 } } }
      }, { displayModeBar: false })

      // Disable nonsense events clicking on the legend
      plotDiv.on('plotly_legendclick', () => { return false })
      plotDiv.on('plotly_legenddoubleclick', () => { return false })

      console.groupEnd()
    }
  },
  async mounted() {
    console.group('AssessmentFinalReport mounted()')

    this.auxiliaryDataReady = false

    const updateResponse = await this.updateAssessmentStatus('Assessment complete', true)
    if (updateResponse !== true) {
      throw new Error(updateResponse)
    }
    const storedResultsResponse = await this.getPatientScenarioResponses(true)
    if (storedResultsResponse !== true) {
      throw new Error(storedResultsResponse)
    } 
    const storedConfigResponse = await this.getConfigQuestionData(true)
    if (storedConfigResponse !== true) {
      throw new Error(storedConfigResponse)
    }
    await this.getInstitutionName()

    // Create hash object to count mitigation types
    this.mitigationSummaries = this.mitigationSummary()

    this.auxiliaryDataReady = true
    this.$nextTick(() => {
      this.renderPieChart()
      this.renderCdsBarChart()
    })
    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentFinalReport beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>