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
                  chartData: this.mydata,
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

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Error Category');
                data.addColumn('number', 'Good mitigation');
                data.addColumn('number', 'Some mitigation');
                data.addColumn('number', 'Not mitigated');
                data.addColumn('number', 'Over mitigated');

                let rows = [];

                console.log('in stacked chart');
                console.log(this.chartData);

                for(let index in this.chartData){
                    if(this.chartData.hasOwnProperty(index)){
                      this.category = this.chartData[index].category;
                      this.good = this.chartData[index].good;
                      this.some = this.chartData[index].some;
                      this.not = this.chartData[index].not;
                      this.over = this.chartData[index].over;

                      rows[index] = [];
                      rows[index][0] = this.category;
                      rows[index][1] = this.good;
                      rows[index][2] = this.some;
                      rows[index][3] = this.not;
                      rows[index][4] = this.over;
                    }
                }
                data.addRows(rows);

                var view = new google.visualization.DataView(data);
                chart.draw(view, this.chartOptions);
              },
          }
    }

</script>

<style scoped>

</style>
