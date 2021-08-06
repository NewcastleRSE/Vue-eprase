<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h1>Admin Home</h1>

        <p>The following reports are designed to give insight into the comparative performance of different institutions and their EPMA systems.</p>

        <p></p>

      <div class="menu-bar-buttons">
        <button @click=getAllReports()><a href="#">All Institution Reports</a></button>
        <button @click="mitigationComparison()"><a href="#">Mititgation Comparison</a></button>
        <button @click="epsystemComparison()"><a href="#">Ep System Comparison</a></button>
        <button @click="epmaStatistics()"><a href="#">EPMA Statistics</a></button>
        <button @click="configErrorResults()"><a href="#">Configuration Error Results</a></button>
        <button @click="highRiskComparison()"><a href="#">High Risk Comparison</a></button>
        <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
      </div>

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
            chartData: []
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
