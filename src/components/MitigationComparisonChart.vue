<template>
  <h3>Institution Mitigation Comparison</h3>
  <p>This chart gives an overview of each institutions mitigation results</p>
  <div ref="allMitigationsChartContainer" id="allMitigationsChartContainer" class="mb-4">
    <p v-if="chartDataEmpty">No assessments currently available</p>
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
      chartData: [],
      chartDataEmpty: true
    }
  },
  computed: {
    ...mapStores(rootStore)
  }, 
  emits: ['get-mitigation-fail'],
  methods: {
    renderChart() {

      console.group('MitigationComparisonChart - renderChart()')

      const renderElement = this.$refs.allMitigationsChartContainer
      console.debug('renderElement', renderElement)
      if (renderElement) {
        console.debug('Chart data', this.chartData)
        Plotly.newPlot(this.$refs.allMitigationsChartContainer, this.chartData, {
          barmode: 'stack',
          width: 900,
          height: 700
        }, {displayModeBar: false})
      }    
      
      console.groupEnd()
    },
    async getMitigationResultsByInstitution() {

      console.group('getMitigationResultsByInstitution()')

      const response = await rootStore().getAllMitigationResults()
      if (response.status < 400) {
        console.debug('API response', response.data)
        if (response.data.length > 0) {
          this.chartData = []
          this.chartDataEmpty = false
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
          this.renderChart()
        } else {
          this.chartDataEmpty = true
        }        
      } else {
        this.$emit('get-mitigation-fail', response.message)
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
