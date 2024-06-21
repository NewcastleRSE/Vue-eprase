<template>
  <div ref="stackedChartContainer">
    <GChart :settings="{ packages: ['corechart', 'bar'] }" type="ColumnChart" :options="chartOptions.chart" :data="chartData" />
  </div>
</template>

<script>

import { GChart } from "vue-google-charts"

export default {
  name: "StackedChart",
  props: {
    mydata: {
      type: Array
    }
  },
  components: {
    GChart
  },
  data() {
    return {
      chartData: null,
      chartOptions: {
        chart: {
          title: 'Risk Mitigation Summary',
          hAxis: {
            title: 'Error category',
            slantedText: true,
            slantedTextAngle: 45
          },
          vAxis: {
            title: 'Percentage Response',
            minValue: 0,
            maxValue: 100
          },
          isStacked: true,
          colors: ['#35d635', '#FFBF00', '#ff3b33', '#66b4ea'],
          width: 1000,
          height: 900
        }
      },
    }
  },
  mounted() {

    console.group('StackedChart - mounted()')

    console.assert(this.mydata.length > 0, 'No mitigation data supplied')

    this.chartData = [
      [
        {label: 'Error Category', type: 'string'},
        {label: 'Good mitigation', type: 'number'},
        {label: 'Some mitigation', type: 'number'},
        {label: 'Not mitigated', type: 'number'},
        {label: 'Over mitigated', type: 'number'}
      ]
    ]
    this.mydata.forEach(cd => {        
      this.chartData.push([cd.category, cd.good, cd.some, cd.not, cd.over])
    })

    console.groupEnd()
  }
}

</script>

<style scoped></style>
