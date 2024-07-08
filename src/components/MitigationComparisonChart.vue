<template>
  <h3>Institution Mitigation Comparison</h3>
  <p>This chart gives an overview of each institutions mitigation results</p>
  <div ref="allMitigationsChartContainer" id="allMitigationsChartContainer" class="mb-4"></div>
  <div class="mb-4">
    <PrintablePdf :heading="'Institution Mitigation Comparison'" :printableElementId="'allMitigationsChartContainer'" :buttonCaption="'Printable PDF'" />
  </div>
</template>

<script>

import PrintablePdf from './PrintablePdf'
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
  components: {
    PrintablePdf
  },
  emits: ['get-mitigation-fail'],
  methods: {
    renderChart() {

      console.group('MitigationComparisonChart - renderChart()')

      console.debug('Chart data', this.chartData)
      Plotly.newPlot(this.$refs.allMitigationsChartContainer, this.chartData, {
        barmode: 'stack',
        width: 900,
        height: 700
      }, {displayModeBar: false})

      console.groupEnd()
    },
    async getMitigationResultsByInstitution() {
      this.chartData = rootStore().mitigationChartData
      if (this.chartData == null) {
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
          rootStore().storeMitigationChartData(this.chartData)
          this.renderChart()
        } else {
          this.$emit('get-mitigation-fail', response.message)
        }
      } else {
        this.renderChart()
      }      
    }
  },
  mounted() {
    this.getMitigationResultsByInstitution()
  }
}
</script>

<style scoped></style>
