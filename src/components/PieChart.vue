<template>
  <div ref="pieChartContainer">
    <GChart :settings="{ packages: ['corechart'] }" type="PieChart" :options="chartOptions.chart" :data="chartData" />
  </div>
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
      chartData: [
        ['Mitigation', 'Percentage'],
        ['Good mitigation', 0],
        ['Some mitigation', 0],
        ['Not mitigated', 0],
        ['Over mitigated', 0],
        ['Invalid tests', 0]
      ],
      chartOptions: {
        chart: {
          title: 'EPMA Risk Mitigation',          
          is3D: false,
          colors: ['#35d635', '#FFBF00', '#ff3b33', '#66b4ea', '#808080'],
          width: 900,
          height: 500
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
  mounted() {

    console.group('PieChart - mounted()')

    console.assert(this.goodMitigation != '', 'good mitigation not set')
    console.assert(this.someMitigation != '', 'some mitigation not set')
    console.assert(this.notMitigated != '', 'not mitigated not set')
    console.assert(this.overMitigated != '', 'over mitigated not set')
    console.assert(this.nullTests != '', 'null tests not set')

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
</script>

<style scoped></style>
