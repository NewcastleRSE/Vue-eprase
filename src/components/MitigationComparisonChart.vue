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
        name: "MitigationComparisonChart",
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
                title: 'Institution',
              },
              vAxis: {
                title: 'Percentage Mitigation Response',
                minValue: 0,
                maxValue: 120,
                textPosition: 'none',
                gridlines: { count: 2 },
                minorGridlines: { count: 2 },
              },
              isStacked: true,
              colors: [ '#35d635','#FFBF00', '#ff3b33','#66b4ea', '#808080'],
              width: 900,
              height: 500,
              annotations: {
                style: 'point',
                alwaysOutside: true
              },
            },
          }
        },
      methods : {
        onChartReady(chart, google) {
          // now we have google lib loaded. Let's create data table based using it.
          this.createDataTable(chart, google);
        },
        // Array will be automatically processed with visualization.arrayToDataTable function
        createDataTable(chart, google) {

          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Name');
          data.addColumn('number', 'Good mitigation');
          data.addColumn('number', 'Some mitigation');
          data.addColumn('number', 'Not mitigated');
          data.addColumn('number', 'Over mitigated');
          data.addColumn('number', 'Invalid');
          data.addColumn({type: 'string', role: 'annotation'});

          let rows = [];

          for(let index in this.chartData){

            if(this.chartData.hasOwnProperty(index)){
              rows[index] = [];
              rows[index][0] = this.chartData[index][0];
              rows[index][1] = this.chartData[index][1];
              rows[index][2] = this.chartData[index][2];
              rows[index][3] = this.chartData[index][3];
              rows[index][4] = this.chartData[index][4];
              rows[index][5] = this.chartData[index][5];
              rows[index][6] = this.chartData[index][6];
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
