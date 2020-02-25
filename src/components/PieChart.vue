<template>

  <div id="page">
    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>
      <section class="section">
        <div class="container">
          <div id="pie-chart" style="width: 900px; height: 500px;">
            <GChart
              :settings="{ packages: ['corechart']}"
              type="PieChart"
              :options="chartOptions"
              style="width: 900px; height: 500px;"
              @ready="onChartReady"
              ref="gChart"
            />
          </div>
        </div>
      </section>
  </div>

</template>

<script>

    import { GChart } from "vue-google-charts";
    import TabHeader from "./TabHeader";

    export default {
        name: "PieChart",
        components: {
          GChart,
          TabHeader
        },
        data() {
            return {
                chartOptions: {
                  title: 'EPMA Risk Mitigation',
                  is3D : true,
                  colors: [ '#35d635','#FFBF00', '#ff3b33','#cd0a2a'],
                  width: 900,
                  height: 500
                  }
            }
        },
        computed: {
            roundedGood(){
              let good = this.$store.state.goodPercentage.goodPercentage;
              return Math.round(good);
            },
            roundedSome(){
              let some = this.$store.state.goodPercentage.somePercentage;
              return Math.round(some);
            },
            roundedNot(){
              let not = this.$store.state.goodPercentage.notPercentage;
              return Math.round(not);
            },
            roundedOver(){
              let over = this.$store.state.goodPercentage.overPercentage;
              return Math.round(over);
            }
        },
        methods: {
            onChartReady(chart, google) {
              this.createDataTable(chart, google);
            },

            createDataTable(chart, google) {

              console.log(this.roundedGood);
              console.log(this.roundedSome);

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
