<template>
  <div id="page">

    <div id="header" class="level">
    </div>

    <div id="content">
      <div class="welcome-text">
        <div>
          <h2>Reports Home</h2>
          <p>Here you can browse the reports from all of the ePRaSE assessments that you have participated in.</p>
        </div>
      </div>

      <div v-show="assessment_id === 0">
        <p>You currently have no reports available.</p>
      </div>

      <div v-show="assessment_id > 0 && completed === false">
        <p>Your report for {{ year }} is <em>in progress</em>, please complete all sections of the application.</p>
      </div>

      <div class="list-group">
        <div v-if="assessment_id > 0 && completed !== false">
          <router-link v-bind:to="{ name: 'assessmentresults' }"
            class="list-group-item list-group-item-action flex-column align-items-start">
            <p><strong>{{ institution }}</strong></p>
            <p> <span v-if="ep_service !== 'Other'">{{ ep_service }} </span>
              <span v-if="other_ep_system">{{ other_ep_system }}</span><br />
            </p>
            <p>{{ time_created }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <div class="footer-bar-buttons">
      <button><i class="bi bi-house"></i><span class="headerLink"><router-link
            to="/assessmentintro">Home</router-link></span></button>
      <button><i class="bi bi-box-arrow-right"></i><span class="headerLink"><router-link
            to="/login">Logout</router-link></span></button>
    </div>
    <AppLogo></AppLogo>

  </div>
</template>

<script>

import { settings } from '../settings'
import TabHeader from './TabHeader'
import AppLogo from "./AppLogo"
import { dataService } from "../services/data.service"
import _ from "lodash"

export default {
  name: "ResultsHome",
  components: {
    TabHeader,
    AppLogo
  },
  data() {
    return {
      assessment: [],
      assessment_id: 0,
      ep_service: '',
      institution: '',
      time_created: '',
      completed: false,
      year: settings.year
    }
  },
  methods: {

    getReports() {
      dataService.getReportByInstitutionId().then(data => {

        if (!_.isEmpty(data)) {

          this.assessment = data[0]
          // TODO test this further
          // empty array if assessment not started
          if (this.assessment) {

            this.assessment_id = this.assessment.assessmentId
            this.ep_service = this.assessment.system.ep_service
            this.institution = this.assessment.institution['orgName']
            let timestamp = this.assessment.system.time_created
            var date = new Date(timestamp * 1000).toLocaleDateString("en-GB")
            this.time_created = date

            if (this.assessment.prescriptionList.length !== 0) {
              this.completed = true
            }
          }
        }
      })
    }
  },
  created() {
    this.getReports()
  }
}
</script>

<style scoped>
#page {
  text-align: left;
}

#content {
  padding: 40px;
}

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

button a {
  padding: 3px;
}

.footer-bar-buttons {
  padding-left: 40px;
  padding-bottom: 20px;
}
</style>
