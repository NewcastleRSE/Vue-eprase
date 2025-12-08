<template>
  <main class="pt-5">
    <AppLogo cls="banner" />
    <div class="pb-3">
      <h1>Welcome to ePRaSE {{ year }}</h1>
      <p class="service-description mx-auto">
        The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate ePrescribing systems,
        in order to determine their effectiveness and to encourage the correct use of these systems
        and deliver improved patient outcomes.</p>
        <div class="alert alert-danger fw-bold" v-if="isDevelopmentSite">
          This is a test version of the site, NOT the live ePRaSE tool. Please DO NOT use this site, but instead go to the 
          <a href="https://eprase.nhs.uk/" title="Live ePRaSE tool" target="_blank" style="text-decoration:underline">live version of the tool</a>
        </div>
        <div class="row w-50 mx-auto">
          <Vueform>          
            <GroupElement name="buttonBar" :columns="12" :add-class="'mt-2'">
              <ButtonElement name="login" full
                :columns="6" 
                :add-class="'me-2'" 
                @click="onLoginClick">
                <i class="bi bi-person-circle me-2"></i>Log in
              </ButtonElement>            
              <ButtonElement name="register" full
                :columns="6" 
                :add-class="'mx-2'" 
                :disabled="isDevelopmentSite || $route.query.action === 'registered'" 
                @click="onRegisterClick">
                <i class="bi bi-person-fill-add me-2"></i>Register
              </ButtonElement>
              <!--
              <ButtonElement name="forgotpassword" full 
                :columns="4" 
                :add-class="'ms-2'" 
                :disabled="$route.query.action === 'registered'" 
                @click="onForgotPasswordClick">
                <i class="bi bi-key-fill me-2"></i>Forgot password?
              </ButtonElement>
              -->
            </GroupElement>
          </Vueform>  
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

export default {
  name: "AppWelcome",
  components: {
    AppLogo
  },
  computed: {
    ...mapState(appSettingsStore, ['version', 'year']),
    isDevelopmentSite() {
      return process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    onLoginClick() {
      this.$router.push("/login")
    },
    onRegisterClick() {
      this.$router.push('/register')
    },
    onForgotPasswordClick() {
      this.$router.push('/forgotpassword')
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
