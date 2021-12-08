<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h2>High Risk Comparison Results</h2>

      <div v-show="reports.length === 0">
        <p>You currently have no reports available.</p>
      </div>

      <div id="report-list-two">
        <div v-if="reports.length > 0">

          <table class="table striped">
            <thead>
                <tr>
                  <th> Institution Name</th>
                  <th> Ep System</th>
                  <th class="align-content-center">Scenarios</th>
                  <th class="align-content-center">Pass</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="report in reports" id="report-two">
              <td>{{ report.institution.orgName }}</td>
              <td><span v-if="report.system.ep_service !=='Other'">{{ report.system.ep_service}} </span>
                <span v-if="report.system.other_ep_system">{{ report.system.other_ep_system}}</span></td>
              <td colspan="2"> {{ report.description[0] }}<br>{{ report.description[1] }}</td>

            </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>

    <div class="footer-bar-buttons">
      <button><font-awesome-icon icon="home"></font-awesome-icon><span class="headerLink"><router-link to="/adminhome">Admin Home</router-link></span></button>
      <button><font-awesome-icon icon="sign-out-alt"></font-awesome-icon><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
    </div>

    <AppLogo></AppLogo>
  </div>
</template>

<script>

    import {dataService} from "../services/data.service";
    import AppLogo from "./AppLogo";

    export default {
        name: "HighRiskComparison",
        components : {
            AppLogo
        },
        data() {
            return {
                reports: []
            }
        },
        methods: {
            getReports() {
                dataService.getAllReports().then(data => {
                    this.reports = data;
                    this.getAllRiskScenarios(data);
                });
            },
            getAllRiskScenarios(data){
                for(let index in data){
                    if(data.hasOwnProperty(index)){
                        let prescriptionList = data[index].prescriptionList;
                        // pass the reports index so we know which report we're using
                        this.getExtremeRiskScenarios(prescriptionList, index);
                    }
                }
            },
            getExtremeRiskScenarios(prescriptionList, index){
                const scenarios = [];
                for(let scenario in prescriptionList){
                if(prescriptionList.hasOwnProperty(scenario)){
                        if(prescriptionList[scenario].risk_level === 'Extreme'){
                            scenarios.push(prescriptionList[scenario]);
                        }
                    }
                }
                this.getScenarioDescription(scenarios, index);
            },
            getScenarioDescription(scenarios, index){
                // create a new field in the report for the scenario description
                this.reports[index].description = [];
                for(let scenario in scenarios){
                if(scenarios.hasOwnProperty(scenario)){

                     console.log(scenarios[scenario]);
                       let valuePair = scenarios[scenario].prescription.indicator.description + ' | ' + scenarios[scenario].result;
                       this.reports[index].description.push(valuePair);
                    }
                }
            },
            getFormattedDate(time){
                let timestamp = time;
                var date = new Date(timestamp * 1000).toLocaleDateString("en-GB");
                return date;
            }
        },
        created() {
            this.getReports()
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

  #report-list-two {
    margin-top: 40px;
  }

  .level {
    height: 80px;
  }

  button {
    height: 40px;
    width: 170px;
    margin: 10px 0px;
    font-size: 1em;
    border-width: 1px;
  }

   .footer-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
    border-width: 1px;
  }

   button a {
    padding: 3px;
    text-decoration: none;
   }

   button:hover {
      background-color: #daffde;
   }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

  #report-two {
    padding: 5px 0;
  }

  .align-content-center{
    text-align: center;
  }

  .smallimg {
    height : 25px;
    width : auto;
  }

</style>
