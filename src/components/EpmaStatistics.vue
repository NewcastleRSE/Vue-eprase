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
              <th>Name</th><th>Ep system</th><th>Version</th><th>EP Usage</th><th>Lab Results (manual entry)</th><th>Medical History (manual entry)</th><th>High Risk Meds Coverage</th><th>Clinical Areas Coverage</th>
            </tr>
            <tr v-for="report in reports" id="report">
              <td>{{ report.institution.orgName }}</td>
              <td><span v-if="report.system.ep_service !=='Other'">{{ report.system.ep_service}} </span>
                <span v-if="report.system.other_ep_system">{{ report.system.other_ep_system}}</span></td>
              <td>{{ report.system.ep_version }}</td>
              <td>{{ report.system.ep_usage }}%</td>
              <td><span>{{ report.system.lab_results ? 'Y' : 'N' }} {{ report.system.man_results ? '(Y)' : '(N)' }}</span></td>
              <td>{{ report.system.med_history ? 'Y' : 'N' }}  {{ report.system.diagnosis_results ? '(Y)' : '(N)' }}</td>
              <td>{{ report.system.high_risk_meds }}% </td>
              <td>{{ report.system.clinical_areas }}%</td>
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
                clinical_areas: [],
            }
        },
        methods: {
            getReports() {
                dataService.getAllReports().then(data => {
                    this.reports = data;
                    for(let index in this.reports){
                        if(this.reports.hasOwnProperty(index)){
                            let temptime = this.reports[index].system.time_created;
                            this.reports[index].system.time_created = this.getFormattedDate(temptime);
                            this.reports[index].system.high_risk_meds = this.calcMeds(this.reports[index].system.high_risk_meds);
                            this.reports[index].system.clinical_areas = this.calcAreas(this.reports[index].system.clinical_areas);
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
            calcAreas(clinical_areas){
                this.clinical_areas = clinical_areas.split(',');
                return Math.round(this.clinical_areas.length/9 * 100);
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

</style>
