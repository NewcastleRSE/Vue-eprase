<template>

  <div id="page">
    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>

    <div id="content">
    <h2>Results by Chart</h2>

      <div id="charts">

        <PieChart :goodMitigation="good" :someMitigation="some" :notMitigated="not" :overMitigated="over" :nullTests="nullTests"></PieChart>
       <StackedChart :mydata="chartCategoryData" ></StackedChart>
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
        data() {
            return {
              assessment_id : ''
            }
        },
        computed: {
          good() {
              return this.$store.state.mitigationData[0].goodPercentage;
          },
          some() {
             return this.$store.state.mitigationData[0].somePercentage;
          },
          not() {
            return this.$store.state.mitigationData[0].notPercentage;
          },
          over() {
            return this.$store.state.mitigationData[0].overPercentage;
          },
          nullTests(){
            return this.$store.state.mitigationData[0].percentageNulls;
          },
          chartCategoryData() {
            return this.$store.state.stackedChartData.stackedChartData;
          }
        },
        methods: {
          onExitClick() {
            this.$router.push('/logout');
          },
          onHomeClick() {
            this.$router.push('/assessmentintro');
          },
          onReportClick() {
            // get the system id from the url
            this.assessment_id  = this.$route.params.ID;
            this.$router.push('/assessmentresults/'+ this.assessment_id);
          },
          created() {
            // get the system id from the url
            this.assessment_id  = this.$route.params.ID;
          }
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
    margin: 10px 0;
    font-size: 1.2em;
    border-width: 1px;
  }

  .results-btn {
    background-color: #02dddc;
    border : 0;
    margin: 25px 50px;
  }


</style>
