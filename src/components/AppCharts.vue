<template>

  <div id="page">
    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>

    <div id="content">
    <h2>Results by Chart</h2>

      <div id="charts">
        <PieChart></PieChart>
        <StackedChart></StackedChart>
      </div>

    <button class="chartbutton" @click="onReportClick()"><font-awesome-icon icon="chart-bar"></font-awesome-icon> View Report</button>

    <div align="center">
      <div class="buttons">
        <button type="button" class="results-btn btn btn-primary" @click="onExitClick()">Exit</button>
        <button type="button" class="results-btn btn btn-primary" @click="onHomeClick()">Home</button>
      </div>
    </div>

    </div>

  </div>
</template>

<script>

  import PieChart from "./PieChart";
  import StackedChart from "./StackedChart";
  import TabHeader from "./TabHeader";


    export default {
        name: "AppCharts",
        components: {
          TabHeader,
          PieChart,
          StackedChart
        },
        methods: {
          onExitClick() {
            this.$router.push('/logout');
          },
          onHomeClick() {
            this.$router.push('/assessmentintro');
          },
          onReportClick() {
            let id = this.$store.state.assessmentId.id;
            this.$router.push('/assessmentresults/'+ id);
          },
        }
    }

</script>

<style scoped>

  #page {
    text-align: left;
  }

  #content {
    padding: 40px;
  }

  #charts{
    padding-bottom: 50px;
  }

  .chartbutton {
    height: 40px;
    width: 200px;
    margin: 10px 0;
    font-size: 1em;
  }

  button a {
    padding: 3px;
  }

  button {
    height: 40px;
    width: 100px;
    margin: 10px 0px;
    font-size: 1.2em;
  }

  .results-btn {
    background-color: #02dddc;
    border : 0;
    margin: 25px 50px;
  }


</style>
