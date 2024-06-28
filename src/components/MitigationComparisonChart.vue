<template>
  <h3>Institution Mitigation Comparison</h3>
  <p>This chart gives an overview of each institutions mitigation results </p>
  <div ref="allMitigationsChartContainer"></div>
 </template>

<script>

//import Plotly from 'plotly.js-cartesian-dist-min'

export default {
  name: "MitigationComparisonChart",  
  data() {
    return {
      chartData: []
    }
  },
  methods: {
    renderChart() {

      console.group('MitigationComparisonChart - renderChart()')

      console.info('Will be implementedi in PowerBI')
      console.debug(this.chartData)
      // Plotly.newPlot(this.$refs.allMitigationsChartContainer, this.chartData, {
      //   barmode: 'stack',
      //   width: 900,
      //   height: 700
      // }, {displayModeBar: false})

      console.groupEnd()
    },
    async getMitigationResultsByInstitution() {
      const response = await rootStore().getAllMitigationResults()
      if (response.status < 400) {
        //const orgNamesSystems = response.data.map(d => `${d.institution.orgName} (${d.epSystem})`)
        //const mkeys = ['goodMitigation', 'someMitigation', 'notMitigated', 'overMitigated', 'invalidTests']
        this.chartData = response.data.map(d => [d.institution.orgName, d.goodMitigation, d.someMitigation, d.notMitigated, d.overMitigated, d.invalidTests, d.epSystem])        
      } else {
        this.$emit('get-mitigation-fail', response.message)
      }
    }
  },
  mounted() {
    this.getMitigationResultsByInstitution()
  }
}
</script>

<style scoped></style>
