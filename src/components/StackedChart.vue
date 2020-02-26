<template>
  <section class="section">
    <div class="container">
      <div id="combined-chart" style="width: 900px; height: 500px;">
        <GChart
          :settings="{ packages: ['corechart', 'bar']}"
          type="ColumnChart"
          :data="chartData"
          :options="chartOptions"
          style="width: 900px; height: 500px;"
          @ready="onChartReady"
          ref="gChart"
        />
      </div>
    </div>
  </section>

</template>

<script>

  import { GChart } from "vue-google-charts";

      export default {
          name: "StackedChart",
          components: {
            GChart
          },
          data() {
              return {
                  chartData: null,
                  chartOptions: {
                      chart: {
                        title: ''
                      },
                      hAxis: {
                        title: 'Error category',
                      },
                      vAxis: {
                        title: 'Percentage Response',
                        minValue: 0,
                        maxValue: 100
                      },
                      isStacked: true,
                      colors: [ '#35d635','#FFBF00', '#ff3b33','#cd0a2a'],
                      width: 900,
                      height: 500
                  },
              }
          },
          methods: {
              onChartReady(chart, google) {
                // now we have google lib loaded. Let's create data table based using it.
                this.createDataTable(chart, google);
              },
              // Array will be automatically processed with visualization.arrayToDataTable function
              createDataTable(chart, google) {

                var data = google.visualization.arrayToDataTable([
                  ['Error Category', 'Good mitigation', 'Some mitigation', 'Not mitigated', 'Over mitigated'],
                  ['Drug age',  50, 50, 0, 0],
                  ['Drug dose',  83, 17, 0, 0],
                  ['Drug interaction',  75, 0, 0, 25],
                  ['Drug allergy',  100, 0, 0, 0],
                  ['Drug duplication',  100, 0, 0, 0],
                  ['Drug disease', 67, 22, 11, 0],
                  ['Drug omissions',  100, 0, 0, 0],
                  ['Theraputic duplication',  100, 0, 0, 0],
                  ['Drug lab',  50, 50, 0, 0],
                  ['Drug brand',  100, 0, 0, 0],
                  ['Drug route',  50, 50, 0, 0],
                  ['Drug overdose',  100, 0, 0, 0]
                ]);

                var view = new google.visualization.DataView(data);
                chart.draw(view, this.chartOptions);
              },
          }
    }

</script>

<style scoped>

</style>
