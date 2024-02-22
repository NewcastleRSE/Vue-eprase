<template>
  <main>
    <div class="pb-3">
      <img src="../assets/images/logo-full.png" alt="Welcome to the ePRaSE Tool" class="eprase-logo" />
    </div>
    <div class="pb-3">
      <h1>Welcome to ePRaSE 2024</h1>
      <p>
        The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to
        evaluate ePrescription services, in order to determine their
        effectiveness and to encourage the correct use of these systems and
        deliver improved patient outcomes.
      </p>
      <div class="pb-3" v-if="appOpen">
        <button type="button" class="btn btn-primary" @click="login()">
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
    <div class="pt-3">Version {{ version }}</div>
  </main>
</template>

<script>

import { mapState } from 'pinia'
import { appSettingsStore } from '../stores/appSettings'

export default {
  name: "AppWelcome",  
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
#di-logo,
#pharm-logo {
  height: 50px;
  max-width: 200px;
}

#nuth-logo {
  height: 50px;
}
</style>
