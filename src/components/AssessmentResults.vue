<template>
  <div id="page">

    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>

    <div id="content">
      <h2>Assessment Report</h2>

      <div class="text">
        <strong>Institution:</strong> {{ institution}} <br />
        <strong>EP System:</strong>
        <span v-if="ep_service !=='Other'">{{ ep_service}} </span>
        <span v-if="other_ep_system">{{ other_ep_system}}</span><br />
      </div>

      <section>
        <div>Total valid tests (not including configuration tests): {{ totalValidTests }}</div>
        <div>Total of tests that were excluded due to medication not being available: {{ totalNulls }}</div>
      </section>

      <div class="assessment-results">
        <div class="results-summary">
          <table class="table table-striped">
            <tr><th>Category</th><th>Outcome</th></tr>
            <tr><td>Extreme risk scenarios</td><td>You have completed {{ extremeRiskScenarios.length }} extreme risk scenario(s). Out of these, {{ extremeRiskMitigations  }} was(were) mitigated. </td></tr>
            <tr><td>High risk scenarios</td><td>You have completed {{ highRiskScenarios.length }} high risk scenarios. Out of these, {{ highRiskMitigations }} were mitigated. </td></tr>
            <tr><td>Alerts/Advisory interventions</td><td>You had a total of {{ totalAlerts }} alerts and {{ totalAdvisory }} advisory out of  {{ totalValidTests }} total valid tests, where a system/user intervention was selected. This would be considered a {{  interventionTypeResult }} ({{ calc(totalAlerts, totalValidTests) }}). A high level of alerts can indicate an over-reliance on alerting within a system.</td></tr>
            <tr><td>Config Errors</td><td>You were questioned about {{ totalConfigTests }} configuration errors.</td></tr>
          </table>
        </div>

        <div v-if="extremeRiskFails.length > 0">

          <div class="table-header-warning">Extreme risk scenarios with no mitigation</div>
          <table class="table table-striped extreme-risk-table">
            <thead>
            <tr><th width="20%">Drug name</th><th>Scenario description</th></tr>
            </thead>
            <tbody>
            <tr v-for="test in extremeRiskFails" :key="test">
              <td>{{test.prescription.drug_name}}</td><td>{{ test.prescription.indicator.description }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-if="configErrorResults.length > 0">

          <div class="table-header">Configuration Error Results</div>
          <table class="table table-striped extreme-risk-table">
            <thead>
            <tr><th width="50%">Question</th><th>Result</th><th>Outcome</th></tr>
            </thead>
            <tbody>
            <tr v-for="test in configErrorResults" :key="test">
              <td>{{test.question}}</td>
              <td><span v-if="test.result === 1">True</span><span v-if="test.result === 0">False</span></td>
              <td><span v-if="test.result === 1">This is undesirable system behaviour</span><span v-if="test.result === 0">This is good system behaviour</span></td>
            </tr>
            </tbody>
          </table>
        </div>

        <button class="chartbutton" @click="onTableClick()"><font-awesome-icon icon="chart-bar"></font-awesome-icon> View Percentages</button>
        <button class="chartbutton" @click="onChartClick()"><font-awesome-icon icon="chart-bar"></font-awesome-icon> View Charts</button>

      </div>
      <div align="center">
        <div class="buttons">
          <button type="button" class="results-btn btn btn-primary" @click="onExitClick()">Exit</button>
          <button type="button" class="results-btn btn btn-primary" @click="onHomeClick()">Home</button>
        </div>
      </div>
    </div>
    <AppLogo></AppLogo>
  </div>
</template>

<script>

  import {dataService} from '../services/data.service';
  import {categoryService} from "../services/categoryService";
  import {stackedChartService} from "../services/stackedChartService";
  import TabHeader from './TabHeader';

  import axios from 'axios'
  import VueAxios from 'vue-axios'
  import Vue from 'vue'
  import {settings} from "../settings";
  import AppLogo from "./AppLogo";
  import _ from 'lodash';
  import {userService} from "../services/user.service";

  Vue.use(VueAxios, axios);

      export default {
          name: "AssessmentResults",
          components: {
             AppLogo,
             TabHeader
          },
          data() {
              return {
                  categories : [],
                  chartCategoryData: [],
                  extremeRiskScenarios : [],
                  extremeRiskFails: [],
                  extremeRiskMitigations: 0,
                  highRiskScenarios : [],
                  highRiskFails : [],
                  highRiskMitigations: 0,
                  lowRiskScenarios: [],
                  lowRiskOverMitigations: [],
                  configErrorResults: [],
                  goodMitigation: '',
                  someMitigation: '',
                  notMitigated: '',
                  overMitigated: '',
                  percentageNulls: 0,
                  totalGood : 0,
                  totalSome : 0,
                  totalNot : 0,
                  totalOver : 0,
                  totalValidTests : 0,
                  totalAlerts : 0,
                  totalAdvisory: 0,
                  totalNulls : 0,
                  totalInterventions: 0,
                  interventionTypeResult: '',
                  totalConfigTests : settings.numConfigError,
                  numPrescriptions : 0,
                  assessment_id : '',
                  institution_id: '',
                  institution: '',
                  ep_service: '',
                  other_ep_system: '',
                  userIsAdmin : false
              }
          },
          computed: {
              user() {
                  return this.$store.state.authentication.user;
              }
          },
          methods : {
              createResults(id) {

                  let tempData = [];
                  let formattedData = [];
                  let tempResult =[];

                  dataService.getPrescriptionTestData(id).then(data => {
                      tempData = data;
                      for(let index in tempData){
                          if(tempData.hasOwnProperty(index)){
                            tempResult = this.formatData(tempData[index]);
                            formattedData.push(tempResult);
                          }
                      }
                      this.countCategories(formattedData);

                      // const variable for sending to storage
                      const stackedChartData = this.chartCategoryData;
                      const {dispatch} = this.$store;
                      if(id) {
                        dispatch('storeStackedChartData', { stackedChartData });
                      }

                      // if numPrescriptions isn't in local storage, get it from the settings
                      let numPrescriptions = parseInt(localStorage.getItem('numPrescriptions'));
                      if(!numPrescriptions){
                          numPrescriptions = settings.numPrescriptions;
                          localStorage.setItem('numPrescriptions', numPrescriptions);
                      }

                      // calculate number of valid tests, ignoring null results
                      this.totalValidTests = numPrescriptions - this.totalNulls;
                      this.getInterventionTypeResult();
                      this.saveMitigationResult(id);

                  });
              },
              countCategories(data){
                let jsonData = categoryService.countCategories(data);
                this.totalGood = jsonData.totals.totalGood;
                this.totalSome = jsonData.totals.totalSome;
                this.totalOver = jsonData.totals.totalOver;
                this.totalNot = jsonData.totals.totalNot;
                this.totalNulls = jsonData.totals.totalNulls;
                this.totalInterventions = jsonData.totals.totalInterventions;
                this.totalAlerts = jsonData.totals.totalAlerts;
                this.totalAdvisory = jsonData.totals.totalAdvisory;
                this.createStackedChartData(jsonData);
              },
              createStackedChartData(jsonData){
                 this.chartCategoryData = stackedChartService.createStackedChartData(jsonData);
              },
              getInterventionTypeResult(){
                let interventionType = this.calc(this.totalAlerts, this.totalValidTests);
                interventionType = interventionType.slice(0, -1);
                interventionType = parseInt(interventionType);
                if(interventionType >= 70){
                  return this.interventionTypeResult = 'high level of alerts';
                }
                else if (interventionType < 70 && interventionType >= 35) {
                  return this.interventionTypeResult = 'medium level of alerts';
                }
                else {
                  return this.interventionTypeResult = 'low level of alerts';
                }
              },
              // calculate as % of all tests
              saveMitigationResult(id) {

                let numTests = parseInt(localStorage.getItem('numPrescriptions'));
                this.goodMitigation = this.calcPerCategory(this.totalGood, numTests);
                this.someMitigation = this.calcPerCategory(this.totalSome, numTests);
                this.notMitigated = this.calcPerCategory(this.totalNot, numTests);
                this.overMitigated = this.calcPerCategory(this.totalOver, numTests);
                this.percentageNulls = this.calcPerCategory(this.totalNulls, numTests);

                // const variables for sending to storage
                const goodPercentage = this.goodMitigation;
                const somePercentage = this.someMitigation;
                const notPercentage = this.notMitigated;
                const overPercentage = this.overMitigated;
                const percentageNulls = this.percentageNulls;
                const {dispatch} = this.$store;
                if(id) {
                  dispatch('storeMitigationData', { goodPercentage, somePercentage, notPercentage, overPercentage, percentageNulls });
                }

                dataService.saveMitigationResults(id, this.ep_service, this.goodMitigation, this.someMitigation, this.notMitigated, this.overMitigated, percentageNulls);
              },
              formatData(item) {
                return {
                  categoryName: item.prescription.indicator.category['categoryName'],
                  mitigation: item.result,
                  outcome: item.outcome,
                  selected_type: item.selected_type
                };
              },
              calc(num,total){
                if(total !== 0) {
                  return ((num/total) *100).toFixed(1) + '%';
                }
                return 'n/a';
              },
              calcPerCategory(num, total){
                if(total !== 0) {
                  return ((num/total) *100).toFixed(1);
                }
                return 0;
              },
              calcNum(num, total) {
                if(total !== 0) {
                  let tempnum = ((num/total) *100).toFixed(1);
                  return parseInt(tempnum);
                }
                return 0;
              },
              onExitClick() {
                  this.$router.push('/logout');
              },
              onHomeClick() {
                  this.userIsAdmin = localStorage.getItem('userIsAdmin');
                  // string value since its been in local storage
                  if(this.userIsAdmin === 'true'){
                      this.$router.push('/adminhome');
                  }
                  else {
                      this.$router.push('/assessmentintro');
                  }
              },
              onTableClick() {
                  this.$router.push('/resultstable');
                },
              onChartClick() {
                this.$router.push('/charts');
               }
              },
              created() {
                  // get the assessment id from the url or local storage if it isn't there
                  this.assessment_id  = this.$route.query.ID;
                  if(typeof(this.assessment_id) === 'undefined'){
                    this.assessment_id = localStorage.getItem('assessmentId');
                  }
                  else {
                    localStorage.setItem('assessmentId', this.assessment_id);
                  }
                  dataService.getCategories(this.assessment_id).then(data => {
                    this.categories = data;
                  });

                  dataService.getAssessmentById(this.assessment_id).then(data => {

                    let configErrorList = data.configErrorDataList;

                      for(let index in configErrorList){
                          if(configErrorList.hasOwnProperty(index)){
                              dataService.getConfigErrorByCode(configErrorList[index].test_id).then(newdata => {
                              // assign a new element to the JSON
                              configErrorList[index]["question"] = newdata.description;
                              this.configErrorResults.push(configErrorList[index]);
                            });
                          }
                      }

                      let prescriptionList = data.prescriptionList;

                      for(let index in prescriptionList){
                          if(prescriptionList.hasOwnProperty(index)){
                             let risk_level = prescriptionList[index].risk_level;
                             if(risk_level === 'Extreme'){
                               this.extremeRiskScenarios.push(prescriptionList[index]);
                               if(prescriptionList[index].result === 'No Mitigation/Fail'){
                                 this.extremeRiskFails.push(prescriptionList[index]);
                               }
                             }
                             else if(risk_level === 'High'){
                               this.highRiskScenarios.push(prescriptionList[index]);
                               if(prescriptionList[index].result === 'No Mitigation/Fail'){
                                 this.highRiskFails.push(prescriptionList[index]);
                               }
                             }
                             else if(risk_level === 'Low'){
                               this.lowRiskScenarios.push(prescriptionList[index]);
                               if(prescriptionList[index].result === 'Over Mitigation'){
                                 this.lowRiskOverMitigations.push(prescriptionList[index]);
                               }
                             }
                          }
                      }

                      // calculate number of mitigated extreme & high risk scenarios
                      this.extremeRiskMitigations = this.extremeRiskScenarios.length - this.extremeRiskFails.length;
                      this.highRiskMitigations = this.highRiskScenarios.length - this.highRiskFails.length;

                      this.ep_service = data.system.ep_service;
                      this.other_ep_system = data.system.other_ep_system;
                      this.institution = data.institution.orgName;

                      // audit
                      dataService.audit('View report', '/assessmentresults');

                      dataService.getMitigationResults(this.assessment_id).then(data => {
                          this.goodMitigation = data.goodMitigation;
                          this.someMitigation = data.someMitigation;
                          this.notMitigated = data.notMitigated;
                          this.overMitigated = data.notMitigated;
                          this.createResults(this.assessment_id);
                      })
                  });
              },
               mounted : function() {
                history.pushState(null, null, location.href);
                    window.onpopstate = function () {
                        history.go(1);
            };
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

  img {
    border: 1px solid black;
  }

  .assessment-results {
    padding-bottom: 20px;
  }

 .text {
   padding: 20px 0;
 }
  .results-data  {
    margin: 25px 0;
  }

  .results-data p {
    margin-left: 10px;
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

  h4 {
    font-size: 18px;
  }

  section {
    padding: 20px 0;
  }

  .chartbutton {
    height: 40px;
    width: 200px;
    margin: 10px 0;
    font-size: 1em;
    border-width: 1px;
  }

  button a {
    padding: 3px;
  }

  .table-header {
    padding: 20px 0;
    color:  #07818e;
  }

  .table-header-warning {
    padding: 20px 0;
    color: red;
  }

  .extreme-risk-table {
    margin-bottom: 40px;
  }

</style>
