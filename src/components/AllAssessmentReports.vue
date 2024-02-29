<template>
  <div id="page">

    <div class="pills-banner">
    </div>

    <div class="content">

      <h2>All Institution Reports</h2>

      <div v-show="reports.length === 0">
        <p>You currently have no reports available.</p>
      </div>

      <div class="list-group">
        <div v-if="reports.length > 0">

          <div v-for="report in reports" v-bind:key="report">
            <div @click="onReportClick(report.assessmentId)" class="list-group-item list-group-item-action flex-column align-items-start">
              <strong>{{ report.institution.orgName }} -  {{ report.system.time_created }}</strong>
            </div>
          </div>
        </div>
      </div>

    </div>


    <div class="footer-bar-buttons">
      <button><i class="bi bi-house"></i><span class="headerLink"><router-link to="/adminhome">Admin Home</router-link></span></button>
      <button><i class="bi bi-box-arrow-right"></i><span class="headerLink"><router-link to="/login">Logout</router-link></span></button>
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
          }
      },
        created() {
            this.getReports();
        }
    }
</script>

<style scoped>


  #header {
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
    width: 170px;
    margin: 10px 0;
    font-size: 1em;
    border-width: 1px;
  }

  button a {
    padding: 3px;
    text-decoration: none;
  }

   button:hover {
      background-color: #daffde;
  }

  .footer-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
    border-width: 1px;
  }

  .list-group {
    padding-top: 40px;
 }

</style>
