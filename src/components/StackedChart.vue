<template>
  <div ref="stackedChartContainer" id="stackedChartContainer">
    <div v-if="dataLoading">Loading chart data...</div>
  </div>
</template>

<script>

import Plotly from 'plotly.js-cartesian-dist-min'

export default {
  name: "StackedChart",
  props: {
    mydata: {
      type: Array
    },
    heading: '',
    dataLoading: true
  }, 
  watch: {
    dataLoading(newVal) {
      if (newVal === false) {
        console.debug('Stacked chart data has all loaded')
        this.renderChart()
      }
    }
  },
  methods: {

    renderChart() {

      console.group('StackedChart - renderChart()')

      Plotly.newPlot(this.$refs.stackedChartContainer, this.mydata, {
        barmode: 'stack',
        width: 900,
        height: 700,
        // https://stackoverflow.com/questions/36596947/long-tick-labels-getting-cut-off-in-plotly-js-chart
        yaxis: {
          automargin: true
        }
      }, {displayModeBar: false})
       
      console.groupEnd()
    }
  }
}

</script>

<style scoped></style>
