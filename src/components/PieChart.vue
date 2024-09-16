<template>
  <div ref="pieChartContainer" id="pieChartContainer">
    <div v-if="dataLoading">Loading chart data...</div>
  </div>
</template>

<script>

import bsColors from '../assets/scss/variables.scss'
import Plotly from 'plotly.js-cartesian-dist-min'

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

      Plotly.newPlot(this.$refs.pieChartContainer, [{
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
        width: 1100,
        height: 600
      }, {displayModeBar: false})

      console.groupEnd()
    }
  }
}
</script>

<style scoped></style>
