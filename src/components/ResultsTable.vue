<template>

  <div id="page">
    <TabHeader system-opacity="1.0" patient-opacity="1.0" scenario-opacity="1.0" report-opacity="1.0"></TabHeader>

    <div id="content">
      <h4>Results by category and percentage</h4>

      <div class="results-summary">
        <table class="table is-striped">
          <tr><th>Category</th><th>Good mitigation/Pass</th><th>Some mitigation</th><th>Not mitigated</th><th>Over mitigated</th></tr>
          <tr>
            <td>Drug Age ({{ tableData['categories'][0].drugAge.count }})</td>
            <td>{{ calc(tableData['categories'][0].drugAge.good, tableData['categories'][0].drugAge.count) }}</td>
            <td>{{ calc(tableData['categories'][0].drugAge.some, tableData['categories'][0].drugAge.count) }}</td>
            <td>{{ calc(tableData['categories'][0].drugAge.not, tableData['categories'][0].drugAge.count) }}</td>
            <td>{{calc(tableData['categories'][0].drugAge.over, tableData['categories'][0].drugAge.count) }}</td></tr>
          <tr><td>Drug Dose ({{ tableData['categories'][1].drugDose.count }})</td>
            <td>{{ calc(tableData['categories'][1].drugDose.good, tableData['categories'][1].drugDose.count)  }}</td>
            <td>{{ calc(tableData['categories'][1].drugDose.some, tableData['categories'][1].drugDose.count) }}</td>
            <td>{{ calc(tableData['categories'][1].drugDose.not, tableData['categories'][1].drugDose.count) }}</td>
            <td>{{ calc(tableData['categories'][1].drugDose.over, tableData['categories'][1].drugDose.count) }}</td></tr>
          <tr><td>Drug Interaction ({{ tableData['categories'][2].drugInteraction.count }})</td>
            <td>{{ calc(tableData['categories'][2].drugInteraction.good, tableData['categories'][2].drugInteraction.count)  }}</td>
            <td>{{ calc(tableData['categories'][2].drugInteraction.some, tableData['categories'][2].drugInteraction.count) }}</td>
            <td>{{ calc(tableData['categories'][2].drugInteraction.not, tableData['categories'][2].drugInteraction.count) }}</td>
            <td>{{ calc(tableData['categories'][2].drugInteraction.over, tableData['categories'][2].drugInteraction.count) }}</td></tr>
          <tr><td>Drug Allergy ({{ tableData['categories'][3].drugAllergy.count }})</td>
            <td>{{ calc(tableData['categories'][3].drugAllergy.good, tableData['categories'][3].drugAllergy.count)   }}</td>
            <td>{{ calc(tableData['categories'][3].drugAllergy.some, tableData['categories'][3].drugAllergy.count)  }}</td>
            <td>{{ calc(tableData['categories'][3].drugAllergy.not, tableData['categories'][3].drugAllergy.count) }}</td>
            <td>{{ calc(tableData['categories'][3].drugAllergy.over, tableData['categories'][3].drugAllergy.count) }}</td></tr>
          <tr><td>Drug Duplication ({{ tableData['categories'][4].drugDuplication.count }})</td>
            <td>{{ calc(tableData['categories'][4].drugDuplication.good, tableData['categories'][4].drugDuplication.count) }} </td>
            <td>{{ calc(tableData['categories'][4].drugDuplication.some, tableData['categories'][4].drugDuplication.count) }}</td>
            <td>{{ calc(tableData['categories'][4].drugDuplication.not, tableData['categories'][4].drugDuplication.count) }}</td>
            <td>{{ calc(tableData['categories'][4].drugDuplication.over, tableData['categories'][4].drugDuplication.count) }}</td></tr>
          <tr><td>Drug Disease ({{ tableData['categories'][5].drugDisease.count }})</td>
            <td>{{ calc(tableData['categories'][5].drugDisease.good, tableData['categories'][5].drugDisease.count)  }}</td>
            <td>{{ calc(tableData['categories'][5].drugDisease.some, tableData['categories'][5].drugDisease.count) }}</td>
            <td>{{ calc(tableData['categories'][5].drugDisease.not, tableData['categories'][5].drugDisease.count) }}</td>
            <td>{{ calc(tableData['categories'][5].drugDisease.over, tableData['categories'][5].drugDisease.count) }}</td></tr>
          <tr><td>Drug Omissions ({{ tableData['categories'][6].drugOmissions.count }})</td>
            <td>{{ calc(tableData['categories'][6].drugOmissions.good, tableData['categories'][6].drugOmissions.count)  }}</td>
            <td>{{ calc(tableData['categories'][6].drugOmissions.some, tableData['categories'][6].drugOmissions.count) }}</td>
            <td>{{ calc(tableData['categories'][6].drugOmissions.not, tableData['categories'][6].drugOmissions.count) }}</td>
            <td>{{ calc(tableData['categories'][6].drugOmissions.over, tableData['categories'][6].drugOmissions.count) }}</td></tr>
          <tr><td>Theraputic Duplication ({{ tableData['categories'][7].theraputicDuplication.count }})</td>
            <td>{{ calc(tableData['categories'][7].theraputicDuplication.good, tableData['categories'][7].theraputicDuplication.count)  }}</td>
            <td>{{ calc(tableData['categories'][7].theraputicDuplication.some, tableData['categories'][7].theraputicDuplication.count)  }}</td>
            <td>{{ calc(tableData['categories'][7].theraputicDuplication.not, tableData['categories'][7].theraputicDuplication.count) }}</td>
            <td>{{ calc(tableData['categories'][7].theraputicDuplication.over, tableData['categories'][7].theraputicDuplication.count) }}</td></tr>
          <tr><td>Drug Lab ({{ tableData['categories'][8].drugLab.count }})</td>
            <td>{{ calc(tableData['categories'][8].drugLab.good, tableData['categories'][8].drugLab.count) }}</td>
            <td>{{ calc(tableData['categories'][8].drugLab.some, tableData['categories'][8].drugLab.count) }}</td>
            <td>{{ calc(tableData['categories'][8].drugLab.not, tableData['categories'][8].drugLab.count) }}</td>
            <td>{{ calc(tableData['categories'][8].drugLab.over, tableData['categories'][8].drugLab.count) }}</td></tr>
          <tr><td>Drug Brand ({{ tableData['categories'][9].drugBrand.count }})</td>
            <td>{{ calc(tableData['categories'][9].drugBrand.good, tableData['categories'][9].drugBrand.count) }}</td>
            <td>{{ calc(tableData['categories'][9].drugBrand.some, tableData['categories'][9].drugBrand.count) }}</td>
            <td>{{ calc(tableData['categories'][9].drugBrand.not, tableData['categories'][9].drugBrand.count) }}</td>
            <td>{{ calc(tableData['categories'][9].drugBrand.over, tableData['categories'][9].drugBrand.count) }}</td></tr>
          <tr><td>Drug Route ({{ tableData['categories'][10].drugRoute.count }})</td>
            <td>{{ calc(tableData['categories'][10].drugRoute.good, tableData['categories'][10].drugRoute.count) }}</td>
            <td>{{ calc(tableData['categories'][10].drugRoute.some, tableData['categories'][10].drugRoute.count) }}</td>
            <td>{{ calc(tableData['categories'][10].drugRoute.not, tableData['categories'][10].drugRoute.count) }}</td>
            <td>{{ calc(tableData['categories'][10].drugRoute.over, tableData['categories'][10].drugRoute.count) }}</td></tr>
          <tr><td>Drug Overdose ({{ tableData['categories'][11].drugOverdose.count }})</td>
            <td>{{ calc(tableData['categories'][11].drugOverdose.good, tableData['categories'][11].drugOverdose.count) }}</td>
            <td>{{ calc(tableData['categories'][11].drugOverdose.some, tableData['categories'][11].drugOverdose.count) }}</td>
            <td>{{ calc(tableData['categories'][11].drugOverdose.not, tableData['categories'][11].drugOverdose.count) }}</td>
            <td>{{ calc(tableData['categories'][11].drugOverdose.over, tableData['categories'][11].drugOverdose.count) }}</td></tr>
          <tr><td>Drug Frequency ({{ tableData['categories'][12].drugFrequency.count }})</td>
            <td>{{ calc(tableData['categories'][12].drugFrequency.good, tableData['categories'][12].drugFrequency.count) }}</td>
            <td>{{ calc(tableData['categories'][12].drugFrequency.some, tableData['categories'][12].drugFrequency.count) }}</td>
            <td>{{ calc(tableData['categories'][12].drugFrequency.not, tableData['categories'][12].drugFrequency.count) }}</td>
            <td>{{ calc(tableData['categories'][12].drugFrequency.over, tableData['categories'][12].drugFrequency.count) }}</td></tr>
          <tr><th>All Categories *</th><td class="good">Total : {{ calcPerCategory(totalGood, totalValidTests)  }}%</td><td class="some">Total : {{ calcPerCategory(totalSome, totalValidTests) }}% <td class="not">Total :  {{ calcPerCategory(totalNot, totalValidTests) }}% </td><td class="over">Total : {{ calcPerCategory(totalOver, totalValidTests) }}% </td></tr>
        </table>
      </div>

      <div class="note">* All categories (Good/Some/Not/Over) calculated as a percentage of the <strong>total valid tests</strong>, not an average of the previous columns</div>

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
    import {categoryService} from "../services/categoryService";
    import {stackedChartService} from "../services/stackedChartService";

    export default {
        name: "ResultsTable",
      components: {
        TabHeader,
        AppLogo
      },
        data() {
            return {
                totalGood : 0,
                totalSome : 0,
                totalNot : 0,
                totalOver : 0,
                totalAlerts : 0,
                totalValidTests : 0,
                totalNulls : 0,
                totalInterventions : 0,
                tableData : {},
                assessmentId : ''
            }
        },
        methods: {
          createResults(id) {

            let tempData = [];
            let formattedData = [];
            let tempResult =[];

            dataService. getPrescriptionTestData(id).then(data => {
              tempData = data;
              for(let index in tempData){
                if(tempData.hasOwnProperty(index)){
                  tempResult = this.formatData(tempData[index]);
                  formattedData.push(tempResult);
                }
              }

              this.countCategories(formattedData);

              // calculate number of valid tests, ignoring null results
              this.totalValidTests = parseInt(localStorage.getItem('numPrescriptions')) - this.totalNulls;
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
            let jsonData = categoryService.countCategories(data);
            this.totalGood = jsonData.totals.totalGood;
            this.totalSome = jsonData.totals.totalSome;
            this.totalOver = jsonData.totals.totalOver;
            this.totalNot = jsonData.totals.totalNot;
            this.totalNulls = jsonData.totals.totalNulls;
            this.totalInterventions = jsonData.totals.totalInterventions;
            this.tableData = jsonData;
          },
          onReportClick() {
            this.$router.push('/assessmentresults');
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
          }
        },
        created() {
          // get the assessment id from the url
          this.assessmentId = localStorage.getItem('assessmentId');

          dataService.getCategories(this.assessmentId).then(data => {
            this.categories = data;
          });

          dataService.getAssessmentById(this.assessmentId).then(data => {
            this.createResults(this.assessmentId);
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
    background-color: #66b4ea;
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
    border-width: 1px;
  }

  .results-btn {
    background-color: #02dddc;
    border : 0;
    margin: 25px 50px;
  }

  .note{
    padding: 20px;
    font-size: 0.8em;
  }

</style>
