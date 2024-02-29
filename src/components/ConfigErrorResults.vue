<template>
  <div id="page">

    <div class="pills-banner">
    </div>

    <div class="content">

      <h2>Configuration Error Results</h2>

      <div v-show="reports.length === 0">
        <p>You currently have no reports available.</p>
      </div>

      <div id="report-list-two">
        <div v-if="reports.length > 0">

          <table class="table">
            <thead>
            <tr>
              <th> Institution Name</th>
              <th>Ep System</th>
              <th class="align-content-center">Are previous patient records open?</th>
              <th class="align-content-center">Pass</th>
              <th class="align-content-center">Can insulin be prescribed in ML?</th>
              <th class="align-content-center">Pass</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="report in reports" id="report-two">

              <td>{{ report.institution.orgName }}</td>
              <td><span v-if="report.system.ep_service !=='Other'">{{ report.system.ep_service}} </span>
                <span v-if="report.system.other_ep_system">{{ report.system.other_ep_system}}</span></td>

              <td class="align-content-center"><span v-text="report.configErrorDataList[0].result===0 ? 'N' : 'Y' "></span></td>

              <td class="align-content-center"><img v-show="report.configErrorDataList[0].result === 0" src="../assets/images/green-tick.png" alt="tick" class="smallimg"><img v-show="report.configErrorDataList[0].result === 1" src="../assets/images/cross.png" alt="cross" class="smallimg"></td>

              <td class="align-content-center"><span v-text="report.configErrorDataList[1].result===0 ? 'N' : 'Y' "></span></td>

              <td class="align-content-center"><img v-show="report.configErrorDataList[1].result === 0" src="../assets/images/green-tick.png" alt="tick" class="smallimg"><img v-show="report.configErrorDataList[1].result === 1" src="../assets/images/cross.png" alt="cross" class="smallimg"></td>
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
        name: "ConfigErrorResults",
        components : {
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

                });
            },
            getFormattedDate(time){
                let timestamp = time;
                var date = new Date(timestamp * 1000).toLocaleDateString("en-GB");
                return date;
            }
        },
        created() {
            this.getReports()
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

  #report-list-two {
    margin-top: 40px;
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

   .footer-bar-buttons {
    padding-left: 40px;
    padding-bottom: 20px;
    border-width: 1px;
  }

   button a {
    padding: 3px;
    text-decoration: none;
   }

   button:hover {
      background-color: #daffde;
   }

  #page {
    text-align: left;
  }

  .content {
    padding: 40px;
  }

  #report-two {
    padding: 5px 0;
  }

  .align-content-center{
    text-align: center;
  }

  .smallimg {
    height : 25px;
    width : auto;
  }

</style>
