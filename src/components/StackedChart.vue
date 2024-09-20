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
        width: 1280,
        height: 800,
        showlegend: true,
        legend: {
          entrywidth: 400
        },
        title: {
          text: 'Overview of mitigation scores within clinical decision support (CDS) categories',
          font: {
            size: 24,
            weight: 700
          }
        },
        // https://stackoverflow.com/questions/36596947/long-tick-labels-getting-cut-off-in-plotly-js-chart
        xaxis: {
          title: {
            text: 'Tests completed (%)',
            font: {
              size: 16,
              weight: 700
            }  
          }                  
        },
        yaxis: {
          title: {
            text: 'CDS Category',
            standoff: 50,
            font: {
              size: 16,
              weight: 700
            }  
          },        
          automargin: true
        }
      }, {displayModeBar: false})
       
      console.groupEnd()
    }
  }
}

</script>

<style scoped></style>
