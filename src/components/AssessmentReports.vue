<template>

  <div id="page">

      <div id="header" class="level">
      </div>

      <div class="content">

        <h2>Institution Reports</h2>

        <div v-show="reports.length === 0">
          <p>You currently have no reports available.</p>
        </div>

        <div class="report-list">
          <div v-if="reports.length > 0">

            <table class="table striped">
              <tr>
                <th>Name</th><th>Ep system</th><th>Version</th><th>Patient Type</th><th>Created</th>
              </tr>
              <tr v-for="report in reports" class="report">


                    <td @click="onReportClick(report.assessmentId)">{{ report.institution.orgName }}</td>
                    <td><span v-if="report.system.ep_service !=='Other'">{{ report.system.ep_service}} </span>
                      <span v-if="report.system.other_ep_system">{{ report.system.other_ep_system}}</span></td>
                    <td>{{ report.system.ep_version }}</td>
                    <td>{{ report.system.patient_type }}</td>
                    <td>{{ report.system.time_created }}</td>
                </tr>
            </table>

          </div>
        </div>
      </div>

    <AppFooter />
    <AppLogo></AppLogo>
  </div>
</template>

<script>
    import {dataService} from "../services/data.service";
    import AppFooter from "./AppFooter";
    import TabHeader from "./TabHeader";
    import AppLogo from "./AppLogo";
    import _ from "lodash";
    import {settings} from "../settings";

    export default {
        name: "AssessmentReports",
        components : {
          AppFooter,
          TabHeader,
          AppLogo
        },
        data() {
            return {
              reports: [],
              numPrescriptions: 0
            }
        },
        methods: {
            getReports() {
              dataService.getAllReports().then(data => {
                this.reports = data;
                for(let index in this.reports){
                  if(this.reports.hasOwnProperty(index)){
                    let temptime = this.reports[index].system.time_created;
                    let formattedTime = this.getFormattedDate(temptime);
                    this.reports[index].system.time_created = formattedTime;
                  }
                }
              });
            },
          onReportClick(assessmentId) {
            this.$router.push({ path: './assessmentresults?ID=' + assessmentId });
          },
          getFormattedDate(time){
            let timestamp = time;
            var date = new Date(timestamp * 1000).toLocaleDateString("en-GB");
            return date;
          }
        },
       created() {
         this.getReports();
         // if this hasn't been set already, get it from the settings
         this.numPrescriptions = localStorage.getItem('numPrescriptions');

         if(_.isEmpty(this.numPrescriptions)){
           localStorage.setItem('numPrescriptions', parseInt(settings.numPrescriptions));
         }
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

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

 .report {
   padding: 5px 0;
 }

  .report:hover {
    cursor: pointer;
  }

  .report-list {
    padding: 40px 0;
  }

</style>
