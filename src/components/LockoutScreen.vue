<template>
  <main class="leftalign">

    <TabHeader :showIndex="1" />

    <div class="content p-4">

      <LoginInfo />
      <h3>Patient data section completed</h3>
      <h4>You have completed the initial phase of the assessment. The next stage is to complete the patient scenarios</h4>
      <div class="alert alert-warning" role="alert">          
        <p class="fw-bold">Reminder: the browser BACK button has been disabled. Attempts to leave or go back to previous
            scenarios will lead to your work being lost!</p>
      </div>

    
      <div class="buttons">
        <button type="button" class="btn btn-lg btn-primary" @click="onNextClick()">Next</button>
      </div>
    </div>
    <AppLogo cls="bottomright" />
  </main>
</template>

<script>

import TabHeader from './TabHeader'
import LoginInfo from './LoginInfo'
import AppLogo from './AppLogo'
import { patientService } from "../services/patient.service"

export default {
  name: "LockoutScreen",
  components: {
    TabHeader,
    LoginInfo,
    AppLogo
  },
  data() {
    return {
      patientscompleted: false,
    }
  },
  methods: {
    onNextClick() {
      if (this.patientscompleted) {
        patientService.setConfigErrors()
      }
      this.$router.push('/assessmentscenarios')
    }
  },
  created: function () {

    // if this is true, then the user has jumped from assessmentintro and will need to create patientlist and testlist
    this.patientscompleted = this.$route.query.patientscompleted

    if (this.patientscompleted) {
      this.nextEnabled = true
      this.disabled = false
      patientService.getCompletePatientDetailsFromIds()
    }
  },
  mounted: function () {
    history.pushState(null, null, location.href)
    window.onpopstate = function () {
      history.go(1)
    }
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

#timer {
  padding: 20px 0;
}

button:disabled {
  background-color: dimgray;
}

button {
  height: 40px;
  width: 100px;
  margin: 10px 0px;
  font-size: 1.2em;
  margin: 0 50px;
}

.lock-btn {
  background-color: #029a99;
  border: 0;
}

.footer {
  margin-top: 10px;
  margin-bottom: 40px;
}

.footer p {
  padding-bottom: 10px;
}
</style>
