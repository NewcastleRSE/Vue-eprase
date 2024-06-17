<template>

  <section class="section">
    <div class="container">
      <div id="pie-chart" style="width: 900px; height: 500px;">
        <GChart :settings="{ packages: ['corechart'] }" type="PieChart" :options="chartOptions"
          style="width: 900px; height: 500px;" @ready="onChartReady" ref="gChart" />
      </div>
    </div>
  </section>

</template>

<script>

import { GChart } from "vue-google-charts"

export default {
  name: "PieChart",
  props: {
    goodMitigation: '',
    someMitigation: '',
    notMitigated: '',
    overMitigated: '',
    nullTests: ''
  },
  components: {
    GChart
  },
  data() {
    return {
      chartOptions: {
        title: 'EPMA Risk Mitigation',
        is3D: false,
        colors: ['#35d635', '#FFBF00', '#ff3b33', '#66b4ea', '#808080'],
        width: 900,
        height: 500
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
    onChartReady(chart, google) {
      this.createDataTable(chart, google)
    },

    createDataTable(chart, google) {
      var container = document.getElementById('pie-chart')
      var chart = new google.visualization.PieChart(container)

      // uses computed variables rather than props directly
      var dataTable = new google.visualization.DataTable()
      dataTable.addColumn({ type: 'string', id: 'Mitigation' })
      dataTable.addColumn({ type: 'number', id: 'Percentage' })
      dataTable.addRows([
        ['Good mitigation', this.roundedGood],
        ['Some mitigation', this.roundedSome],
        ['Not mitigated', this.roundedNot],
        ['Over mitigated', this.roundedOver],
        ['Invalid tests', this.roundedNull]
      ])
      chart.draw(dataTable, this.chartOptions)
    }
  }
}
</script>

<style scoped></style>
