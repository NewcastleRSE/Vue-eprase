<template>
  <div ref="pieChartContainer" id="pieChartContainer">
    <div v-if="dataLoading">Loading chart data...</div>
  </div>
  <PrintablePdf :heading="heading" :printableElementId="'pieChartContainer'" :buttonCaption="'Printable PDF'"/>
</template>

<script>

import PrintablePdf from './PrintablePdf'
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
  components: {
    PrintablePdf
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
        type: 'pie'
      }], {
        width: 900,
        height: 500
      }, {displayModeBar: false})

      console.groupEnd()
    }
  }
}
</script>

<style scoped></style>
