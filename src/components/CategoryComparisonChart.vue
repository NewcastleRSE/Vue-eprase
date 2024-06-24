<template>
    <section class="section">
        <div class="container">
            <div id="combined-chart" style="width: 900px; height: 500px;">
            <!-- <GChart v-if="searchFieldItem"
              :settings="{ packages: ['corechart', 'bar']}"
              type="ColumnChart"
              :data="chartData"
              :options="chartOptions"
              style="width: 900px; height: 500px;"
              @ready="onChartReady"
              ref="gChart"
            /> -->
          </div>
    </div>
  </section>
</template>

<script>

export default {
    name: "CategoryComparisonChart",
    props: {
       mydata: {
          type: Array
       },
       searchfield: {
          type: String
       }
    },
    components: {
    },
    data() {
        return {
            chartData: this.mydata,
            searchFieldItem: this.searchfield,
            chartOptions: {
                chart: {
                    title: ''
                },
                hAxis: {
                    title: 'Institution',
                },
                vAxis: {
                    title: 'Drug Category',
                    minValue: 0,
                    maxValue: 100,
                    textPosition: 'none',
                    gridlines: { count: 2 },
                    minorGridlines: { count: 2 },
                },
                width: 900,
                height: 500
            },
        }
    },
    methods : {
        onChartReady(chart, google) {
            if(this.chartData && this.searchFieldItem){
                 this.createDataTable(chart, google);
            }
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

            let rows = [];

            for(let index in this.chartData){

                if(this.chartData.hasOwnProperty(index)){
                    if(this.chartData[index][6] === this.searchFieldItem){
                    rows[index] = [];
                    rows[index][0] = this.chartData[index][0];
                    rows[index][1] = this.chartData[index][1];
                    rows[index][2] = this.chartData[index][2];
                    rows[index][3] = this.chartData[index][3];
                    rows[index][4] = this.chartData[index][4];
                    rows[index][5] = this.chartData[index][5];
                    }
                    else{
                        rows[index] = [];
                        rows[index][0] = ''
                        rows[index][1] = 0
                        rows[index][2] = 0
                        rows[index][3] = 0
                        rows[index][4] = 0
                        rows[index][5] = 0
                    }
                }
            }
            data.addRows(rows);

            var view = new google.visualization.DataView(data);
            chart.draw(view, this.chartOptions);
        }
    },
    beforeCreate() {
        this.chartData = [];
        this.searchFieldItem = '';
    }
}
</script>

<style scoped>


</style>
