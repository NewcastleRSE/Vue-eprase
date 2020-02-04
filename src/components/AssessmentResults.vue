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
          {{ categoryData }}


        </div>
        <h3>Summary Results</h3>
        <div class="results-summary">
          <table class="table is-striped">
            <tr><th>Category</th><th>Good mitigation/Pass</th><th>Some mitigation</th><th>Not mitigated</th><th>Over mitigated</th></tr>
            <tr><td>Drug Age</td><td><td><td><td></td></tr>
            <tr><td>Drug Dose</td><td><td><td><td></td></tr>
            <tr><td>Drug Interaction</td><td><td><td><td></td></tr>
            <tr><td>Drug Allergies</td><td><td><td><td></td></tr>
            <tr><td>Drug Duplication</td><td><td><td><td></td></tr>
            <tr><td>Drug Disease</td><td><td><td><td></td></tr>
            <tr><td>Drug Omissions</td><td><td><td><td></td></tr>
            <tr><td>Theraputic Duplication</td><td><td><td><td></td></tr>
            <tr><td>Drug Lab</td><td><td><td><td></td></tr>
            <tr><td>Drug Brand</td><td><td><td><td></td></tr>
            <tr><td>Drug Route</td><td><td><td><td></td></tr>
            <tr><td>Drug Overdose</td><td><td><td><td></td></tr>
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

    import { dataService } from '../services/data.service';
    import jStat from 'jstat';
    import TabHeader from './TabHeader';

    import axios from 'axios'
    import VueAxios from 'vue-axios'
    import Vue from 'vue'

    Vue.use(VueAxios, axios);

    export default {
        name: "AssessmentResults",
        components: {
           TabHeader,
            jStat
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
              drugAllergies : {
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
              }
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
                  tempResult = this.formatData(tempData[index]);
                  formattedData.push(tempResult);
                }
                this.categoryData = formattedData;
                //console.log(this.categoryData);

                // function to assign category counts here..

              });
            },
            formatData(item) {
              let result = {
                categoryName : item.prescription.indicator.category['categoryName'],
                mitigation : item.result
              }
              return result;
            },
            onExitClick() {
                this.$router.push('/logout');
            },
            onHomeClick() {
                this.$router.push('/assessmentintro');
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

  .results-data,  .results-summary  {
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
