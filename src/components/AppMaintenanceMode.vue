<template>
  <main class="pt-5">
    <AppLogo cls="banner" />
    <div class="pb-3">
      <h1>Welcome to ePRaSE {{ year }}</h1>
      <div class="maintenance-text alert alert-danger">
        The ePRaSE tool is currently down for essential maintenance.  Please try again later.
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
  name: 'AppMaintenanceMode',
  components: {
    AppLogo
  },
  computed: {
    ...mapState(appSettingsStore, ['version', 'year'])
  }
}
</script>

<style scoped>

.maintenance-text {
  max-width: 800px;
  margin: auto;
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
