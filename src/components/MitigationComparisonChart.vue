<template>
  <h3>Institution Mitigation Comparison</h3>
  <p>This chart gives an overview of each institutions mitigation results </p>
  <div ref="allMitigationsChartContainer" class="mb-4"></div>
</template>

<script>

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
  },
  emits: ['get-mitigation-fail'],
  methods: {
    renderChart() {

      console.group('MitigationComparisonChart - renderChart()')

      console.info('Will be implementedi in PowerBI')
      console.debug(this.chartData)
      Plotly.newPlot(this.$refs.allMitigationsChartContainer, this.chartData, {
        barmode: 'stack',
        width: 900,
        height: 700
      }, {displayModeBar: false})

      console.groupEnd()
    },
    async getMitigationResultsByInstitution() {
      const response = await rootStore().getAllMitigationResults()
      if (response.status < 400) {
        this.chartData = []
        const orgNamesSystems = response.data.map(d => `${d.institution.orgName} (${d.epSystem})`)
        const mkeys = ['goodMitigation', 'someMitigation', 'notMitigated', 'overMitigated', 'invalidTests']
        mkeys.forEach(mk => {
          const chartBlock = {
            x: orgNamesSystems,
            y: [],
            name: mk.substring(0, 1).toUpperCase() + mk.substring(1),
            type: 'bar'
          }
          chartBlock.y = response.data.map(d => d[mk])
          this.chartData.push(chartBlock)
        })
        this.renderChart()
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
