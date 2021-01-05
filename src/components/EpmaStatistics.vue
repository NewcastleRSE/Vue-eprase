<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h2>EPMA Statistics</h2>

      <div v-show="reports.length === 0">
        <p>You currently have no reports available.</p>
      </div>

      <div id="report-list">
        <div v-if="reports.length > 0">

          <table class="table striped">
            <tbody>
            <tr>
              <th> Institution Name</th><th>Ep System</th><th class="ep-usage">EP Usage</th><th>Additional EP System</th><th>Lab Results<br><span class="smaller">(manually enter lab results)</span></th><th>Medical History<br><span class="smaller">(enter diagnosis or comorbidities)</span></th><th>High Risk Meds Coverage</th><th>High Risk Areas</th><th>Patient Records Open?</th><th>Insulin in ML?</th>
            </tr>
            <tr v-for="report in reports" id="report">

              {{ report.system }}
              <td>{{ report.institution.orgName }}</td>
              <td><span v-if="report.system.ep_service !=='Other'">{{ report.system.ep_service}} </span>
                <span v-if="report.system.other_ep_system">{{ report.system.other_ep_system}}</span></td>
              <td>{{ report.system.ep_usage }}%</td>
              <td>{{ report.system.add_ep_system }}</td>
              <td><span>{{ report.system.lab_results ? 'Y' : 'N' }} {{ report.system.man_results ? '(Y)' : '(N)' }}</span></td>
              <td>{{ report.system.med_history ? 'Y' : 'N' }}  {{ report.system.diagnosis_results ? '(Y)' : '(N)' }}</td>
              <td>{{ report.system.high_risk_meds }}% </td>
              <td><span v-for="area in report.system.clinical_areas">&bull; {{ area }} <br></span></td>
              <td>{{report.configErrorDataList[0].result ? 'Y' : 'N'}}</td>
              <td>{{report.configErrorDataList[1].result ? 'Y' : 'N'}}</td>

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
    import {settings} from "../settings";

    export default {
        name: "EpmaStatistics",
        components : {
            AppLogo
        },
        data() {
            return {
                reports: [],
                high_risk_meds: [],
                clinical_areas: []
            }
        },
        methods: {
            getReports() {
                dataService.getAllReports().then(data => {
                    this.reports = data;

                    console.log(this.reports);

                    for(let index in this.reports){
                        if(this.reports.hasOwnProperty(index)){
                            let temptime = this.reports[index].system.time_created;
                            this.reports[index].system.time_created = this.getFormattedDate(temptime);
                            this.reports[index].system.high_risk_meds = this.calcMeds(this.reports[index].system.high_risk_meds);
                            this.reports[index].system.clinical_areas = this.findHighRiskAreas(this.reports[index].system.clinical_areas);
                        }
                    }
                });
            },
            getFormattedDate(time){
                let timestamp = time;
                var date = new Date(timestamp * 1000).toLocaleDateString("en-GB");
                return date;
            },
            calcMeds(meds){
                this.high_risk_meds = meds.split(',');
                return this.high_risk_meds.length/10 * 100;
            },
            findHighRiskAreas(clinical_areas){
                let high_risk_areas = [];
                this.clinical_areas = clinical_areas.split(',');
                for(let index in this.clinical_areas){
                    if((this.clinical_areas[index] === 'ACC')||(this.clinical_areas[index] === 'PCC')||(this.clinical_areas[index] === 'A&E')){
                        high_risk_areas.push(this.clinical_areas[index]);
                    }
                }
                return high_risk_areas;
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

  button a {
    padding: 3px;
  }

  .footer-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
    border-width: 1px;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

  #report {
    padding: 5px 0;
  }

  #report-list {
    padding: 40px 0;
  }
  .smaller {
    font-size: 0.8em;
    font-style: italic;
  }

  .ep-usage {
    min-width: 100px;
  }

</style>
