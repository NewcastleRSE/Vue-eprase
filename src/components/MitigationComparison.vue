<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h1>Institution Mitigation Comparison</h1>

      <p>This chart gives an overview of each institutions mitigation results </p>

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

      <div align="center">
        <div class="buttons">
          <button type="button" class="results-btn btn btn-primary" @click="onExitClick()">Exit</button>
          <button type="button" class="results-btn btn btn-primary" @click="onAdminHomeClick()">Admin Home</button>
        </div>
      </div>

    </div>

    <AppLogo></AppLogo>
  </div>
</template>

<script>

  import AppLogo from "./AppLogo";
  import {dataService} from "../services/data.service";
  import { GChart } from "vue-google-charts";

  export default {
      name: "MitigationComparison",
      components: {
        AppLogo,
        GChart
      },
      data() {
          return {
              chartData: [],
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
                  maxValue: 100
                },
                isStacked: true,
                colors: [ '#35d635','#FFBF00', '#ff3b33','#cd0a2a', '#808080'],
                width: 900,
                height: 500
              },
            }
      },
      methods: {
          getInstitutionMitResult() {
              dataService.getInstitutions().then(data => {
                  for (let index in data){
                      if(data.hasOwnProperty(index)){
                        let ins = this.formatInstitutions(data[index]);
                        dataService.getMitigationResultByInstitutionId(data[index].id).then(mitdata => {

                          if(mitdata !== ''){
                            let values = Object.values(mitdata);
                            values.pop();
                            values.shift();
                            values.unshift(ins.name);
                            this.chartData.push(values);
                          }
                        })
                      }
                  }
              })
          },
          onExitClick() {
              this.$router.push('/logout');
          },
          onAdminHomeClick() {
              this.$router.push('/adminhome');
          },
          formatInstitutions(ins){
              let institution = {
                id: ins.id,
                name : ins.orgName,
              };
              return institution;
          },
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
                  }
              }
              data.addRows(rows);

              var view = new google.visualization.DataView(data);
              chart.draw(view, this.chartOptions);
          },
      },
      created() {
         this.getInstitutionMitResult();
      }
  }
</script>

<style scoped>

  #header {
    background-image: url("../assets/pills-bw.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
  }
  .level {
    height: 80px;
  }

  button {
    height: 40px;
    width: 250px;
    margin: 10px 0;
    font-size: 1em;
    border-width: 1px;
  }

  .menu-bar-buttons {
    padding: 20px 0;
    width: 280px;
  }

  .results-btn {
    background-color: #02dddc;
    border : 0;
    height: 40px;
    width: 100px;
    margin: 25px 50px;
    font-size: 1.2em;
  }

  button a {
    padding: 3px;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

</style>
