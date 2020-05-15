<template>

  <div id="page">

      <div id="header" class="level">
      </div>

      <div class="content">

        <h2>Institution Reports</h2>

        <div v-show="reports.length === 0">
          <p>You currently have no reports available.</p>
        </div>

        <div class="list-group">
          <div v-if="reports.length > 0">

            <div v-for="report in reports">
              <router-link v-bind:to="{ name: 'assessmentresults', params: { ID: report.assessmentId }}" class="list-group-item list-group-item-action flex-column align-items-start">
              <p><strong>{{ report.institution.orgName }}</strong></p>
              <p>{{ report.system.ep_service }}</p>
              <p>{{ report.system.time_created }}</p>
              </router-link>
            </div>
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

    export default {
        name: "AssessmentReports",
        components : {
          AppFooter,
          TabHeader,
          AppLogo
        },
        data() {
            return {
              reports: []
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
          getFormattedDate(time){
            let timestamp = time;
            var date = new Date(timestamp * 1000).toLocaleDateString("en-GB");
            return date;
          }
        },
       created() {
         this.getReports();
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

</style>
