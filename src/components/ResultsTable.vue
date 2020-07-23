<template>

  <div id="page">
    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>

    <div id="content">
      <h4>Results by category and percentage</h4>

      <div class="results-summary">
        <table class="table is-striped">
          <tr><th>Category</th><th>Good mitigation/Pass</th><th>Some mitigation</th><th>Not mitigated</th><th>Over mitigated</th></tr>
          <tr>
            <td>Drug Age ({{ drugAge.count }})</td>
            <td>{{ calc(drugAge.good, drugAge.count)  }}</td>
            <td>{{ calc(drugAge.some, drugAge.count) }}</td>
            <td>{{ calc(drugAge.not, drugAge.count)}}</td>
            <td>{{ calc(drugAge.over, drugAge.count)}}</td></tr>
          <tr><td>Drug Dose ({{ drugDose.count }})</td>
            <td>{{ calc(drugDose.good, drugDose.count)  }}</td>
            <td>{{ calc(drugDose.some, drugDose.count) }}</td>
            <td>{{ calc(drugDose.not, drugDose.count)}}</td>
            <td>{{ calc(drugDose.over, drugDose.count)}}</td></tr>
          <tr><td>Drug Interaction ({{ drugInteraction.count }})</td>
            <td>{{ calc(drugInteraction.good, drugInteraction.count)  }}</td>
            <td>{{ calc(drugInteraction.some, drugInteraction.count) }}</td>
            <td>{{ calc(drugInteraction.not, drugInteraction.count)}}</td>
            <td>{{ calc(drugInteraction.over, drugInteraction.count)}}</td></tr>
          <tr><td>Drug Allergy ({{ drugAllergy.count }})</td>
            <td>{{ calc(drugAllergy.good, drugAllergy.count)   }}</td>
            <td>{{ calc(drugAllergy.some, drugAllergy.count)  }}</td>
            <td>{{ calc(drugAllergy.not, drugAllergy.count) }}</td>
            <td>{{ calc(drugAllergy.over, drugAllergy.count) }}</td></tr>
          <tr><td>Drug Duplication ({{ drugDuplication.count }})</td>
            <td>{{ calc(drugDuplication.good, drugDuplication.count) }} </td>
            <td>{{ calc(drugDuplication.some, drugDuplication.count) }}</td>
            <td>{{ calc(drugDuplication.not, drugDuplication.count)}}</td>
            <td>{{ calc(drugDuplication.over, drugDuplication.count)}}</td></tr>
          <tr><td>Drug Disease ({{ drugDisease.count }})</td>
            <td>{{ calc(drugDisease.good, drugDisease.count)  }}</td>
            <td>{{ calc(drugDisease.some, drugDisease.count) }}</td>
            <td>{{ calc(drugDisease.not, drugDisease.count)}}</td>
            <td>{{ calc(drugDisease.over, drugDisease.count)}}</td></tr>
          <tr><td>Drug Omissions ({{ drugOmissions.count }})</td>
            <td>{{ calc(drugOmissions.good, drugOmissions.count)  }}</td>
            <td>{{ calc(drugOmissions.some, drugOmissions.count) }}</td>
            <td>{{ calc(drugOmissions.not, drugOmissions.count)}}</td>
            <td>{{ calc(drugOmissions.over, drugOmissions.count)}}</td></tr>
          <tr><td>Theraputic Duplication ({{ theraputicDuplication.count }})</td>
            <td>{{ calc(theraputicDuplication.good, theraputicDuplication.count)  }}</td>
            <td>{{ calc(theraputicDuplication.some, theraputicDuplication.count)  }}</td>
            <td>{{ calc(theraputicDuplication.not, theraputicDuplication.count) }}</td>
            <td>{{ calc(theraputicDuplication.over, theraputicDuplication.count) }}</td></tr>
          <tr><td>Drug Lab ({{ drugLab.count }})</td>
            <td>{{ calc(drugLab.good, drugLab.count)  }}</td>
            <td>{{ calc(drugLab.some, drugLab.count)  }}</td>
            <td>{{ calc(drugLab.not, drugLab.count) }}</td>
            <td>{{ calc(drugLab.over, drugLab.count) }}</td></tr>
          <tr><td>Drug Brand ({{ drugBrand.count }})</td>
            <td>{{ calc(drugBrand.good, drugBrand.count)   }}</td>
            <td>{{ calc(drugBrand.some, drugBrand.count) }}</td>
            <td>{{ calc(drugBrand.not, drugBrand.count)}}</td>
            <td>{{ calc(drugBrand.over, drugBrand.count)}}</td></tr>
          <tr><td>Drug Route ({{ drugRoute.count }})</td>
            <td>{{ calc(drugRoute.good, drugRoute.count)   }}</td>
            <td>{{ calc(drugRoute.some, drugRoute.count)  }}</td>
            <td>{{ calc(drugRoute.not, drugRoute.count) }}</td>
            <td>{{ calc(drugRoute.over, drugRoute.count) }}</td></tr>
          <tr><td>Drug Overdose ({{ drugOverdose.count }})</td>
            <td>{{ calc(drugOverdose.good, drugOverdose.count)   }}</td>
            <td>{{ calc(drugOverdose.some, drugOverdose.count)  }}</td>
            <td>{{ calc(drugOverdose.not, drugOverdose.count) }}</td>
            <td>{{ calc(drugOverdose.over, drugOverdose.count) }}</td></tr>
          <tr><td>Drug Frequency ({{ drugFrequency.count }})</td>
            <td>{{ calc(drugFrequency.good, drugFrequency.count)   }}</td>
            <td>{{ calc(drugFrequency.some, drugFrequency.count)  }}</td>
            <td>{{ calc(drugFrequency.not, drugFrequency.count) }}</td>
            <td>{{ calc(drugFrequency.over, drugFrequency.count) }}</td></tr>
          <tr><th>All Categories</th><td class="good">Total : {{ calcPerCategory(totalGood, totalValidTests)  }}%</td><td class="some">Total : {{ calcPerCategory(totalSome, totalValidTests) }}% <td class="not">Total :  {{ calcPerCategory(totalNot, totalValidTests) }}% </td><td class="over">Total : {{ calcPerCategory(totalOver, totalValidTests) }}% </td></tr>
        </table>
      </div>

      <button class="reportbutton" @click="onReportClick()"><font-awesome-icon icon="chart-bar"></font-awesome-icon> View Report</button>

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
    import {dataService} from "../services/data.service";
    import TabHeader from "./TabHeader";
    import AppLogo from "./AppLogo";
    import {settings} from "../settings";

    export default {
        name: "ResultsTable",
      components: {
        TabHeader,
        AppLogo
      },
        data() {
            return {
                categoryData : [],
                totalGood : 0,
                totalSome : 0,
                totalNot : 0,
                totalOver : 0,
                totalAlerts : 0,
                totalValidTests : 0,
                totalNulls : 0,
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
                drugFrequency : { good : 0, some : 0, not : 0, over : 0,  count : 0 }
            }
        },
        methods: {
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

              console.log('results table');
              console.log(this.categoryData);

              this.countCategories(this.categoryData);

              // calculate number of valid tests, ignoring null results
              this.totalValidTests = settings.numPrescriptions - this.totalNulls;
            });
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
                    case "Drug Frequency":
                      if(mitigation === 'Good Mitigation/Pass'){
                        this.drugFrequency.good++;
                        this.totalGood++;
                      }
                      else if (mitigation === 'Some Mitigation'){
                        this.drugFrequency.some++;
                        this.totalSome++;
                      }
                      else if (mitigation === 'No Mitigation/Fail'){
                        this.drugFrequency.not++;
                        this.totalNot++;
                      }
                      else if (mitigation === 'Over Mitigation'){
                        this.drugFrequency.over++;
                        this.totalOver++;
                      }

                      if(mitigation !== 'Null'){
                        this.drugFrequency.count++;
                      }
                      break;
                  }
                }
              }
            }
          },
          onReportClick() {
            let id = this.$route.params.ID;
            this.$router.push('/assessmentresults/'+ id);
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
          let assessment_id = this.$route.params.ID;

          dataService.getCategories(assessment_id).then(data => {
            this.categories = data;
          });

          dataService.getAssessmentById(assessment_id).then(data => {
            this.createResults(assessment_id);
          });

        }
    }
</script>

<style scoped>

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

  td.good {
    background-color: #35d635;
  }

  td.some {
    background-color: #FFBF00;
  }

  td.not { background-color: #ff3b33;
  }

  td.over {
    background-color: #cd0a2a;
  }


  #page {
    text-align: left;
  }

  #content {
    padding: 40px;
  }

  .reportbutton {
    height: 40px;
    width: 200px;
    margin: 10px 0;
    font-size: 1em;
  }

  button a {
    padding: 3px;
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



</style>
