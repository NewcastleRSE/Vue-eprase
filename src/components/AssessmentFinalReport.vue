<template>
  <GroupElement name="finalReportGroup" :class="'mb-4'">   
    <GroupElement name="finalReport">
      <StaticElement name="finalReportHeading">
        <h2>ePRaSE Tool Assessment Report {{ epSystemYear }}</h2>
        <h3>Trust: {{ institutionName }}</h3>
        <h3>ePrescribing system: {{ epSystemName }}</h3>
        <h3>Type of assessment: {{ assessmentData.selection.patientType }} inpatient</h3>
        <div class="report-page">
          <p>Summary of risk mitigation performance for your system across all the prescribing tests executed.</p>
          <div ref="pieChartContainer">
            <div v-if="!dataLoaded" class="d-flex align-items-center">
              <strong role="status">Loading final report data for assessment...</strong>
              <div class="spinner-border ms-auto" aria-hidden="true"></div>
            </div>
          </div>
          <p>
            Good mitigation of the prescribing assessments in the ePRaSE tool is defined as where an ePrescribing system correctly identifies a risk of error, 
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
            Invalid results are where a test presented a medicine which was not in the user's ePrescribing system and the question was passed over. 
          </p>
        </div>
        
        <div class="report-page">
          <h3>EPRaSE Assessment breakdown of results for {{ epSystemYear }}</h3>
          <h4>Overview of prescribing test results</h4>
          <p>
            The total number of valid prescribing tests completed = {{ scenarioTotal - excludedTests() }}
          </p>
          <p>
            The total number of prescribing tests excluded due to medication being recorded as unable to perform test = {{ excludedTests() }}
          </p>
          <p>
            Table (1) below details the total number of prescribing tests completed, broken down by risk category.
          </p>
          <div v-if="!dataLoaded" class="d-flex align-items-center">
            <strong role="status">Loading final report data for assessment...</strong>
            <div class="spinner-border ms-auto" aria-hidden="true"></div>
          </div>
          <table v-if="dataLoaded" class="table table-bordered">
            <thead>
              <tr><th>Prescribing risk category</th><th>Outcome</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Extreme risk</td>
                <td>You completed {{ goodMitigationAnalysis['Extreme'].total }} extreme risk scenarios. Out of these, {{ formatScenarioQuantity(goodMitigationAnalysis['Extreme'].good) }} the system responded appropriately.</td>
              </tr>
              <tr>
                <td>High risk</td>
                <td>You completed {{ goodMitigationAnalysis['High'].total }} high risk scenarios. Out of these, {{ formatScenarioQuantity(goodMitigationAnalysis['High'].good) }} the system responded appropriately.</td>
              </tr>
              <tr>
                <td>No risk / Control</td>
                <td>You completed {{ goodMitigationAnalysis['N/A'].total }} control scenarios. Out of these, {{ formatScenarioQuantity(goodMitigationAnalysis['N/A'].good) }} the system responded appropriately with no system intervention.</td>
              </tr>
              <!-- Removed 24/07/2026 - https://github.com/NewcastleRSE/Vue-eprase/issues/480 -->
              <!-- <tr>
                <td>System interventions</td>
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
              </tr> -->
            </tbody>
            <tfoot>
              <tr class="border-white text-center"><td colspan="3">Table 1. Breakdown of prescribing tests taken</td></tr>
            </tfoot>
          </table>
        </div>

        <div v-if="assessmentData.selection.patientType == 'Adult'" class="report-page">
          <div class="alert alert-warning">
            <p>
              Please note that the information below is provided to support learning and development. Not all extreme-risk scenarios within the ePRaSE assessment are mandatory, 
              and users may have completed different additional extreme-risk scenarios from those summarised. To maintain the integrity of the assessment, the information provided 
              is intended as high-level educational guidance only, highlighting key medication safety themes that may be encountered within the extreme-risk category. It should not 
              be interpreted as a record of the specific questions completed by any individual user.
            </p>
            <p>Examples of the sorts of scenario that meet extreme risk are:</p>
            <ul class="list-group">
              <li class="list-group-item">
                <span class="fw-bold">Folate antagonists (e.g. trimethoprim):</span> High-risk medicine interactions that may significantly increase toxicity and serious adverse effects when used with certain treatments.
              </li>
              <li class="list-group-item">
                <span class="fw-bold">High-risk teratogens (e.g. topiramate, valproate):</span> Pregnancy prevention safety concerns requiring additional safeguards for individuals of child-bearing potential due to the risk of harm to an unborn baby.
              </li>
              <li class="list-group-item">
                <span class="fw-bold">Fluoroquinolones:</span> Contraindications relating to a patient's medical history where use may lead to serious musculoskeletal or other significant adverse effects.
              </li>
              <li class="list-group-item">
                <span class="fw-bold">Methotrexate:</span> Critical prescribing safety risks involving incorrect medicine selection or dosing frequency that could result in severe overdose consequences.
              </li>
              <li class="list-group-item">
                <span class="fw-bold">Cephalosporins:</span> Allergy-related safety checks to prevent prescribing in patients with a recorded severe allergy to a related class of medicines.
              </li>
              <li class="list-group-item">
                <span class="fw-bold">Nitrofurantoin:</span> Renal function-related contraindications where reduced kidney function may lead to treatment failure and increased risk of toxicity.
              </li>
            </ul>
          </div>
          <!-- <div v-if="assessmentData.selection.patientType == 'Paediatric'" class="alert alert-warning">
            <p>
              Please note that the information below is provided to support learning and development. Not all extreme-risk scenarios within the ePRaSE assessment are mandatory, 
              and users may have completed different additional extreme-risk scenarios from those summarised. To maintain the integrity of the assessment, the information provided 
              is intended as high-level educational guidance only, highlighting key medication safety themes that may be encountered within the extreme-risk category. It should not 
              be interpreted as a record of the specific questions completed by any individual user.
            </p>
            <p>Examples of the sorts of scenario that meet extreme risk are:</p>
            <ul class="list-group">
              <li class="list-group-item">
                <span class="fw-bold">Long-acting insulin (e.g. Tresiba&reg;):</span> Incorrect prescribing frequency of a long-acting insulin resulting in significant hypoglycaemia risk
              </li>
              <li class="list-group-item">
                <span class="fw-bold">Electrolytes (e.g. Potassium replacement):</span> Dose and infusion rate safety in paediatric potassium replacement, with risk of fatal overdose.
              </li>
              <li class="list-group-item">
                <span class="fw-bold">Antiepileptic (e.g., Phenytoin):</span> Excessive IV administration rate leading to risk of cardiovascular toxicity and death
              </li>
              <li class="list-group-item">
                <span class="fw-bold">Folate antagonists (e.g. trimethoprim):</span> High-risk medicine interactions that may significantly increase toxicity and serious adverse effects when used with certain treatments.
              </li>
            </ul>
          </div> -->
        </div>
        
        <div class="report-page">
          <h3>Mandatory Questions</h3>
          <p>
            In the ePRaSE tool all users complete the same mandatory questions distributed within a set of other randomised questions. A breakdown of your mandatory questions, 
            results, and explanatory outcomes is detailed below in Table 2. 
          </p>
          <div v-if="!dataLoaded" class="d-flex align-items-center">
              <strong role="status">Loading final report data for assessment...</strong>
              <div class="spinner-border ms-auto" aria-hidden="true"></div>
            </div>
          <table v-if="dataLoaded" class="table table-bordered">
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
          <h3>Clinical Decision Support Category Results</h3>
          <p>
            The Clinical Decision Support (CDS) stacked chart 1. below illustrates the different levels of  mitigation (good, some, no and over mitigation) within each category. 
            Please review your results, bearing in mind what you know about how your system is built and in the context of the number of questions you have executed in each category 
            which can be seen by hovering over the bars on the online tool chart. 
          </p>
          <div ref="barChartContainer">
            <div v-if="!dataLoaded" class="d-flex align-items-center">
              <strong role="status">Loading final report data for assessment...</strong>
              <div class="spinner-border ms-auto" aria-hidden="true"></div>
            </div>
          </div>
          <p>Chart 1. Overview of mitigation scores within CDS categories</p>
          <p>
            On completion of each annual campaign the ePRaSE team will pool all data to provide an anonymised set of reports for benchmarking purposes. 
            These will be published on the <a href="https://eprase.info" target="_blank">eprase.info</a> website. Where you have provided consent, your 
            data may be shared at later date with other users and or ePrescribing system suppliers to  support learning on ePrescribing system optimisation.
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
          @click="openPrintableWindow"
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
import { appSettingsStore } from '../stores/appSettings'
import { assessmentListener } from '../helpers/audit'

