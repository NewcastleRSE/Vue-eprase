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
        <div class="results-summary">
          <table>
            <tr><th>Category</th><th>Description</th></tr>
            <tr v-for="score in scores">
              <td class="category">{{ score.category }}</td>
              <td class="description"><img v-if="score.resultAverage >= 8   &&  score.resultAverage  <= 10" src="../assets/smiley5.jpg" title="5"  class="smiley">
                <img v-if="score.resultAverage >= 5   &&  score.resultAverage  <= 7"  src="../assets/smiley4.jpg" title="4"  class="smiley">
                <img v-if="score.resultAverage >= 2   &&  score.resultAverage  <= 4"  src="../assets/smiley3.jpg" title="3"  class="smiley">
                <img v-if="score.resultAverage >= -1  &&  score.resultAverage  <= 1"  src="../assets/smiley2.jpg" title="2"  class="smiley">
                <img v-if="score.resultAverage >= -4  &&  score.resultAverage  <= -2" src="../assets/smiley3.jpg" title="3"  class="smiley">
                <img v-if="score.resultAverage >= -7  &&  score.resultAverage  <= -5" src="../assets/smiley4.jpg" title="4"  class="smiley">
                <img v-if="score.resultAverage >= -10 &&  score.resultAverage  <= -8" src="../assets/smiley5.jpg" title="5"  class="smiley">
                <span v-if="score.resultAverage > 6  &&  score.resultAverage <= 10">Your system is not correctly mitigating the risk of erroneous prescriptions.</span>
                <span v-if="score.resultAverage > 2  &&  score.resultAverage <= 6">Your system may be failing to mitigate the risk of some erroneous prescriptions.</span>
                <span v-if="score.resultAverage >= -2  &&  score.resultAverage <= 2">Your system appears to be handling correct and incorrect prescriptions appropriately.</span>
                <span v-if="score.resultAverage >= -6  &&  score.resultAverage < -2">Your system may be intervening when it is not necessary, or presenting the user with unnecessary popups.</span>
                <span v-if="score.resultAverage >= -10  &&  score.resultAverage < -6">Your system is intervening when it is not necessary and/or is presenting the user with unnecessary popups.</span>
                <!--<span v-if="!isNaN(score.correlation)" class="badge badge-primary badge-pill">{{score.correlation}}</span>--></td>
            </tr>
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

    import jsonindicators from '../json/indicators.json';
    import jsontests from '../json/prescriptions.json'
    import { dataService } from '../services/data.service';
    import _ from 'lodash';
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
                subcategories : [],
                indicators : jsonindicators,
                tests : jsontests,
                score : {
                    category : '',
                    resultAverage : ''
                },
                scores: null,
                sub : null,
                part1 : {
                     ep_usage : '',
                     lab_results: ''
                },
                prescriptionList : []
            }
        },
        computed: {
            getEpUsage() {
                return this.part1.ep_usage;
            },
            getLabResults() {
                return this.part1.lab_results;
            },
            user() {
                return this.$store.state.authentication.user;
            }
        },
        methods : {

            createResults() {
                this.subcategories = _.uniq(_.map(this.indicators, 'subcategory'));

                if(this.prescriptionList !== undefined) {

                    // exclude tests with low risk scores
                    this.prescriptionList = _.reject(this.prescriptionList, { risk_score: 2 });
                    const totalCorrelation = this.calcSpearmans();

                    this.scores = [{
                        category: 'Total',
                        correlation: Number.isNaN(totalCorrelation) ? null : totalCorrelation,
                        resultAverage: _.meanBy(this.prescriptionList, 'result_score')
                    }];
                }

                this.subcategories.forEach((subCategory) => {

                    const questions = _.filter(this.prescriptionList, { subCategory });

                    if (questions.length > 0) {

                        const correlation = jStat.spearmancoeff(_.map(questions, 'rankedMitigation'),
                            _.map(questions, 'rankedRisk'));

                        this.scores.push({
                            category: subCategory.replace('Drug - ', ''),
                            correlation: Number.isNaN(correlation) ? null : correlation.toFixed(2),
                            resultAverage: _.meanBy(questions, 'result_score')
                        });
                    }
                });

            },
            calcSpearmans() {
                /** Spearman Correlation */
                for (let i = 0; i <  this.prescriptionList.length; i++) {
                    this.prescriptionList[i].mitigation_score = 10 - this.prescriptionList[i].result_score;
                    this.prescriptionList[i].subCategory = this.getSubcategory(this.prescriptionList[i].test_id);
                }

                for (let i = 0; i < this.prescriptionList.length; i++) {
                    this.prescriptionList[i].rankedMitigation = this.rankAverage(
                        this.prescriptionList[i].mitigation_score,
                        _.map(this.prescriptionList, 'mitigation_score'),
                        1
                    );
                    this.prescriptionList[i].rankedRisk = this.rankAverage(
                        this.prescriptionList[i].risk_score,
                        _.map(this.prescriptionList, 'risk_score'),
                        1
                    );
                }
                const mitigations = _.map(this.prescriptionList, 'rankedMitigation');
                const risks = _.map(this.prescriptionList, 'rankedRisk');
                return jStat.spearmancoeff(mitigations, risks).toFixed(2);
            },
            rankAverage(value, array, order) {
                if (order > 0) {
                    array.sort();
                } else {
                    array.sort().reverse();
                }
                array.unshift(value + 1);

                const keys = array.reduce(function(a, e, i) {
                    if (e === value) {
                        a.push(i);
                    }
                    return a;
                }, []);

                if (keys.length === 0) {
                    return null;
                } else {
                    return _.sum(keys) / keys.length;
                }
            },
            getSubcategory(testID) {
                let category = '';

                for (let i = 0; i < this.tests.length; i++) {
                    const test = this.tests[i];
                    if (test.id === testID) {
                        const category_id = test.indicator_id;

                        if (category_id === 'CEXXX') {
                            return 'No Category';
                        }

                        for (let x = 0; x < this.indicators.length; x++) {
                            const cat = this.indicators[x];

                            if (category_id === cat.id) {
                                category = cat.subcategory;
                            }
                        }
                    }
                }
                return category;
            },
            onExitClick() {
                this.$router.push('/logout');
            },
            onHomeClick() {
                this.$router.push('/assessmentintro');
            }
        },
        created() {
            // get the assessment id from the url
            let id = this.$route.params.ID;
            dataService.getAssessment(id).then(data => {
                this.prescriptionList = data.prescriptionList;
                this.part1.ep_usage = data.part1.ep_usage;
                this.part1.lab_results = data.part1.lab_results.toString();

                // audit
                dataService.audit('View report', '/assessmentresults');

                this.createResults();
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
