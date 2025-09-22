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
        <h2>ePRaSE Tool Assessment Report {{ new Date().getFullYear() }}</h2>
        <h3>Trust: {{ orgName }}</h3>
        <h3>EP System: {{ epSystemName }}</h3>
        <h3>Type of assessment: {{ assessmentData.selection.patientType }} inpatient</h3>
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
          Invalid results are where a test presented a medicine which was not in the users’ EP system and the question was passed over. 
        </p>
        <p>
          Table (1) below illustrates how the scores are allocated based on the users recorded response to a test scenario compared to the predesignated 
          expected response for a particular test scenario.
        </p>
        <table class="table table-bordered border-white text-center">
          <thead>
            <tr>
              <th class="bg-primary p-2"></th>
              <th class="bg-primary p-2"></th>
              <th class="bg-primary p-2 w-75 text-white" colspan="3">Prescribing risk test scenario predesignated expected EP system response</th>
            </tr>            
          </thead>
          <tbody>
            <tr>
              <td class="bg-primary p-2"></td>
              <td class="bg-info p-2"></td>
              <td class="bg-info p-2 w-25">Prescription prevented</td>
              <td class="bg-info p-2 w-25">Prescription completed with system/user intervention</td>
              <td class="bg-info p-2 w-25">Prescription completed without system intervention (control questions)</td>
            </tr>
            <tr>
              <td class="bg-primary p-2" rowspan="4"><div class="fw-bold text-white" style="transform: rotate(270deg)"><span>User recorded response</span></div></td>
              <td class="bg-info-subtle p-2">You were able to complete the prescription without any additional user or system input</td>
              <td class="bg-info-subtle p-2 w-25">No mitigation</td>
              <td class="bg-info-subtle p-2 w-25">No mitigation</td>
              <td class="bg-info-subtle p-2 w-25">Good mitigation</td>
            </tr>
            <tr>
              <td class="bg-info p-2">You were able to complete the prescription, but had to override components of the order sentence</td>
              <td class="bg-info p-2 w-25">Some mitigation</td>
              <td class="bg-info p-2 w-25">Some mitigation</td>
              <td class="bg-info p-2 w-25">Over mitigation</td>
            </tr>
            <tr>
              <td class="bg-info-subtle p-2">You were able to complete the prescription, with system/user intervention</td>
              <td class="bg-info-subtle p-2 w-25">Some mitigation</td>
              <td class="bg-info-subtle p-2 w-25">Good mitigation</td>
              <td class="bg-info-subtle p-2 w-25">Over mitigation</td>
            </tr>
            <tr>
              <td class="bg-info p-2">Prevented from prescribing</td>
              <td class="bg-info p-2 w-25">Good mitigation</td>
              <td class="bg-info p-2 w-25">Over mitigation</td>
              <td class="bg-info p-2 w-25">Over mitigation</td>
            </tr>
          </tbody>
          <tfoot>
            <tr><td colspan="5">Table 1</td></tr>
          </tfoot>
        </table>
        <h3>EPRaSE Assessment breakdown of results for {{ new Date().getFullYear() }}</h3>
        <h4>Overview of prescribing test results</h4>
        <p>
          The total number of valid prescribing tests completed (excluding configuration questions) = {{ scenarioTotal }}
        </p>
        <p>
          The total number of prescribing tests excluded (described as invalid test in the pie chart) due to medication not being available in the 
          users EP system or the user skipped the question for another reason = {{ excludedTests() }}
        </p>
        <p>
          Table (2) below details the total number of prescribing tests completed, broken down by risk category. In addition, information is provided 
          on the number and type of alerts record by your trust where an intervention was recorded.
        </p>
        <table class="table table-bordered">
          <thead>
            <tr><th>Prescribing risk category</th><th>Outcome</th></tr>
          </thead>
          <tbody>
            <tr><td>Extreme risk</td><td>You completed {{ }} extreme risk scenarios. Out of these {{  }} were correctly mitigated.</td></tr>
            <tr><td>High risk</td><td>You completed {{ }} high risk scenarios. Out of these {{  }} were correctly mitigated.</td></tr>
            <tr><td>No risk (controls)</td><td>You completed {{ }} control scenarios. Out of these {{  }} were correctly mitigated.</td></tr>
            <tr>
              <td>Alert / advisory intervention types</td>
              <td>
                <p>
                  Out of {{  }} valid prescribing tests completed, {{  }} were recorded as completed with system/user intervention. 
                  {{  }} of these responses were reported as alerts, {{  }} reported as advisory notifications and {{  }} reported as both.
                </p>                
                <p>
                  This would be considered as a {{  }} reliance on alerts. A high level of alerting can indicate an over-reliance on alerting and may lead to user 'alert fatigue'.
                </p>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-white text-center"><td colspan="2">Table 2</td></tr>
          </tfoot>
        </table>
      </StaticElement>
      <!-- TODO -->
    </GroupElement>    
  </GroupElement>
