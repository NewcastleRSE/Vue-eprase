<template>
  <div ref="stackedChartContainer" id="stackedChartContainer">
    <div v-if="dataLoading">Loading chart data...</div>
  </div>
</template>

<script>

import Plotly from 'plotly.js-dist-min'

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

      const plotDiv = this.$refs.stackedChartContainer

      Plotly.newPlot(plotDiv, this.mydata, {
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

      // Disable nonsense events clicking on the legend
      plotDiv.on('plotly_legendclick', () => { return false })
      plotDiv.on('plotly_legenddoubleclick', () => { return false })

      plotDiv.on('plotly_afterplot', () => {
        // Desperate attempt to get round the plotly legend label cutoff problem - see final contribution at
        // https://community.plotly.com/t/legend-text-is-being-truncated-cut-off/41207/9
        plotDiv.querySelectorAll('g.traces').forEach(entry => {
          console.debug(entry.getAttribute('transform'))         
          entry.setAttribute('transform', entry.getAttribute('transform').replace('(0', '(-25'))
          // Adjust the swatch
          entry.querySelector('path.legendundefined').setAttribute('transform', 'translate(30,0)')
        })
      })
       
      console.groupEnd()
    }
  }
}

</script>

<style scoped></style>
