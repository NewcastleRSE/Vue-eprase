<template>

  <section class="section">
    <div class="container pie-chart-container" >
      <GChart :settings="{ packages: ['corechart'] }" type="PieChart" :options="chartOptions" :data="chartData"
        @ready="onChartReady" />
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
      chartData: [],
      chartOptions: {
        chart: {
          title: 'EPMA Risk Mitigation',
          is3D: false,
          colors: ['#35d635', '#FFBF00', '#ff3b33', '#66b4ea', '#808080'],
          width: "900px",
          height: "500px" //TODO - get the chart size right
        }
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
    onChartReady() {

      console.group('onChartReady()')

      this.chartData = [
        ['Mitigation', 'Percentage'],
        ['Good mitigation', this.roundedGood],
        ['Some mitigation', this.roundedSome],
        ['Not mitigated', this.roundedNot],
        ['Over mitigated', this.roundedOver],
        ['Invalid tests', this.roundedNull]
      ]

      console.groupEnd()
    }
  }
}
</script>

<style scoped></style>
