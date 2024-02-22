<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h2>EPMA Statistics</h2>

      <div v-show="reports.length === 0">
        <p>You currently have no reports available.</p>
      </div>

      <div id="report-list-one">
        <div v-if="reports.length > 0">

          <table class="table table-striped">
            <caption>Statistics per institution</caption>
            <thead>
                <tr>
                  <th> Institution Name</th>
                  <th>Ep System</th>
                  <th class="ep-usage align-content-center">EP Usage</th>
                  <th class="align-content-center">Additional EP System</th>
                  <th class="align-content-center">Lab Results<br><span class="smaller">(manually enter lab results)</span></th>
                  <th class="align-content-center">Medical History<br><span class="smaller">(enter diagnosis or comorbidities)</span></th>
                  <th class="align-content-center">High Risk Meds Coverage</th>
                  <th class="align-content-center">High Risk Areas</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="report in reports" id="report-one">

              <td>{{ report.institution.orgName }}</td>
              <td class="align-content-center"><span v-if="report.system.ep_service !=='Other'">{{ report.system.ep_service}} </span>
                <span v-if="report.system.other_ep_system">{{ report.system.other_ep_system}}</span></td>
              <td class="align-content-center">{{ report.system.ep_usage }}%</td>
              <td class="align-content-center">{{ report.system.add_ep_system }}</td>
              <td class="align-content-center"><span>{{ report.system.lab_results ? 'Y' : 'N' }} {{ report.system.man_results ? '(Y)' : '(N)' }}</span></td>
              <td class="align-content-center">{{ report.system.med_history ? 'Y' : 'N' }}  {{ report.system.diagnosis_results ? '(Y)' : '(N)' }}</td>
              <td class="align-content-center">{{ report.system.high_risk_meds }}% </td>
              <td class="align-content-center"><span v-for="area in report.system.clinical_areas">&bull; {{ area }} <br></span></td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>

    <div class="footer-bar-buttons">
      <button><i class="bi bi-house-gear"></i><span class="headerLink"><router-link to="/adminhome">Admin Home</router-link></span></button>
      <button><i class="bi bi-box-arrow-right"></i><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
    </div>

    <AppLogo></AppLogo>
  </div>
</template>

<script>

    import {dataService} from "../services/data.service";
    import AppLogo from "./AppLogo";

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
    background-image: url("../assets/images/pills-bw.png");
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

   button:hover {
      background-color: #daffde;
  }

  button a {
    padding: 3px;
    text-decoration: none;
  }

  .footer-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
    border-width: 1px;
  }

  caption {
      font-style: italic;
      color: #07818e;
  }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

  #report-one {
    padding: 5px 0;
  }

  #report-list-one {
    padding: 40px 0;
  }
  .smaller {
    font-size: 0.8em;
    font-style: italic;
  }

  .ep-usage {
    min-width: 100px;
  }

  .align-content-center{
    text-align: center;
  }



</style>
