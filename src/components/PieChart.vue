<template>
  <div ref="pieChartContainer" id="pieChartContainer">
    <div v-if="dataLoading">Loading chart data...</div>
  </div>
</template>

<script>

import bsColors from '../assets/scss/variables.scss'
import Plotly from 'plotly.js-dist-min'

export default {
  name: "PieChart",
  props: {
    goodMitigation: '',
    someMitigation: '',
    notMitigated: '',
    overMitigated: '',
    nullTests: '',
    dataLoading: true,
    heading: ''
  },  
  watch: {
    dataLoading(newVal) {
      if (newVal === false) {
        console.debug('Pie chart data has all loaded')
        this.renderChart()
      }
    }
  },
  computed: {
    roundedGood() {
      return Math.round(this.goodMitigation)
    },
    roundedSome() {
      return Math.round(this.someMitigation)
    },
    roundedNot() {
      return Math.round(this.notMitigated)
    },
    roundedOver() {
      return Math.round(this.overMitigated)
    },
    roundedNull() {
      return Math.round(this.nullTests)
    }
  },
  methods: {
    renderChart() {

      console.group('PieChart - renderChart()')

      const plotDiv = this.$refs.pieChartContainer

      const piePlot = Plotly.newPlot(plotDiv, [{
        values: [
          this.roundedGood, this.roundedSome, this.roundedNot, this.roundedOver, this.roundedNull
        ],
        labels: [
          'Good mitigation', 'Some mitigation', 'Not mitigated', 'Over mitigated', 'Invalid tests'
        ],
        marker: {
          colors: [bsColors.successColor, bsColors.warningColor, bsColors.dangerColor, bsColors.infoColor, bsColors.invalidColor]
        },        
        type: 'pie'
      }], {
        width: 1200,
        height: 600
      }, {displayModeBar: false})

      // Disable nonsense events clicking on the legend
      plotDiv.on('plotly_legendclick', () => { return false })
      plotDiv.on('plotly_legenddoubleclick', () => { return false })

      plotDiv.on('plotly_afterplot', () => {
        // Desperate attempt to get round the plotly legend label cutoff problem - see final contribution at
        // https://community.plotly.com/t/legend-text-is-being-truncated-cut-off/41207/9
        plotDiv.querySelectorAll('g.traces').forEach(entry => {         
          entry.setAttribute('transform', entry.getAttribute('transform').replace('(0', '(-25'))
          // Adjust the swatch
          entry.querySelector('path.legendpie').setAttribute('transform', 'translate(30,0)')
        })
      })

      console.groupEnd()
    }
  }
}
</script>

<style scoped></style>
