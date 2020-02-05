<template>
  <div id="page">

    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>

    <div id="content">
      <h2>Assessment Results</h2>
      <p>Your results from the ePRaSE assessment. </p>

      <div class="assessment-results">

        <h3>eP Usage Results</h3>
        <p>The following results are based on your answers to the questions in the system section of the assessment. </p>
        <p>Higher usage of the eP system is considered safer and in order to properly test your eP system, you should be able to input lab results. </p>
        <div class="results-data">

          <table>
            <tr>
              <th>eP Usage</th><td>{{ getEpUsage }}%</td>
              <td>
                <img v-if="getEpUsage === '76-100'" src="../assets/smiley1.jpg" title="great" class="smiley">
                <img v-if="getEpUsage === '51-75'"  src="../assets/smiley2.jpg" title="good"  class="smiley">
                <img v-if="getEpUsage === '26-50'"  src="../assets/smiley3.jpg" title="ok"    class="smiley">
                <img v-if="getEpUsage === '0-25'"  src="../assets/smiley4.jpg" title="poor"  class="smiley">
              </td>
            </tr>
            <tr>
              <th>Lab Results</th><td>{{ getLabResults }}</td>
              <td>
                <img v-if="getLabResults === 'true'"  src="../assets/smiley2.jpg" title="good" class="smiley">
                <img v-if="getLabResults === 'false'" src="../assets/smiley4.jpg" title="bad"   class="smiley">
              </td>
            </tr>
          </table>

        </div>
        <h3>Summary Results</h3>

       <!-- <CategoryTable :category-data="[...categoryData]" ></CategoryTable> -->
        <div class="results-summary">
          <table class="table is-striped">
            <tr><th>Category</th><th>Good mitigation/Pass</th><th>Some mitigation</th><th>Not mitigated</th><th>Over mitigated</th></tr>
            <tr><td>Drug Age</td><td>{{ drugAge.Good }}</td><td>{{ drugAge.Some }}<td>{{ drugAge.Not}}</td><td>{{ drugAge.Over}}</td></tr>
            <tr><td>Drug Dose</td><td>{{ drugDose.Good }}</td><td>{{ drugDose.Some }}<td>{{ drugDose.Not}}</td><td>{{ drugDose.Over}}</td></tr>
            <tr><td>Drug Interaction</td><td>{{ drugInteraction.Good }}</td><td>{{ drugInteraction.Some }}<td>{{ drugInteraction.Not}}</td><td>{{ drugInteraction.Over}}</td></tr>
            <tr><td>Drug Allergy</td><td>{{ drugAllergy.Good }}</td><td>{{ drugAllergy.Some }}<td>{{ drugAllergy.Not}}</td><td>{{ drugAllergy.Over}}</td></tr>
            <tr><td>Drug Duplication</td><td>{{ drugDuplication.Good }}</td><td>{{ drugDuplication.Some }}<td>{{ drugDuplication.Not}}</td><td>{{ drugDuplication.Over}}</td></tr>
            <tr><td>Drug Disease</td><td>{{ drugDisease.Good }}</td><td>{{ drugDisease.Some }}<td>{{ drugDisease.Not}}</td><td>{{ drugDisease.Over}}</td></tr>
            <tr><td>Drug Omissions</td><td>{{ drugOmissions.Good }}</td><td>{{ drugOmissions.Some }}<td>{{ drugOmissions.Not}}</td><td>{{ drugOmissions.Over}}</td></tr>
            <tr><td>Theraputic Duplication</td><td>{{ theraputicDuplication.Good }}</td><td>{{ theraputicDuplication.Some }}<td>{{ theraputicDuplication.Not}}</td><td>{{ theraputicDuplication.Over}}</td></tr>
            <tr><td>Drug Lab</td><td>{{ drugLab.Good }}</td><td>{{ drugLab.Some }}<td>{{ drugLab.Not}}</td><td>{{ drugLab.Over}}</td></tr>
            <tr><td>Drug Brand</td><td>{{ drugBrand.Good }}</td><td>{{ drugBrand.Some }}<td>{{ drugBrand.Not}}</td><td>{{ drugBrand.Over}}</td></tr>
            <tr><td>Drug Route</td><td>{{ drugRoute.Good }}</td><td>{{ drugRoute.Some }}<td>{{ drugRoute.Not}}</td><td>{{ drugRoute.Over}}</td></tr>
            <tr><td>Drug Overdose</td><td>{{ drugOverdose.Good }}</td><td>{{ drugOverdose.Some }}<td>{{ drugOverdose.Not}}</td><td>{{ drugOverdose.Over}}</td></tr>
          </table>
        </div>

      </div>
      <div align="center">
        <div class="buttons">
          <button type="button" class=" results-btn btn btn-primary" @click="onExitClick()">Exit</button>
          <button type="button" class="results-btn btn btn-primary" @click="onHomeClick()">Home</button>
        </div>
      </div>
    </div>
  </div>


