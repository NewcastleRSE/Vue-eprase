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
                  ['Drug age',  40, 50, 0, 10],
                  ['Drug dose',  80, 0, 20, 0],
                  ['Drug interaction',  80, 10, 10, 0],
                  ['Drug allergy',  50, 0, 50,0],
                  ['Drug duplication',  20, 40, 30, 10],
                  ['Drug disease', 60, 20, 10, 10],
                  ['Drug omissions',  75, 25, 0, 0],
                  ['Theraputic duplicate',  100, 0, 0, 0],
                  ['Drug lab',  0, 0, 0, 0],
                  ['Drug brand',  30, 50, 10, 10],
                  ['Drug route',  50, 30, 10, 10],
                  ['Drug overdose',  60, 40, 0, 0]
                ]);

                var view = new google.visualization.DataView(data);
                chart.draw(view, this.chartOptions);
              },
          }
    }

</script>

<style scoped>

</style>