export default {
  name: 'AssessmentFinalReport',  
  computed: {
    ...mapState(appSettingsStore, ['year', 'epraseTheme']),
    ...mapState(assessmentStore, ['dataReady', 'mitigationSummary', 'assessmentData', 'patientListBuild', 'getPatientScenarioResponses', 'updateAssessmentStatus', 'reportGenerated', 'reportPdf']),
    ...mapState(authenticationStore, ['orgCode', 'orgName', 'isReporter']),
    ...mapState(rootStore, ['storePrintableReportData', 'isReportArchived', 'getInstitutionDetails']),
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
    mitigationByCategoryAnalysis() {
      return this.mitigationSummaries.mitigationByCategoryAnalysis
    }
  },
  data() {
    return {
      institutionName: '',
      auxiliaryDataReady: false,
      mitigationSummaries: null,
      reportArchived: false
    }
  },
  methods: {
    formatScenarioQuantity(n) {
      return n + ' scenario' + (n != 1 ? 's' : '')
    },
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
        <h3>Trust: ${this.institutionName}</h3>
        <h4>ePrescribing system: ${this.epSystemName}</h4>
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
      this.storePrintableReportData(this.getHeading(), tplHtml, 'Preview', this.reportArchived)      
    },
    openPrintableWindow() {
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
      const bsColors = this.epraseTheme
      const colorMapping = [bsColors.success, bsColors.warning, bsColors.danger, bsColors.info, bsColors.invalid]
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
    assessmentStore().$onAction(assessmentListener)
    await this.getInstitutionName()
    // Check whether this report is already archived
    const archivedResponse = await this.isReportArchived(this.orgCode, this.epSystemName, this.assessmentData.selection.patientType)
    this.reportArchived = archivedResponse.status == 'archived'
    // Create hash object to count mitigation types
    this.mitigationSummaries = this.mitigationSummary()
    this.auxiliaryDataReady = true
    this.$nextTick(() => {
      this.renderPieChart()
      this.renderCdsBarChart()
      // Audit the report generation - NOTE this should save the report to the Azure blob store 
      // https://github.com/NewcastleRSE/Vue-eprase/issues/503
      this.$nextTick(() => {
        this.assemblePrintableReport()
        if (!this.reportArchived) {
          // Archive a PDF here
        }
      })
      this.reportGenerated()
    })
    console.groupEnd()
  },
  async beforeUnmount() {
    console.group('AssessmentFinalReport beforeUnmount()')
    let wasError = false
    if (!this.isReporter()) {
      const updateResponse = await this.updateAssessmentStatus('Assessment complete', true)
      wasError = await this.errorResponder(updateResponse)
    }   
    console.groupEnd()
  }
}
</script>

<style scoped></style>
