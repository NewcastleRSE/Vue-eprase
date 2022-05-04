<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h1>Admin Home</h1>

        <p id="intro">The following reports are designed to give insight into the comparative performance of different institutions and their EPMA systems.</p>

        <p></p>

        <b-container class="bv-example-row">
            <b-row>
                <b-col cols="4" class="menu-bar-buttons">
                    <button @click=getAllReports() @mouseover="guidanceText = 'Access all available institution reports.' " @mouseleave="guidanceText = 'Hover over a button to see more information.'" ><a href="#" >All Institution Reports</a></button>
                    <button @click="mitigationComparison()" @mouseover="guidanceText = 'Compare overall mitigation results.' " @mouseleave="guidanceText = 'Hover over a button to see more information.'"><a href="#">Mititgation Comparison</a></button>
                    <button @click="epsystemComparison()" @mouseover="guidanceText = 'Compare mitigation results across institutions.' " @mouseleave="guidanceText = 'Hover over a button to see more information.'"><a href="#">Ep System Comparison</a></button>
                    <button @click="categoryComparison()" @mouseover="guidanceText = 'Compare drug category results across institutions.' " @mouseleave="guidanceText = 'Hover over a button to see more information.'"><a href="">Test Category Comparsion</a></button>
                    <button @click="epmaStatistics()" @mouseover="guidanceText = 'View EPMA data for institutions.' " @mouseleave="guidanceText = 'Hover over a button to see more information.'"><a href="#">EPMA Statistics</a></button>
                    <button @click="configErrorResults()" @mouseover="guidanceText = 'View config error results for institutions.' " @mouseleave="guidanceText = 'Hover over a button to see more information.'"><a href="#">Configuration Error Results</a></button>
                    <button @click="highRiskComparison()" @mouseover="guidanceText = 'View extreme risk results for institutions.' " @mouseleave="guidanceText = 'Hover over a button to see more information.'"><a href="#">Extreme Risk Comparison</a></button>
                    <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
                </b-col>
                <b-col cols="8">
                    <div id="guidance">{{ guidanceText }}</div>
                </b-col>

            </b-row>
        </b-container>

    </div>


    <AppLogo></AppLogo>
  </div>

</template>

<script>

  import AppLogo from "./AppLogo";
  import {dataService} from "../services/data.service";
  import _ from "lodash";

  export default {
      name: "AdminHome",
      components: {
        AppLogo
      },
      data() {
          return {
            userIsAdmin: true,
            chartData: [],
            guidanceText: ''
          }
      },
      methods: {
          getAllReports() {
             this.$router.push({ path: './allassessmentreports' });
          },
          mitigationComparison() {
             this.$router.push('/mitigationcomparison');
          },
          epsystemComparison() {
              this.$router.push('/epsystemcomparison');
          },
          epmaStatistics() {
              this.$router.push('/epmastatistics');
          },
          categoryComparison() {
              this.$router.push('/categorycomparison');
          },
          configErrorResults() {
              this.$router.push('/configerrorresults');
          },
          highRiskComparison() {
              this.$router.push('/highriskcomparison');
          },
          onExitClick() {
              this.$router.push('/logout');
          },
          onHomeClick() {
              this.$router.push('/assessmentintro');
          },
          getInstitutionMitResult() {
              dataService.getAllMitigationResults().then(data => {

                  for (let index in data){
                      if(data.hasOwnProperty(index)){

                          let values = [
                          data[index].institution.orgName,
                          data[index].goodMitigation,
                          data[index].someMitigation,
                          data[index].notMitigated,
                          data[index].overMitigated,
                          data[index].invalidTests,
                          data[index].epSystem]
                          this.chartData.push(values);
                      }
                  }

                  // const variable for sending to storage
                  const mitigationChartData = this.chartData;
                  const {dispatch} = this.$store;
                  if(this.chartData) {
                    dispatch('storeMitigationChartData', { mitigationChartData });
                  }
              })
          }
      },
    created() {
        this.getInstitutionMitResult();
        localStorage.setItem('userIsAdmin', true);
        this.guidanceText="Hover over a button to see more information.";
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

  #guidance {
    font-size: 1.4em;
    margin-top: 30px;
  }

  #intro {
      margin-top: 20px;
      font-size: 1.2em;
  }

  .level {
    height: 80px;
  }

  .menu-bar-buttons {
    padding: 20px 0;
    width: 280px;
  }

  button {
    height: 40px;
    width: 250px;
    margin: 10px 0;
    font-size: 1em;
    border-width: 1px;
  }

  button:hover {
      background-color: #daffde;
  }

  button a {
    padding: 3px;
    text-decoration: none;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

</style>
