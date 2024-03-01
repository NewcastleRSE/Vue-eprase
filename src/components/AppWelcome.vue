<template>
  <main>
    <AppLogo cls="banner" />
    <div class="pb-3">
      <h1>Welcome to ePRaSE 2024</h1>
      <p class="service-description mx-auto">
        The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescription services,
        in order to determine their effectiveness and to encourage the correct use of these systems
        and deliver improved patient outcomes.</p>
      <div class="py-4" v-if="appOpen">
        <button type="button" class="btn btn-lg btn-primary" @click="login()">
          Start
        </button>
      </div>
      <div v-if="!appOpen">
        <strong>This application is currently closed</strong>
      </div>
    </div>
    <div class="row w-75 mx-auto">
      <div class="col p-1">
        <img id="di-logo" src="../assets/images/Digital_Institute.jpg" alt="Digital Institute" />
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

export default {
  name: "AppWelcome",
  components: {
    AppLogo
  },
  computed: {
    ...mapState(appSettingsStore, ['version', 'appOpen'])
  },
  methods: {
    login() {
      this.$router.push("/login")
    },
    about() {
      this.$router.push("/about")
    },
  }
}
</script>

<style scoped>
.service-description {
  max-width: 600px;
}

#di-logo,
#pharm-logo {
  height: 50px;
  max-width: 200px;
}

#nuth-logo {
  height: 50px;
}
</style>