</template>

<script>

  import {dataService} from '../services/data.service';
  import TabHeader from './TabHeader';
  import CategoryTable from './CategoryTable';

  import axios from 'axios'
  import VueAxios from 'vue-axios'
  import Vue from 'vue'

  Vue.use(VueAxios, axios);

    export default {
        name: "AssessmentResults",
        components: {
           TabHeader,
           CategoryTable,
        },
        data() {
            return {
                categories : [],
                categoryData : [],
                indicators : [],
                tests : [],
                score : {
                    category : '',
                    resultAverage : ''
                },
                scores: null,
                sub : null,
                system : {
                     ep_usage : '',
                     lab_results: ''
                },
                prescriptionList : [],
              drugAge : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugDose : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugInteraction : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugAllergy : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugDuplication : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugDisease : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugOmissions : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              theraputicDuplication : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugLab : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugBrand : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugRoute : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
              drugOverdose : {
                "Good" : 0,
                "Some" : 0,
                "Not" : 0,
                "Over" : 0
              },
            }
        },
        computed: {
            getEpUsage() {
                return this.system.ep_usage;
            },
            getLabResults() {
                return this.system.lab_results;
            },
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
              });
            },
            formatData(item) {
              return {
                categoryName: item.prescription.indicator.category['categoryName'],
                mitigation: item.result
              };
            },
            onExitClick() {
                this.$router.push('/logout');
            },
            onHomeClick() {
                this.$router.push('/assessmentintro');
            },
            countCategories(data){
              for(let index in data){
                if(data.hasOwnProperty(index)){
                  let name = data[index].categoryName;
                  let mitigation = data[index].mitigation;

                  console.log(name);
                  console.log(mitigation);


                   switch(name){
                     case "Drug Age":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugAge.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugAge.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugAge.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugAge.Over++;
                       }
                       break;
                     case "Drug Dose":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugDose.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugDose.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugDose.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugDose.Over++;
                       }
                       break;
                     case "Drug Interaction":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugInteraction.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugInteraction.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugInteraction.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugInteraction.Over++;
                       }
                       break;
                     case "Drug Allergy":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugAllergy.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugAllergy.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugAllergy.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugAllergy.Over++;
                       }
                       break;
                     case "Drug Duplication":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugDuplication.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugDuplication.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugDuplication.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugDuplication.Over++;
                       }
                       break;
                     case "Drug Disease":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugDisease.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugDisease.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugDisease.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugDisease.Over++;
                       }
                       break;
                     case "Drug Omissions":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugOmissions.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugOmissions.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugOmissions.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugOmissions.Over++;
                       }
                       break;
                     case "Theraputic Duplication":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.theraputicDuplication.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.theraputicDuplication.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.theraputicDuplication.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.theraputicDuplication.Over++;
                       }
                       break;
                     case "Drug Lab":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugLab.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugLab.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugLab.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugLab.Over++;
                       }
                       break;
                     case "Drug Brand":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugBrand.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugBrand.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugBrand.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugBrand.Over++;
                       }
                       break;
                     case "Drug Route":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugRoute.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugRoute.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugRoute.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugRoute.Over++;
                       }
                       break;
                     case "Drug Overdose":
                       if(mitigation === 'Good Mitigation/Pass'){
                         this.drugOverdose.Good++;
                       }
                       else if (mitigation === 'Some Mitigation'){
                         this.drugOverdose.Some++;
                       }
                       else if (mitigation === 'No Mitigation/Fail'){
                         this.drugOverdose.Not++;
                       }
                       else if (mitigation === 'Over Mitigated'){
                         this.drugOverdose.Over++;
                       }
                       break;
                   }
                }
              }
            }
          },
        created() {
              // get the system id from the url
             let id = this.$route.params.ID;

            dataService.getCategories(id).then(data => {
              this.categories = data;
            });

            dataService.getAssessment(id).then(data => {
                  this.prescriptionList = data.prescriptionList;
                  this.system.ep_usage = data.system.ep_usage;
                  this.system.lab_results = data.system.lab_results.toString();

                  // audit
                  dataService.audit('View report', '/assessmentresults');
                  this.createResults(id);
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

  table, th, td {
    border: 1px solid #eeeeee;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
  }

  td .category {
    width: 20%;
    font-size: 18px;

  }

  td .description {
    width: 80%;
    font-size: 14px;

  }

  .results-data  {
    margin: 25px 0;
  }

  .results-data p {
    margin-left: 10px;
  }

  .results-data td {
    text-transform: capitalize;
  }


  .smiley {
    width: 40px;
    border: none;
    float: right;
    margin-right: 10px;
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

</style>
