<template>
  <div id="page">

    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>

    <div id="content">
      <h2>Assessment Report</h2>

      <div class="text">
        <strong>Institution:</strong> {{ institution}} <br />
        <strong>EP System:</strong> {{ ep_service }}<br />
      </div>

      <section>
        <div>Total valid tests: {{ totalValidTests }}</div>
        <div>Total null tests: {{ totalNulls }}</div>
      </section>

      <div class="assessment-results">
        <div class="results-summary">
          <table class="table table-striped">
            <tr><th>Category</th><th>Outcome</th></tr>
            <tr><td>Extreme risk scenarios</td><td>You have completed {{ extremeRiskScenarios.length }} extreme risk scenarios. Out of these, {{ extremeRiskFails.length  }} were not mitigated. </td></tr>
            <tr><td>High risk scenarios</td><td>You have completed {{ highRiskScenarios.length }} high risk scenarios. Out of these, {{ highRiskFails.length  }} were not mitigated. </td></tr>
            <tr><td>Alerts/Advisory interventions</td><td>You had a total of {{ totalAlerts }} alerts and {{ totalInterventions }} advisory interventions. This would be considered a {{  interventionTypeResult }} ({{ calc(totalAlerts, totalInterventions) }}). A high level of alerts can indicate an over-reliance on alerting within a system.</td></tr>
            <tr><td>Config Errors</td><td>You were questioned about {{ totalConfigTests }} configuration errors.</td></tr>
          </table>
        </div>

        <div v-if="extremeRiskFails.length > 0">

          <div class="table-header">Extreme risk scenarios with no mitigation</div>
          <table class="table table-striped extreme-risk-table">
            <thead>
            <tr><th width="20%">Drug name</th><th>Scenario description</th></tr>
            </thead>
            <tbody>
            <tr v-for="test in extremeRiskFails">
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
            <tr v-for="test in configErrorResults">
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
  import TabHeader from './TabHeader';

  import axios from 'axios'
  import VueAxios from 'vue-axios'
  import Vue from 'vue'
  import {settings} from "../settings";
  import AppLogo from "./AppLogo";

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
                  categoryData : [],
                  chartCategoryData: [],
                  extremeRiskScenarios : [],
                  extremeRiskFails: [],
                  highRiskScenarios : [],
                  highRiskFails : [],
                  configErrorResults: [],
                  goodMitigation: '',
                  someMitigation: '',
                  notMitigated: '',
                  overMitigated: '',
                  totalGood : 0,
                  totalSome : 0,
                  totalNot : 0,
                  totalOver : 0,
                  totalAlerts : 0,
                  totalValidTests : 0,
                  totalNulls : 0,
                  totalInterventions: 0,
                  drugAge : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugDose : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugInteraction : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugAllergy : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugDuplication : { good : 0, some : 0, not : 0, over : 0, count : 0},
                  drugDisease : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugOmissions : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  theraputicDuplication : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugLab : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugBrand : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugRoute : { good : 0, some : 0, not : 0, over : 0, count : 0 },
                  drugOverdose : { good : 0, some : 0, not : 0, over : 0,  count : 0 },
                  interventionTypeResult: '',
                  totalConfigTests : settings.numConfigError,
                  assessment_id : '',
                  institution_id: '',
                  institution: '',
                  ep_service: ''
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

                dataService.getCategoryData(id).then(data => {
                  tempData = data;
                  for(let index in tempData){
                    if(tempData.hasOwnProperty(index)){
                      tempResult = this.formatData(tempData[index]);
                      formattedData.push(tempResult);
                    }
                  }
                  this.categoryData = formattedData;
                  this.countCategories(this.categoryData);

                  this.chartCategoryData = [{
                    "category": "Drug Age",
                    "good": this.calcNum(this.drugAge.good, this.drugAge.count),
                    "some" : this.calcNum(this.drugAge.some, this.drugAge.count),
                    "not":  this.calcNum(this.drugAge.not, this.drugAge.count),
                    "over": this.calcNum(this.drugAge.over, this.drugAge.count)
                  },
                  {
                    "category": "Drug Dose",
                    "good":  this.calcNum(this.drugDose.good, this.drugDose.count),
                    "some":  this.calcNum(this.drugDose.some, this.drugDose.count),
                    "not":   this.calcNum(this.drugDose.not, this.drugDose.count),
                    "over":  this.calcNum(this.drugDose.over,this.drugDose.count)
                  },
                  {
                    "category": "Drug Interaction",
                    "good":  this.calcNum(this.drugInteraction.good, this.drugAge.count),
                    "some" :  this.calcNum(this.drugInteraction.some, this.drugAge.count),
                    "not":   this.calcNum(this.drugInteraction.not, this.drugAge.count),
                    "over":  this.calcNum(this.drugInteraction.over, this.drugAge.count)
                  },
                  {
                    "category": "Drug Allergy",
                    "good":  this.calcNum(this.drugAllergy .good, this.drugInteraction.count),
                    "some":  this.calcNum(this.drugAllergy.some, this.drugInteraction.count),
                    "not":   this.calcNum(this.drugAllergy.not, this.drugInteraction.count),
                    "over":  this.calcNum(this.drugAllergy.over, this.drugInteraction.count)
                  },
                  {
                    "category": "Drug Duplication",
                    "good":  this.calcNum(this.drugDuplication.good, this.drugDuplication.count),
                    "some":  this.calcNum(this.drugDuplication.some, this.drugDuplication.count),
                    "not":   this.calcNum(this.drugDuplication.not, this.drugDuplication.count),
                    "over":  this.calcNum(this.drugDuplication.over, this.drugDuplication.count)
                  },
                    {
                      "category": "Drug Disease",
                      "good":  this.calcNum(this.drugDisease.good, this.drugDisease.count),
                      "some" : this.calcNum(this.drugDisease.some, this.drugDisease.count),
                      "not":   this.calcNum(this.drugDisease.not, this.drugDisease.count),
                      "over":  this.calcNum(this.drugDisease.over, this.drugDisease.count)
                    },
                    {
                      "category": "Drug Omissions",
                      "good":  this.calcNum(this.drugOmissions.good, this.drugOmissions.count),
                       "some":  this.calcNum(this.drugOmissions.some, this.drugOmissions.count),
                       "not":   this.calcNum(this.drugOmissions.not, this.drugOmissions.count),
                       "over":  this.calcNum(this.drugOmissions.over, this.drugOmissions.count)
                    },
                    {
                      "category": "Theraputic Duplication",
                      "good": this.calcNum(this.theraputicDuplication.good, this.theraputicDuplication.count),
                      "some" : this.calcNum(this.theraputicDuplication.some, this.theraputicDuplication.count),
                      "not":  this.calcNum(this.theraputicDuplication.not, this.theraputicDuplication.count),
                      "over": this.calcNum(this.theraputicDuplication.over, this.theraputicDuplication.count)
                    },
                    {
                      "category": "Drug Lab",
                      "good": this.calcNum(this.drugLab.good, this.drugLab.count),
                      "some": this.calcNum(this.drugLab.some, this.drugLab.count),
                      "not":  this.calcNum(this.drugLab.not, this.drugLab.count),
                      "over": this.calcNum(this.drugLab.over, this.drugLab.count)
                    },
                    {
                      "category": "Drug Brand",
                      "good":  this.calcNum(this.drugBrand.good, this.drugBrand.count),
                      "some":  this.calcNum(this.drugBrand.some,this.drugBrand.count),
                      "not":   this.calcNum(this.drugBrand.not, this.drugBrand.count),
                      "over":  this.calcNum(this.drugBrand.over, this.drugBrand.count)
                    },
                    {
                      "category": "Drug Route",
                      "good":  this.calcNum(this.drugRoute.good, this.drugRoute.count),
                      "some":  this.calcNum(this.drugRoute.some, this.drugRoute.count),
                       "not":   this.calcNum(this.drugRoute.not, this.drugRoute.count),
                       "over":  this.calcNum(this.drugRoute.over, this.drugRoute.count)
                    },
                    {
                      "category": "Drug Overdose",
                       "good":  this.calcNum(this.drugOverdose.good, this.drugOverdose.count),
                       "some":  this.calcNum(this.drugOverdose.some, this.drugOverdose.count),
                       "not":   this.calcNum(this.drugOverdose.not, this.drugOverdose.count),
                       "over":  this.calcNum(this.drugOverdose.over, this.drugOverdose.count)
                    }];

                  // const variable for sending to storage
                  const stackedChartData = this.chartCategoryData;
                  const {dispatch} = this.$store;
                  if(id) {
                    dispatch('storeStackedChartData', { stackedChartData });
                  }

                  // calculate number of valid tests, ignoring null results
                  this.totalValidTests = settings.numPrescriptions - this.totalNulls;
                  this.getInterventionTypeResult();
                  this.saveMitigationResult(id);

                });
              },
              countCategories(data){
                  for(let index in data){
                    if(data.hasOwnProperty(index)){
                      let name = data[index].categoryName;
                      let mitigation = data[index].mitigation;
                      let outcome = data[index].outcome;
                      if(outcome === 'intervention'){
                        this.totalInterventions++;
                      }
                      let selected_type = data[index].selected_type;
                      if(selected_type === 'alert'){
                        this.totalAlerts++;
                      }
                      if(mitigation === 'Null'){
                        this.totalNulls++;
                      }
                      else {
                        switch(name){
                          case "Drug Age":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugAge.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugAge.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugAge.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugAge.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugAge.count++;
                            }
                            break;
                          case "Drug Dose":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugDose.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugDose.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugDose.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugDose.over++;
                              this.totalOver++;
                            }
                            if(mitigation !== 'Null'){
                              this.drugDose.count++;
                            }

                            break;
                          case "Drug Interaction":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugInteraction.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugInteraction.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugInteraction.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugInteraction.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugInteraction.count++;
                            }

                            break;
                          case "Drug Allergy":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugAllergy.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugAllergy.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugAllergy.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugAllergy.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugAllergy.count++;
                            }
                            break;
                          case "Drug Duplication":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugDuplication.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugDuplication.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugDuplication.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugDuplication.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugDuplication.count++;
                            }
                            break;
                          case "Drug Disease":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugDisease.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugDisease.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugDisease.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugDisease.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugDisease.count++;
                            }
                            break;
                          case "Drug Omissions":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugOmissions.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugOmissions.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugOmissions.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugOmissions.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugOmissions.count++;
                            }
                            break;
                          case "Theraputic Duplication":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.theraputicDuplication.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.theraputicDuplication.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.theraputicDuplication.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.theraputicDuplication.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.theraputicDuplication.count++;
                            }
                            break;
                          case "Drug Lab":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugLab.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugLab.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugLab.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugLab.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugLab.count++;
                            }
                            break;
                          case "Drug Brand":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugBrand.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugBrand.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugBrand.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugBrand.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugBrand.count++;
                            }
                            break;
                          case "Drug Route":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugRoute.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugRoute.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugRoute.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugRoute.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugRoute.count++;
                            }
                            break;
                          case "Drug Overdose":
                            if(mitigation === 'Good Mitigation/Pass'){
                              this.drugOverdose.good++;
                              this.totalGood++;
                            }
                            else if (mitigation === 'Some Mitigation'){
                              this.drugOverdose.some++;
                              this.totalSome++;
                            }
                            else if (mitigation === 'No Mitigation/Fail'){
                              this.drugOverdose.not++;
                              this.totalNot++;
                            }
                            else if (mitigation === 'Over Mitigation'){
                              this.drugOverdose.over++;
                              this.totalOver++;
                            }

                            if(mitigation !== 'Null'){
                              this.drugOverdose.count++;
                            }
                            break;
                        }
                      }
                    }
                  }
              },
              saveMitigationResult(id) {

                this.goodMitigation = this.calcPerCategory(this.totalGood, this.totalValidTests);
                this.someMitigation = this.calcPerCategory(this.totalSome, this.totalValidTests);
                this.notMitigated = this.calcPerCategory(this.totalNot, this.totalValidTests);
                this.overMitigated = this.calcPerCategory(this.totalOver, this.totalValidTests);

                // const variables for sending to storage
                const goodPercentage = this.goodMitigation;
                const somePercentage = this.someMitigation;
                const notPercentage = this.notMitigated ;
                const overPercentage = this.overMitigated;
                const {dispatch} = this.$store;
                if(id) {
                  dispatch('storeMitigationData', {  goodPercentage, somePercentage, notPercentage, overPercentage });
                }

                dataService.saveMitigationResults(this.goodMitigation, this.someMitigation, this.notMitigated, this.overMitigated);

              },
              getInterventionTypeResult(){
                  let interventionType = this.calc(this.totalAlerts, this.totalInterventions);
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
                  this.$router.push('/assessmentintro');
              },
              onTableClick() {
                  this.$router.push('/resultstable/'+ this.assessment_id);
                },
              onChartClick() {
                this.$router.push('/charts/'+ this.assessment_id);
              }
              },
              created() {
                    // get the assessment id from the url
                   this.assessment_id  = this.$route.params.ID;
                   this.institution_id = localStorage.getItem('institutionId');

                  dataService.getCategories(this.assessment_id ).then(data => {
                    this.categories = data;
                  });

                  dataService.getAssessment(this.institution_id).then(data => {

                      let configErrorList = data.configErrorDataList;

                      for(let index in configErrorList){
                        if(configErrorList.hasOwnProperty(index)){
                          dataService.getConfigErrorByCode(configErrorList[index].test_id).then(data => {
                            // assign a new element to the JSON
                            configErrorList[index]["question"] = data[0].description;
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
                          }
                      }

                      this.ep_service = data.system.ep_service;
                      this.institution = data.user.institution.orgName;

                      // audit
                      dataService.audit('View report', '/assessmentresults');

                      dataService.getMitigationResults(this.assessment_id ).then(data => {
                          this.goodMitigation = data.goodMitigation;
                          this.someMitigation = data.someMitigation;
                          this.notMitigated = data.notMitigated;
                          this.overMitigated = data.notMitigated;
                          this.createResults(this.assessment_id );
                      })
                  });
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
  }

  button a {
    padding: 3px;
  }

  .table-header {
    padding: 20px 0;
    color: red;
  }

  .extreme-risk-table {
    margin-bottom: 40px;
  }

</style>
