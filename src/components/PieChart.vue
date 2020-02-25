<template>

  <section class="section">
    <div class="container">
      <div id="pie-chart" style="width: 900px; height: 500px;">
        <GChart
          :settings="{ packages: ['corechart']}"
          type="PieChart"
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
        name: "PieChart",
        props: {
           good: 0,
           some: 0,
           not : 0,
           over: 0
        },
        components: {
          GChart
        },
        data() {
            return {
                chartData: this.mydata,
                chartOptions: {
                  title: 'Risk Mitigation',
                  is3D : true,
                  colors: [ '#3cee37','#FFBF00', '#ff3b33','#cd0a2a'],
                  width: 900,
                  height: 500
                  }
            }
        },
        computed: {
          roundedGood(){
            return Math.round(this.good);
          },
          roundedSome(){
            return Math.round(this.some);
          },
          roundedNot(){
            return Math.round(this.not);
          },
          roundedOver(){
            return Math.round(this.over);
          }
        },
        methods: {
            onChartReady(chart, google) {
              this.createDataTable(chart, google);
            },

            createDataTable(chart, google) {

                var container = document.getElementById('pie-chart');
                var chart = new google.visualization.PieChart(container);

                    // uses computed variables rather than props directly
                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn({ type: 'string', id: 'Mitigation' });
                    dataTable.addColumn({ type: 'number', id: 'Percentage' });
                    dataTable.addRows([
                      ['Good mitigation', this.roundedGood],
                      ['Some mitigation', this.roundedSome],
                      ['Not mitigated', this.roundedNot],
                      ['Over mitigated', this.roundedOver]
                    ]);
                    chart.draw(dataTable, this.chartOptions);
            }
        }
    }
</script>

<style scoped>

</style>
