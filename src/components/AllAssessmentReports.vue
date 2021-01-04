<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div class="content">

      <h2>All Institution Reports</h2>

      <div v-show="reports.length === 0">
        <p>You currently have no reports available.</p>
      </div>

      <div class="list-group">
        <div v-if="reports.length > 0">

          <div v-for="report in reports">
            <div @click="onReportClick(report.assessmentId)" class="list-group-item list-group-item-action flex-column align-items-start">
              <p><strong>{{ report.institution.orgName }} -  {{ report.system.time_created }}</strong></p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div align="center">
      <div class="buttons">
        <button type="button" class="results-btn btn btn-primary" @click="onExitClick()">Exit</button>
        <button type="button" class="results-btn btn btn-primary" @click="onAdminHomeClick()">Admin Home</button>
      </div>
    </div>

    <AppLogo></AppLogo>
  </div>
</template>

<script>
    import AppLogo from "./AppLogo";
    import {dataService} from "../services/data.service";

    export default {
        name: "AllAssessmentReports",
        components: {
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
          onReportClick(assessmentId) {
            this.$router.push({ path: './assessmentresults?ID=' + assessmentId });
          },
          getFormattedDate(time){
            let timestamp = time;
            var date = new Date(timestamp * 1000).toLocaleDateString("en-GB");
            let parts = date.split('/');
            return parts[2];
          },
          onExitClick() {
            this.$router.push('/logout');
          },
          onAdminHomeClick() {
            this.$router.push('/adminhome');
          },
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


  button {
    height: 40px;
    width: 250px;
    margin: 10px 0;
    font-size: 1em;
    border-width: 1px;
  }

  button a {
    padding: 3px;
  }

  .results-btn {
    background-color: #07818e;
    border : 0;
    height: 40px;
    width: 100px;
    margin: 25px 50px;
    font-size: 1.2em;
  }

 .list-group {

 }

</style>
