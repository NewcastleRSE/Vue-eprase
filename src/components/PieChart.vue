<template>

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

</template>

<script>

    import { GChart } from "vue-google-charts";
    import TabHeader from "./TabHeader";

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
          GChart,
          TabHeader
        },
        data() {
            return {
                chartOptions: {
                  title: 'EPMA Risk Mitigation',
                  is3D : false,
                  colors: [ '#35d635','#FFBF00', '#ff3b33','#cd0a2a', '#808080'],
                  width: 900,
                  height: 500
                  }
            }
        },
        computed: {
            roundedGood(){
              let good = this.goodMitigation;
              return Math.round(good);
            },
            roundedSome(){
              let some = this.someMitigation;
              return Math.round(some);
            },
            roundedNot(){
              let not = this.notMitigated;
              return Math.round(not);
            },
            roundedOver(){
              let over = this.overMitigated;
              return Math.round(over);
            },
            roundedNull() {
              let nulltests = this.nullTests;
              return Math.round(nulltests);
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
                  ['Over mitigated', this.roundedOver],
                  ['Invalid tests', this.roundedNull]
                ]);
                chart.draw(dataTable, this.chartOptions);
            }
        }
    }
</script>

<style scoped>

</style>
