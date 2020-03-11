<template>
  <div id="page">

    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>

    <div id="content">
      <h2>Assessment Results</h2>
      <p>Your results from the ePRaSE assessment.</p>
        <strong>User:</strong> {{ user.username }}<br />
        <strong>Institution:</strong> {{ }} <br />
        <strong>Assessment Id:</strong> {{ assessment_id }}

      <div class="text">Congratulations, you have reached the end of the scenarios. Please use the buttons below to see your results.

      </div>

      <div class="assessment-results">



        <PieChart :goodMitigation="goodMitigation" :someMitigation="someMitigation" :notMitigated="notMitigated" :overMitigated="overMitigated"></PieChart>
        <StackedChart :mydata="chartCategoryData" ></StackedChart>

        <section>
          <div>Total valid tests: {{ totalValidTests }}</div>
          <div>Total null tests: {{ totalNulls }}</div>
          <div>Total configuration tests: {{ totalConfigTests }}</div>
        </section>

        <section>
          <h4>Intervention type results</h4>
          <table>
            <tr><th>Alerts Total</th><td>({{ totalAlerts }}/{{ totalInterventions }})</td><td> {{ calc(totalAlerts, totalInterventions) }}</td><td>{{  interventionTypeResult }}</td></tr>
          </table>
        </section>

        <button class="chartbutton" @click="onTableClick()"><font-awesome-icon icon="chart-bar"></font-awesome-icon> View Results Table</button>
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
  import PieChart from './PieChart';
  import StackedChart from './StackedChart';

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
             TabHeader,
             PieChart,
             StackedChart
          },
          data() {
              return {
                  categories : [],
                  categoryData : [],
                  mitigationData: [],
                  chartCategoryData: [],
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
                  prescriptionList : [],
                  assessment_id : ''
              }
        },
        computed: {
            user() {
                return this.$store.state.authentication.user;
            },

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
                  "good": this.drugAge.good,
                  "some" :this.drugAge.some,
                  "not":  this.drugAge.not,
                  "over": this.drugAge.over
                } ,
                {
                  "category": "Drug Dose",
                  "good": this.drugDose.good,
                  "some": this.drugDose.some,
                  "not":  this.drugDose.not,
                  "over": this.drugDose.over
                },
                {
                  "category": "Drug Interaction",
                  "good": this.drugInteraction.good,
                  "some" : this.drugInteraction.some,
                  "not":  this.drugInteraction.not,
                  "over": this.drugInteraction.over
                },
                {
                  "category": "Drug Allergy",
                  "good": this.drugAllergy.good,
                  "some": this.drugAllergy.some,
                  "not":  this.drugAllergy.not,
                  "over": this.drugAllergy.over
                },
                {
                  "category": "Drug Duplication",
                  "good": this.drugDuplication.good,
                  "some": this.drugDuplication.some,
                  "not":  this.drugDuplication.not,
                  "over": this.drugDuplication.over
                }];

                localStorage.setItem('chartdata', this.chartCategoryData);

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

              // dataservice does the save if not already stored
              // TODO check
             // dataService.saveMitigationResults(this.goodMitigation, this.someMitigation, this.notMitigated, this.overMitigated);

            },
            getInterventionTypeResult(){
                let interventionType = this.calc(this.totalAlerts, this.totalInterventions);
                interventionType = interventionType.slice(0, -1);
                interventionType = parseInt(interventionType);
                if(interventionType >= 70){
                    return this.interventionTypeResult = 'High level of alerts';
                }
                else if (interventionType < 70 && interventionType >= 35) {
                    return this.interventionTypeResult = 'Medium level of alerts';
                }
                else {
                    return this.interventionTypeResult = 'Low level of alerts';
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
                // get the system id from the url
               this.assessment_id  = this.$route.params.ID;

              dataService.getCategories(this.assessment_id ).then(data => {
                this.categories = data;
              });

              dataService.getAssessment(this.assessment_id ).then(data => {
                  this.prescriptionList = data.prescriptionList;

                  // audit
                  dataService.audit('View report', '/assessmentresults');

                  dataService.getMitigationResults(this.assessment_id ).then(data => {

                    console.log(data);
                    this.mitigationData = data;
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

</style>
