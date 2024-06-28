<template>
  <div v-if="dataLoading">Loading chart data...</div>
  <div v-if="! dataLoading" ref="stackedChartContainer"></div>
</template>

<script>

import Plotly from 'plotly.js-cartesian-dist-min'

export default {
  name: "StackedChart",
  props: {
    mydata: {
      type: Array
    },
    dataLoading: true
  }, 
  watch: {
    dataLoading(newVal) {
      if (newVal === false) {
        console.debug('data has all loaded')
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
        height: 700
      }, {displayModeBar: false})
       
      console.groupEnd()
    }
  }
}

</script>

<style scoped></style>
