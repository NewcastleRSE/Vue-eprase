<template>
  <main class="pt-5">
    <AppLogo cls="banner" />
    <div class="pb-3">
      <h1>Welcome to ePRaSE 2024</h1>
      <p class="service-description mx-auto">
        The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescribing systems,
        in order to determine their effectiveness and to encourage the correct use of these systems
        and deliver improved patient outcomes.</p>
      <div class="py-4" v-if="appOpen">
        <button v-if="!isLoggedIn" type="button" class="btn btn-lg btn-primary me-3" @click="onLoginClick">
          Login
        </button>
        <button v-if="isLoggedIn" type="button" class="btn btn-lg btn-primary me-3" @click="onResumeClick">
          Resume assessment
        </button>
        <button v-if="!isLoggedIn" type="button" class="btn btn-lg btn-primary" @click="onRegisterClick">
          Register
        </button>
      </div>
      <div v-if="!appOpen">
        <span class="fw-bold">This application is currently closed</span>
      </div>
    </div>
    <div class="row w-75 mx-auto">
      <div class="col p-1">
        <img id="nhse-logo" src="../assets/images/NHS-England-Logo.jpg" alt="NHS England" />
      </div>
      <div class="col p-1">
        <img id="nuth-logo" src="../assets/images/NUTHlogo.png"
          alt="The Newcastle upon Tyne Hospitals NHS Foundation Trust" />
      </div>
      <div class="col p-1">
        <img id="pharm-logo" src="../assets/images/pharmacy.png" alt="School of Pharmacy" />
      </div>
    </div>
    <div class="version-text pt-5">Version {{ version }}</div>
  </main>
</template>

<script>

import { mapState } from 'pinia'
import AppLogo from "./AppLogo"
import { appSettingsStore } from '../stores/appSettings'
import { authenticationStore } from '../stores/authentication'

export default {
  name: "AppWelcome",
  components: {
    AppLogo
  },
  computed: {
    ...mapState(appSettingsStore, ['version', 'appOpen']),
    ...mapState(authenticationStore, ['isLoggedIn'])
  },
  methods: {
    onLoginClick() {
      this.$router.push("/login")
    },
    onRegisterClick() {
      this.$router.push('/register')
    },
    onResumeClick() {
      this.$router.push('/assessmentintro')
    }
  }
}
</script>

<style scoped>
.service-description {
  max-width: 600px;
}

#nhse-logo,
#pharm-logo {
  height: 50px;
  max-width: 200px;
}

#nuth-logo {
  height: 50px;
}
</style>
