<template>
  <h3>Institution Mitigation Comparison</h3>

  <div v-if="! chartDataEmpty">
    <p>This chart gives an overview of each institutions mitigation results</p>
    <div ref="allMitigationsChartContainer" id="allMitigationsChartContainer" class="mb-4"></div> 
  </div>

  <div v-if="chartDataEmpty">
    <p>No assessments currently available</p>
  </div>
   
</template>

<script>

import bsColors from '../assets/scss/variables.scss'
import Plotly from 'plotly.js-cartesian-dist-min'
import { mapStores } from 'pinia'
import { rootStore } from '../stores/root'

export default {
  name: "MitigationComparisonChart", 
  data() {
    return {
      chartData: []
    }
  },
  computed: {
    ...mapStores(rootStore),
    chartDataEmpty() {
      return !Array.isArray(this.chartData) || this.chartData.length == 0
    }
  }, 
  emits: ['get-mitigation-fail'],
  methods: {
    renderChart() {

      console.group('MitigationComparisonChart - renderChart()')

      console.debug('Chart data', this.chartData)
      Plotly.newPlot(this.$refs.allMitigationsChartContainer, this.chartData, {
        barmode: 'stack',
        width: 900,
        height: 700
      }, {displayModeBar: false})

      console.groupEnd()
    },
    async getMitigationResultsByInstitution() {

      console.group('getMitigationResultsByInstitution()')

      this.chartData = rootStore().mitigationChartData
      console.debug('Stored mitigation chart data is', this.chartData)

      if (this.chartDataEmpty) {

        console.debug('Data is deemed empty - calling API...')
        const response = await rootStore().getAllMitigationResults()
        console.debug('Done')

        if (response.status < 400) {
          console.debug('API response', response.data)
          this.chartData = []
          const orgNamesSystems = response.data.map(d => `${d.institution.orgName} (${d.epSystem})`)
          const mkeys = ['goodMitigation', 'someMitigation', 'notMitigated', 'overMitigated', 'invalidTests']
          const colorMapping = [bsColors.successColor, bsColors.warningColor, bsColors.dangerColor, bsColors.infoColor, bsColors.invalidColor]
          mkeys.forEach((mk, mkIdx) => {
            const chartBlock = {
              x: orgNamesSystems,
              y: [],
              name: mk.substring(0, 1).toUpperCase() + mk.substring(1),
              type: 'bar',
              marker: {
                color: colorMapping[mkIdx]
              }
            }
            chartBlock.y = response.data.map(d => d[mk])            
            this.chartData.push(chartBlock)
          })
          if (!this.chartDataEmpty) {
            console.debug('Storing mitigation data', this.chartData)
            rootStore().storeMitigationChartData(this.chartData)
            this.renderChart()
          }           
        } else {
          this.$emit('get-mitigation-fail', response.message)
        }
      } else {
        console.debug('Rendering chart...')
        this.renderChart()
      } 
      console.groupEnd()     
    }
  },
  mounted() {
    this.getMitigationResultsByInstitution()
  }
}
</script>

<style scoped></style>
