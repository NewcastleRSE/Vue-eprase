<template>
  <div id="page">
    <Header />

    <div id="content">
      <h1>ePRaSE 2019 Assessment Results</h1>
      <p>Below are the results from the 2019 ePRaSE assessment. </p>

      <div class="assessment-results" v-if="getAssessment">

        <h3>eP Usage Results</h3>
        <p>The following results are based on your answers to the questions in part 1 of the assessment.</p>
        <div class="results-data">

          <table>
            <tr>
              <td><strong>eP Usage</strong></td><td>{{ getAssessment.ep_usage }}%</td>
              <td>
                <img v-if="getAssessment.ep_usage==='76-100'" src="../assets/smiley1.jpg" title="great" class="smiley">
                <img v-if="getAssessment.ep_usage==='51-75'"  src="../assets/smiley2.jpg" title="good"  class="smiley">
                <img v-if="getAssessment.ep_usage==='26-50'"  src="../assets/smiley3.jpg" title="ok"    class="smiley">
                <img v-if="getAssessment.ep_usage==='0-25'"  src="../assets/smiley4.jpg" title="poor"  class="smiley">
              </td>
            </tr>
          </table>
          <p>Higher usage of the eP system is considered safer.</p>
        </div>
        <div class="results-data">
          <table>
            <tr>
              <td><strong>Lab Results</strong></td><td>{{ getAssessment.lab_results }}</td>
              <td>
                <img v-if="getAssessment.lab_results==='true'"  src="../assets/smiley2.jpg" title="good" class="smiley">
                <img v-if="getAssessment.lab_results==='false'" src="../assets/smiley4.jpg" title="bad"   class="smiley">
              </td>
            </tr>
          </table>
          <p>In order to properly test your eP system, you should be able to input lab results.</p>
        </div>
        <h3>Summary Results</h3>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center" v-for="score in scores">
            <h4>{{score.category}}</h4>
            <div class="result-description">
              <img v-if="score.resultAverage >= 8   &&  score.resultAverage  <= 10" src="../assets/smiley5.jpg" title="5"  class="smiley">
            <!--  <img v-if="score.resultAverage >= 5   &&  score.resultAverage  <= 7"  src="../assets/smiley4.jpg" title="4"  class="smiley">
              <img v-if="score.resultAverage >= 2   &&  score.resultAverage  <= 4"  src="../assets/smiley3.jpg" title="3"  class="smiley">
              <img v-if="score.resultAverage >= -1  &&  score.resultAverage  <= 1"  src="../assets/smiley2.jpg" title="2"  class="smiley">
              <img v-if="score.resultAverage >= -4  &&  score.resultAverage  <= -2" src="../assets/smiley3.jpg" title="3"  class="smiley">
              <img v-if="score.resultAverage >= -7  &&  score.resultAverage  <= -5" src="../assets/smiley4.jpg" title="4"  class="smiley">
              <img v-if="score.resultAverage >= -10 &&  score.resultAverage  <= -8" src="../assets/smiley5.jpg" title="5"  class="smiley">
              <p v-if="score.resultAverage >    6  &&  score.resultAverage <=  10">Your system is not correctly mitigating the risk of erroneous prescriptions.</p>
              <p v-if="score.resultAverage >    2  &&  score.resultAverage <=   6">Your system may be failing to mitigate the risk of some erroneous prescriptions.</p>
              <p v-if="score.resultAverage >=  -2  &&  score.resultAverage <=   2">Your system appears to be handling correct and incorrect prescriptions appropriately.</p>
              <p v-if="score.resultAverage >=  -6  &&  score.resultAverage <   -2">Your system may be intervening when it is not necessary, or presenting the user with unnecessary popups.</p>
              <p v-if="score.resultAverage >= -10  &&  score.resultAverage <   -6">Your system is intervening when it is not necessary and/or is presenting the user with unnecessary popups.</p> -->
              <!--<span v-if="!isNaN(score.correlation)" class="badge badge-primary badge-pill">{{score.correlation}}</span>-->
            </div>
          </li>
        </ul>
      </div>
      <div align="center">
        <div class="buttons">
          <button type="button" class="btn btn-primary" @click="onBackClick()">Back</button>
          <button type="button" class="btn btn-primary" @click="onHomeClick()">Home</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>


    import jsonindicators from '../json/indicators.json';
    import { dataService } from '../services/data.service';
    import _ from 'lodash';
    import jStat from 'jStat';
    import Header from './Header';

    export default {
        name: "AssessmentResults",
        components: {
            Header,
            jStat
        },
        data() {
            return {
                subcategories : [],
                indicators : jsonindicators,
                score : {
                    category : '',
                    resultAverage : ''
                },
                scores: null,
                sub : null
            }
        },
        computed: {
            getAssessment() {
                return this.$store.state.ep_usage;
            }
        },
        methods : {
            calcSpearmans() {
                const mitigations = _.map(this.assessment.prescriptionList, 'rankedMitigation');
                const risks = _.map(this.assessment.prescriptionList, 'rankedRisk');

                const totalCorrelation = (jStat.spearmancoeff(mitigations, risks)).toFixed(2);
                return totalCorrelation;
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
            onBackClick() {
                this.$router.push('/results-home');
            },
            onHomeClick() {
                this.$router.push('/home');
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

  img {
    border: 1px solid black;
  }

  .assessment-results {
    padding-bottom: 20px;
  }

  td {
    width: 180px;
    font-size: 14px;
    #text-align: center;
  }

  table {
    margin-left: 10px;
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
    float: left;
    margin-right: 10px;
  }

  p {
    line-height: 40px;
  }

  button {
    height: 40px;
    width: 100px;
    margin: 10px 0px;
    font-size: 1.2em;
  }

</style>