</template>

<script>

import { mapState } from 'pinia'
import { assessmentStore } from '../stores/assessment'
import { authenticationStore } from '../stores/authentication'
import Plotly from 'plotly.js-dist-min'
import { nextTick } from 'vue'

export default {
  name: 'AssessmentFinalReport',  
  computed: {
    ...mapState(assessmentStore, ['dataReady', 'mitigationSummary', 'assessmentData', 'getPatientScenarioResponses', 'getConfigQuestionData']),
    ...mapState(authenticationStore, ['orgName']),
    dataLoaded() {
      return this.auxiliaryDataReady && this.dataReady
    },
    epSystemName() {
      return this.assessmentData.selection.otherEpService || this.assessmentData.selection.epService.label
    },
    scenarioResponses() {
      return this.assessmentData.storedScenarioResponses
    },
    scenarioTotal() {
      return this.scenarioResponses.length
    }
  },
  data() {
    return {
      auxiliaryDataReady: false
    }
  },
  methods: {
    excludedTests() {
      return this.scenarioResponses.filter(sr => sr.result == 'Invalid test').length
    },
    renderPieChart() {

      console.group('PieChart - renderChart()')

      // Create hash object to count mitigation types
      const mitigationHash = this.mitigationSummary()
      const plotDiv = this.$refs.pieChartContainer

      const piePlot = Plotly.newPlot(plotDiv, [{
        values: mitigationHash.frequencies,       
        labels: mitigationHash.mitigations,
        marker: {
          colors: mitigationHash.colors
        },        
        type: 'pie'
      }], {
        width: 1000,
        height: 600
      }, {displayModeBar: false})

      // Disable nonsense events clicking on the legend
      plotDiv.on('plotly_legendclick', () => { return false })
      plotDiv.on('plotly_legenddoubleclick', () => { return false })

      // plotDiv.on('plotly_afterplot', () => {
      //   // Desperate attempt to get round the plotly legend label cutoff problem - see final contribution at
      //   // https://community.plotly.com/t/legend-text-is-being-truncated-cut-off/41207/9
      //   plotDiv.querySelectorAll('g.traces').forEach(entry => {         
      //     entry.setAttribute('transform', entry.getAttribute('transform').replace('(0', '(-25'))
      //     // Adjust the swatch
      //     entry.querySelector('path.legendpie').setAttribute('transform', 'translate(30,0)')
      //   })
      // })

      console.groupEnd()
    }  
    
  },
  async mounted() {
    console.group('AssessmentFinalReport mounted()')

    this.auxiliaryDataReady = false

    const storedResultsResponse = await this.getPatientScenarioResponses(true)
    if (storedResultsResponse !== true) {
      throw new Error(storedResultsResponse)
    } 
    const storedConfigResponse = await this.getConfigQuestionData(true)
    if (storedConfigResponse !== true) {
      throw new Error(storedConfigResponse)
    } 

    this.auxiliaryDataReady = true

    await nextTick()
    this.renderPieChart()

    console.groupEnd()
  },
  beforeUnmount() {
    console.group('AssessmentFinalReport beforeUnmount()')
    console.groupEnd()
  }
}
</script>

<style scoped></style>